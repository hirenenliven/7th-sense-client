import { useMemo, useState } from 'react'
import { Alert, Card, Col, Form, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import ChartCard from '@/components/charts/ChartCard'
import Loader from '@/components/common/Loader'
import { modeTypeOf } from '@/constants/machines'
import useLoad from '@/hooks/useLoad'
import { getFinishCycles, getModeTotals, getOee } from '@/services/productivityService'
import { PICKER_LOCALE, formatModeDuration, todayIso } from '@/utils/dateTime'
import {
  DEFAULT_MODE_RANGE,
  DEFAULT_SCHEDULE_MODE,
  KPI_REFRESH_MS,
  MODE_RANGES,
  SUMMARY_MODE_IDS,
  SUMMARY_MODE_PARTS,
  formatCount,
  formatCycle,
  percent,
} from './productivitySettings'

const SUMMARY_MODES = SUMMARY_MODE_IDS.map(modeTypeOf)

const sinceLabel = new Intl.DateTimeFormat(PICKER_LOCALE, { day: '2-digit', month: 'short', year: 'numeric' })

// Seconds per mode id from the server's totals
const modeSeconds = (data) => Object.fromEntries(data.totals.map((total) => [total.modeId, total.durationSec]))

// Seconds of a summary tile: its mode, plus the modes it includes (SUMMARY_MODE_PARTS)
const tileSeconds = (seconds, modeId) =>
  (SUMMARY_MODE_PARTS[modeId] ?? [modeId]).reduce((sum, id) => sum + (seconds[id] ?? 0), 0)

// Seconds the totals cover (from … to, never after now): shares are of this whole span, so time
// with no record (before collection started) is not shared out among the modes
const spanSeconds = (data) => (data.from ? (new Date(data.to) - new Date(data.from)) / 1000 : 0)

const tileShape = PropTypes.shape({
  key: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.string,
  color: PropTypes.string,
  meta: PropTypes.string,
})

function SummaryTile({ tile }) {
  return (
    <Card className="ts-kpi h-100">
      <Card.Body>
        <div className="ts-kpi-label">
          {tile.color ? (
            <svg className="me-1" width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
              <circle cx="4" cy="4" r="4" fill={tile.color} />
            </svg>
          ) : (
            <i className={`bi ${tile.icon} me-1`} aria-hidden="true" />
          )}
          {tile.label}
        </div>
        <div className="ts-kpi-value font-tabular">{tile.value}</div>
        {tile.meta && <div className="ts-kpi-meta small text-body-secondary">{tile.meta}</div>}
      </Card.Body>
    </Card>
  )
}

SummaryTile.propTypes = { tile: tileShape.isRequired }

// One summary card: its own load (reloaded every KPI_REFRESH_MS) shown as KPI tiles; `actions` go in
// the card header (e.g. the Machine Modes period select)
function SummaryCard({ title, subtitle, icon, actions, state, tiles, cols }) {
  const renderBody = () => {
    if (state.loading) return <Loader text={`Loading ${title.toLowerCase()}…`} />
    if (state.error && !tiles) return <Alert variant="danger" className="mb-0">{state.error}</Alert>
    return (
      <Row xs={1} sm={2} {...cols} className="g-3">
        {tiles.map((tile) => (
          <Col key={tile.key}>
            <SummaryTile tile={tile} />
          </Col>
        ))}
      </Row>
    )
  }

  return (
    <ChartCard title={title} subtitle={subtitle} icon={icon} actions={actions}>
      {renderBody()}
    </ChartCard>
  )
}

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  actions: PropTypes.node,
  state: PropTypes.shape({ loading: PropTypes.bool, error: PropTypes.string }).isRequired,
  tiles: PropTypes.arrayOf(tileShape),
  cols: PropTypes.object.isRequired,
}

// The machine's summary as three cards, each with its own request: today's Cycles (GET
// /productivity/finish-cycles) and OEE (GET /productivity/oee, without schedule), and Machine Modes
// (GET /productivity/mode-totals) over the period picked on the card: Today (default), Yesterday,
// Last 7 / 30 days or All time. Today is read on every render, so a refresh after midnight moves on.
function SummaryCards({ machineId }) {
  const today = todayIso()
  const [modeRangeValue, setModeRangeValue] = useState(DEFAULT_MODE_RANGE)
  const modeRange = MODE_RANGES.find((range) => range.value === modeRangeValue)
  const modeQuery = modeRange.query(today)

  const options = { refreshMs: KPI_REFRESH_MS }
  const cycleState = useLoad(() => getFinishCycles({ machineId, date: today }), `cycles|${machineId}|${today}`, options)
  const oeeState = useLoad(
    () => getOee({ machineIds: [machineId], from: today, to: today, schedule: DEFAULT_SCHEDULE_MODE }),
    `oee|${machineId}|${today}`,
    options,
  )
  const modeState = useLoad(
    () => getModeTotals(machineId, modeQuery),
    `modes|${machineId}|${JSON.stringify(modeQuery)}`,
    options,
  )

  const cycleTiles = useMemo(() => {
    if (!cycleState.data) return null
    const { summary } = cycleState.data
    const average = summary.completedCount ? summary.averageCycleSec : null
    return [
      { key: 'total', label: 'Total Cycle', icon: 'bi-arrow-repeat', value: formatCount(summary.cycleCount) },
      { key: 'finished', label: 'Finished Cycle', icon: 'bi-check2-circle', value: formatCount(summary.completedCount) },
      { key: 'unfinished', label: 'Unfinished Cycle', icon: 'bi-x-circle', value: formatCount(summary.unfinishedCount) },
      { key: 'average', label: 'Average Cycle Time', icon: 'bi-stopwatch', value: average == null ? '—' : formatCycle(average) },
    ]
  }, [cycleState.data])

  const oeeTiles = useMemo(() => {
    if (!oeeState.data) return null
    const day = oeeState.data.rows?.[0]
    return [
      {
        key: 'availability',
        label: 'Availability',
        icon: 'bi-power',
        value: percent(day?.availability),
        meta: 'Utilization: run time of the day so far',
      },
      { key: 'performance', label: 'Performance', icon: 'bi-speedometer2', value: percent(day?.performance) },
      { key: 'quality', label: 'Quality', icon: 'bi-patch-check', value: percent(day?.quality) },
      { key: 'oee', label: 'OEE', icon: 'bi-graph-up', value: percent(day?.oee) },
    ]
  }, [oeeState.data])

  const modeTiles = useMemo(() => {
    if (!modeState.data) return null
    const seconds = modeSeconds(modeState.data)
    const span = spanSeconds(modeState.data)
    return SUMMARY_MODES.map((mode) => {
      const modeTotal = tileSeconds(seconds, mode.id)
      return {
        key: `mode-${mode.id}`,
        label: mode.label,
        color: mode.color,
        value: formatModeDuration(modeTotal),
        meta: span > 0 ? `${percent(Math.min(100, (modeTotal / span) * 100))} of ${modeRange.noun}` : undefined,
      }
    })
  }, [modeState.data, modeRange.noun])

  // All time: since when (the first recorded period); other periods name themselves
  const modeSince = modeRange.value === 'all' && modeState.data?.from ? ` since ${sinceLabel.format(new Date(modeState.data.from))}` : ''

  return (
    <Row xs={1} xl={2} className="g-3">
      <Col>
        <SummaryCard
          title="Cycles"
          subtitle="Today · cycles started, finished and their average time"
          icon="bi-arrow-repeat"
          state={cycleState}
          tiles={cycleTiles}
          cols={{ lg: 4, xl: 2 }}
        />
      </Col>
      <Col>
        <SummaryCard
          title="OEE"
          subtitle="Today · OEE = Availability × Productivity × Quality"
          icon="bi-speedometer2"
          state={oeeState}
          tiles={oeeTiles}
          cols={{ lg: 4, xl: 2 }}
        />
      </Col>
      <Col xl={12}>
        <SummaryCard
          title="Machine Modes"
          subtitle={`${modeRange.label}${modeSince} · time in each machine mode`}
          icon="bi-clock-history"
          actions={
            <Form.Select
              size="sm"
              className="w-auto"
              value={modeRangeValue}
              onChange={(event) => setModeRangeValue(event.target.value)}
              aria-label="Machine modes period"
            >
              {MODE_RANGES.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </Form.Select>
          }
          state={modeState}
          tiles={modeTiles}
          cols={{ lg: 3, xxl: 6 }}
        />
      </Col>
    </Row>
  )
}

SummaryCards.propTypes = {
  machineId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
}

export default SummaryCards
