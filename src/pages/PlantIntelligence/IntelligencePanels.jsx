import { useMemo, useState } from 'react'
import { Badge, Button, ButtonGroup, Col, ProgressBar, Row, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ChartCard from '@/components/charts/ChartCard'
import StackedBarChart from '@/components/charts/StackedBarChart'
import SortableHead from '@/components/common/SortableHead'
import { modeTypeOf } from '@/constants/machines'
import { machineMonitorPath, monitoringSearchPath } from '@/constants/monitoring'
import { ROUTES } from '@/constants/routes'
import useTableSort from '@/hooks/useTableSort'
import { KpiTile } from '@/pages/Home/HomeCards'
import { ATTENTION_MINUTES, ATTENTION_MODE_IDS, OTHER_MODE, fleetModeCounts, scoreTone, secondsInMode } from '@/pages/Home/homeSettings'
import { ActionRow } from '@/pages/OperationsCenter/OpsPanels'
import { OEE_DOMAIN, OEE_TICKS, formatCount, percent } from '@/pages/Productivity/productivitySettings'
import { PICKER_LOCALE, formatModeDuration } from '@/utils/dateTime'
import { ALARM_LIMIT, INSIGHT_LIMIT, STUCK_LIMIT, dayLabel, timeChart, weekdayLabel } from './intelligenceSettings'

const lastSeenLabel = new Intl.DateTimeFormat(PICKER_LOCALE, { day: '2-digit', month: 'short' })
const SPARK_WIDTH = 100
const SPARK_HEIGHT = 24

// A small line of the days, in the tile's tone; days without a value are skipped
function Sparkline({ values }) {
  const known = values.map((value, index) => ({ value, index })).filter((point) => point.value != null)
  if (known.length < 2) return null
  const numbers = known.map((point) => point.value)
  const low = Math.min(...numbers)
  const range = Math.max(...numbers) - low || 1
  const points = known
    .map(({ value, index }) => `${(index / (values.length - 1)) * SPARK_WIDTH},${SPARK_HEIGHT - ((value - low) / range) * (SPARK_HEIGHT - 2) - 1}`)
    .join(' ')
  return (
    <svg className="ts-int-spark" viewBox={`0 0 ${SPARK_WIDTH} ${SPARK_HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
      <polyline points={points} />
    </svg>
  )
}

Sparkline.propTypes = { values: PropTypes.arrayOf(PropTypes.number).isRequired }

// The period in six tiles, each with its line of the days
export function PeriodTiles({ analysis, today, periodLabel }) {
  const { trend } = analysis
  const line = (key) => trend.map((day) => day[key])
  const days = trend.length
  const tiles = [
    { key: 'oee', label: 'OEE today', icon: 'bi-speedometer2', tone: scoreTone(today.oee?.oee), value: percent(today.oee?.oee),
      spark: line('oee'), meta: `Average of daily OEE: ${percent(analysis.oeeAverage)}` },
    { key: 'availability', label: 'Availability', icon: 'bi-power', tone: scoreTone(analysis.availability), value: percent(analysis.availability),
      spark: line('availability'), meta: `Run time of planned time, ${periodLabel}` },
    { key: 'quality', label: 'Quality', icon: 'bi-patch-check', tone: scoreTone(analysis.quality), value: percent(analysis.quality),
      spark: line('closedQuality'), meta: `Completed of closed cycles, ${periodLabel}` },
    { key: 'cycles', label: 'Cycles completed', icon: 'bi-arrow-repeat', tone: 'info', value: formatCount(analysis.completed),
      spark: line('finished'), meta: `${formatCount(Math.round(analysis.completed / days))} a day · ${formatCount(analysis.unfinished)} unfinished` },
    { key: 'connected', label: 'Connected time', icon: 'bi-wifi', tone: scoreTone(analysis.connected), value: percent(analysis.connected),
      spark: line('connected'), meta: `${formatCount(today.fleet.online)} of ${formatCount(today.fleet.total)} machines online now`, to: ROUTES.MONITORING },
    { key: 'alarms', label: 'Alarm raises', icon: 'bi-bell', tone: analysis.alarmCount ? 'warning' : 'neutral', value: formatCount(analysis.alarmCount),
      spark: line('alarms'), meta: `${formatCount(analysis.alarms.length)} alarm code${analysis.alarms.length === 1 ? '' : 's'}, ${periodLabel}` },
  ]
  return (
    <Row xs={2} md={3} xxl={6} className="g-3">
      {tiles.map(({ spark, meta, ...tile }) => (
        <Col key={tile.key}>
          <KpiTile
            tile={{
              ...tile,
              meta: (
                <div className="w-100">
                  <Sparkline values={spark} />
                  {meta}
                </div>
              ),
            }}
          />
        </Col>
      ))}
    </Row>
  )
}

PeriodTiles.propTypes = { analysis: PropTypes.object.isRequired, today: PropTypes.object.isRequired, periodLabel: PropTypes.string.isRequired }

// Right now: the fleet as one bar in mode colours, and the machines stuck longest
export function NowCard({ today, showCustomer }) {
  const { fleet, machines, serverTime } = today
  const modes = fleetModeCounts(fleet.modes).filter((mode) => mode.count > 0)
  const stuck = useMemo(
    () =>
      machines
        .filter((machine) => ATTENTION_MODE_IDS.includes(machine.modeId))
        .map((machine) => ({ ...machine, seconds: secondsInMode(machine, serverTime) }))
        .filter((machine) => machine.seconds >= ATTENTION_MINUTES * 60)
        .sort((a, b) => b.seconds - a.seconds),
    [machines, serverTime],
  )
  let start = 0

  return (
    <ChartCard title="Right now" subtitle={`Live · ${formatCount(fleet.total)} active machines, refreshed every 30 s`} icon="bi-broadcast">
      <Row className="g-3 align-items-center">
        <Col lg={7}>
          <svg className="ts-int-fleet-bar" width="100%" height="100%" role="img" aria-label={modes.map((mode) => `${mode.label} ${mode.count}`).join(', ')}>
            {modes.map((mode) => {
              const width = (mode.count / Math.max(fleet.total, 1)) * 100
              const rect = <rect key={mode.id} x={`${start}%`} width={`${width}%`} height="100%" fill={mode.color} />
              start += width
              return rect
            })}
          </svg>
          <div className="ts-ops-chips mt-2">
            {modes.map((mode) => (
              <Link
                key={mode.id}
                to={mode.id === OTHER_MODE.id ? ROUTES.MONITORING : monitoringSearchPath(mode.label)}
                className={`ts-ops-chip ts-tone-${mode.id === OTHER_MODE.id ? 'neutral' : `mode-${mode.id}`} text-decoration-none`}
              >
                <i className="ts-dot" aria-hidden="true" />
                {mode.label} <span className="font-tabular">{formatCount(mode.count)}</span>
              </Link>
            ))}
          </div>
        </Col>
        <Col lg={5}>
          {stuck.length ? (
            <ul className="list-unstyled mb-0">
              {stuck.slice(0, STUCK_LIMIT).map((machine) => (
                <li key={machine.machineId} className="ts-int-stuck">
                  <Link to={machineMonitorPath(ROUTES.MACHINE_PRODUCTIVITY, { id: machine.machineId })} className="text-truncate">
                    {machine.machineName}
                  </Link>
                  <span className="small text-body-secondary text-truncate">{showCustomer ? machine.customerName : modeTypeOf(machine.modeId)?.label}</span>
                  <span className="font-tabular text-nowrap">{formatModeDuration(machine.seconds)}</span>
                </li>
              ))}
              {stuck.length > STUCK_LIMIT && <li className="small text-body-secondary">{formatCount(stuck.length - STUCK_LIMIT)} more in Downtime or Hold</li>}
            </ul>
          ) : (
            <p className="small text-body-secondary mb-0">
              <i className="bi bi-check2-circle text-success me-1" aria-hidden="true" />
              No machine has been in Downtime or Hold for {ATTENTION_MINUTES} minutes.
            </p>
          )}
        </Col>
      </Row>
    </ChartCard>
  )
}

NowCard.propTypes = { today: PropTypes.object.isRequired, showCustomer: PropTypes.bool.isRequired }

// The period's findings in words, most serious first
export function InsightsCard({ insights, periodLabel }) {
  const critical = insights.filter((insight) => insight.severity === 'critical').length
  return (
    <ChartCard
      title="What the data says"
      subtitle={`Worked out from the figures, ${periodLabel}`}
      icon="bi-lightbulb"
      actions={critical > 0 && <Badge bg="danger">{formatCount(critical)} critical</Badge>}
    >
      {insights.length ? (
        <ul className="list-unstyled mb-0">
          {insights.slice(0, INSIGHT_LIMIT).map((insight) => (
            <ActionRow key={insight.key} action={insight} />
          ))}
        </ul>
      ) : (
        <div className="ts-empty">
          <i className="bi bi-check2-circle ts-empty-icon" aria-hidden="true" />
          <p className="mb-0">Not enough data for a finding yet.</p>
        </div>
      )}
    </ChartCard>
  )
}

InsightsCard.propTypes = { insights: PropTypes.arrayOf(PropTypes.object).isRequired, periodLabel: PropTypes.string.isRequired }

// Where the machine time went per day, with the period's total per mode beside it. A mostly offline
// fleet hides everything else, so the chart can leave out the time without a connection.
export function TimeLossCard({ days, analysis, periodLabel }) {
  const [connectedOnly, setConnectedOnly] = useState(true)
  const chart = useMemo(() => timeChart(days, connectedOnly), [days, connectedOnly])
  const rows = [...analysis.timeRows].sort((a, b) => b.value - a.value)
  const views = [
    { value: true, label: 'Connected time' },
    { value: false, label: 'All time' },
  ]

  return (
    <ChartCard
      title="Where the machine time went"
      subtitle={`Share of ${connectedOnly ? 'the connected time' : 'all machine time'} per day · period totals of all machine time, ${periodLabel}`}
      icon="bi-bar-chart-steps"
      actions={
        <ButtonGroup size="sm" aria-label="Time shown">
          {views.map((view) => (
            <Button key={view.label} variant={view.value === connectedOnly ? 'primary' : 'ghost'} aria-pressed={view.value === connectedOnly} onClick={() => setConnectedOnly(view.value)}>
              {view.label}
            </Button>
          ))}
        </ButtonGroup>
      }
    >
      <Row className="g-3 flex-grow-1">
        <Col lg={7}>
          <StackedBarChart
            data={chart.rows}
            series={chart.series}
            yUnit="%"
            yDomain={OEE_DOMAIN}
            yTicks={OEE_TICKS}
            valueFormatter={percent}
            emptyText="The machines were not connected in this period."
          />
        </Col>
        <Col lg={5}>
          <ul className="list-unstyled mb-0">
            {rows.map((row) => (
              <li key={row.key} className={`ts-home-time-row ts-tone-${row.tone}`}>
                <i className="ts-dot" aria-hidden="true" />
                <span className="text-truncate">{row.label}</span>
                <span className="font-tabular text-body-secondary">{formatModeDuration(row.value)}</span>
                <span className="ts-home-time-share font-tabular">{percent(analysis.spanSec ? (row.value / analysis.spanSec) * 100 : 0)}</span>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </ChartCard>
  )
}

TimeLossCard.propTypes = {
  days: PropTypes.arrayOf(PropTypes.object).isRequired,
  analysis: PropTypes.object.isRequired,
  periodLabel: PropTypes.string.isRequired,
}

// Lines (or customers) side by side over the period, lowest availability first
export function GroupsCard({ rows, byCustomer, periodLabel }) {
  const noun = byCustomer ? 'Customer' : 'Line'
  const ranked = useMemo(() => [...rows].sort((a, b) => (a.availability ?? 0) - (b.availability ?? 0)), [rows])
  const columns = [
    { label: noun, sort: (row) => row.name },
    { label: 'Ran', sort: (row) => row.ranCount },
    { label: 'Online', sort: (row) => row.onlineCount },
    { label: 'Availability', sort: (row) => row.availability },
    { label: 'Cycles', sort: (row) => row.completed },
    { label: 'Unfinished', sort: (row) => row.unfinishedRate },
  ]
  const { sortedRows, sort, onSort } = useTableSort(ranked, columns)

  return (
    <ChartCard title={`${noun}s compared`} subtitle={`Average machine availability and cycles, ${periodLabel} · lowest first`} icon="bi-diagram-3">
      <div className="ts-table-panel ts-int-table-scroll">
        <Table responsive size="sm" className="mb-0">
          <SortableHead columns={columns} sort={sort} onSort={onSort} />
          <tbody>
            {sortedRows.map((row) => (
              <tr key={row.name}>
                <td className="fw-semibold">{row.name}</td>
                <td className="font-tabular text-nowrap">{formatCount(row.ranCount)} / {formatCount(row.machineCount)}</td>
                <td className="font-tabular">{formatCount(row.onlineCount)}</td>
                <td className={`ts-ops-plan-cell ts-int-bar ts-tone-${scoreTone(row.availability)}`}>
                  <span className="font-tabular">{percent(row.availability)}</span>
                  <ProgressBar now={row.availability ?? 0} aria-hidden="true" />
                </td>
                <td className="font-tabular">{formatCount(row.completed)}</td>
                <td className="font-tabular">{percent(row.unfinishedRate)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </ChartCard>
  )
}

GroupsCard.propTypes = { rows: PropTypes.arrayOf(PropTypes.object).isRequired, byCustomer: PropTypes.bool.isRequired, periodLabel: PropTypes.string.isRequired }

// The alarm codes that make most of the raises, and on how many days each was seen: a code on most days
// is a standing problem, one with many raises on a single day is an event
export function AlarmParetoCard({ alarms, dayCount, periodLabel }) {
  const shown = alarms.slice(0, ALARM_LIMIT)
  return (
    <ChartCard title="Alarm Pareto" subtitle={`Most raised codes, ${periodLabel} · from each day's top codes`} icon="bi-bell">
      {shown.length ? (
        <div className="ts-table-panel">
          <Table responsive size="sm" className="mb-0">
            <thead>
              <tr>
                <th>Code</th>
                <th>Raised</th>
                <th>Share</th>
                <th>Running</th>
                <th>Days</th>
                <th>Last</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((alarm) => (
                <tr key={alarm.code}>
                  <td>
                    <span className="font-monospace">{alarm.code}</span>
                    {alarm.message && <div className="small text-body-secondary ts-int-alarm-text text-truncate" title={alarm.message}>{alarm.message}</div>}
                  </td>
                  <td className="font-tabular">{formatCount(alarm.count)}</td>
                  <td className="ts-ops-plan-cell ts-int-bar ts-tone-warning">
                    <span className="font-tabular">{percent(alarm.share)}</span>
                    <ProgressBar now={alarm.share} aria-hidden="true" />
                  </td>
                  <td className="font-tabular">{percent(alarm.cumulative)}</td>
                  <td className="font-tabular text-nowrap">{formatCount(alarm.daysSeen)} / {formatCount(dayCount)}</td>
                  <td className="font-tabular text-nowrap">{lastSeenLabel.format(new Date(alarm.lastAt))}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="ts-empty">
          <i className="bi bi-bell-slash ts-empty-icon" aria-hidden="true" />
          <p className="mb-0">No alarm raised in this period.</p>
        </div>
      )}
    </ChartCard>
  )
}

AlarmParetoCard.propTypes = { alarms: PropTypes.arrayOf(PropTypes.object).isRequired, dayCount: PropTypes.number.isRequired, periodLabel: PropTypes.string.isRequired }

// The next days at a glance: machines scheduled, shifts working, holidays and week offs
export function OutlookCard({ rows, machineTotal, canAdd }) {
  const knowsCompany = rows.some((row) => row.shiftCount != null)
  return (
    <ChartCard
      title="Next 7 days"
      subtitle={knowsCompany ? 'Machines with a schedule, shifts working, holidays and week offs' : 'Machines with a schedule · pick a customer for its shifts and holidays'}
      icon="bi-calendar-week"
      actions={
        <Link to={canAdd ? ROUTES.PRODUCTION_SCHEDULE_ADD : ROUTES.PRODUCTION_SCHEDULE} className="small">
          {canAdd ? 'Add schedule' : 'Open schedule'}
        </Link>
      }
    >
      <ul className="list-unstyled mb-0">
        {rows.map((row, index) => (
          <li key={row.date} className="ts-int-outlook">
            <span className={index === 0 ? 'fw-semibold' : undefined}>
              {index === 0 ? 'Today' : weekdayLabel(row.date)}
              <span className="d-block small fw-normal text-body-secondary">{dayLabel(row.date)}</span>
            </span>
            <span className="ts-ops-plan-cell ts-int-bar ts-tone-info">
              <span className="small text-truncate" title={row.machines.join(', ')}>
                {row.machines.length ? `${formatCount(row.machines.length)} of ${formatCount(machineTotal)} · ${row.machines.slice(0, 3).join(', ')}${row.machines.length > 3 ? '…' : ''}` : 'No machine scheduled'}
              </span>
              <ProgressBar now={machineTotal ? (row.machines.length / machineTotal) * 100 : 0} aria-hidden="true" />
            </span>
            <span className="small text-body-secondary text-end text-nowrap">
              {row.dayOff ? (
                <Badge bg="warning" text="dark">{row.dayOff}</Badge>
              ) : (
                row.shiftCount != null && `${formatCount(row.shiftCount)} shift${row.shiftCount === 1 ? '' : 's'}`
              )}
            </span>
          </li>
        ))}
      </ul>
    </ChartCard>
  )
}

OutlookCard.propTypes = { rows: PropTypes.arrayOf(PropTypes.object).isRequired, machineTotal: PropTypes.number.isRequired, canAdd: PropTypes.bool.isRequired }
