import { Card, Col, ProgressBar, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import BarLineChart from '@/components/charts/BarLineChart'
import ChartCard from '@/components/charts/ChartCard'
import DonutChart from '@/components/charts/DonutChart'
import { monitoringSearchPath } from '@/constants/monitoring'
import { ROUTES } from '@/constants/routes'
import { formatCount, percent } from '@/pages/Productivity/productivitySettings'
import {
  HOURLY_BARS,
  HOURLY_LINES,
  OTHER_MODE,
  TIME_GROUPS,
  UNRECORDED_GROUP,
  fleetModeCounts,
  hourLabel,
  scoreTone,
  timeShare,
  UNFINISHED_WARNING,
  unfinishedRate,
} from './homeSettings'

const tileShape = PropTypes.shape({
  key: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
  tone: PropTypes.string.isRequired,
  icon: PropTypes.string,
  meta: PropTypes.node,
  progress: PropTypes.number,
  to: PropTypes.string,
})

// One KPI tile: an icon badge (a dot when there is no icon) whose icon and bar take the tile's tone
// (`.ts-tone-<tone>`: good, warning, critical, info, neutral or mode-<id>), the value and an
// optional line under it; `to` makes the whole tile a link
export function KpiTile({ tile }) {
  const body = (
    <Card.Body>
      <div className="ts-home-tile-head">
        <span className="ts-home-tile-icon" aria-hidden="true">
          {tile.icon ? <i className={`bi ${tile.icon}`} /> : <i className="ts-dot" />}
        </span>
        <span className="ts-kpi-label">{tile.label}</span>
        {tile.to && <i className="bi bi-arrow-right ts-drill ms-auto" aria-hidden="true" />}
      </div>
      <div className="ts-kpi-value font-tabular">{tile.value}</div>
      {tile.progress != null && <ProgressBar now={Math.min(100, tile.progress)} aria-hidden="true" />}
      {tile.meta && <div className="ts-kpi-meta small text-body-secondary">{tile.meta}</div>}
    </Card.Body>
  )
  const className = `ts-kpi ts-home-tile ts-tone-${tile.tone} h-100`
  if (tile.to) {
    return (
      <Card as={Link} to={tile.to} className={`${className} card-clickable text-reset text-decoration-none`}>
        {body}
      </Card>
    )
  }
  return <Card className={className}>{body}</Card>
}

KpiTile.propTypes = { tile: tileShape.isRequired }

function TileRow({ tiles, cols }) {
  return (
    <Row xs={2} {...cols} className="g-3">
      {tiles.map((tile) => (
        <Col key={tile.key}>
          <KpiTile tile={tile} />
        </Col>
      ))}
    </Row>
  )
}

TileRow.propTypes = { tiles: PropTypes.arrayOf(tileShape).isRequired, cols: PropTypes.object.isRequired }

// Fleet now: connection counts, then a tile per mode with its share of the fleet (each opens
// Monitoring searched by that mode's name; Other modes opens the whole list)
export function FleetCard({ fleet }) {
  const share = (count) => (fleet.total ? (count / fleet.total) * 100 : 0)
  const statusTiles = [
    { key: 'total', label: 'Machines', icon: 'bi-cpu', tone: 'neutral', value: formatCount(fleet.total),
      meta: fleet.inactive ? `${formatCount(fleet.inactive)} inactive not counted` : 'Active machines' },
    { key: 'online', label: 'Online', icon: 'bi-wifi', tone: 'good', value: formatCount(fleet.online),
      progress: fleet.total ? share(fleet.online) : undefined,
      meta: fleet.total ? `${percent(share(fleet.online))} of machines` : undefined },
    { key: 'offline', label: 'Offline', icon: 'bi-wifi-off', tone: fleet.offline ? 'critical' : 'neutral',
      value: formatCount(fleet.offline), meta: 'Not connected now' },
    { key: 'awaiting', label: 'Awaiting data', icon: 'bi-hourglass-split', tone: fleet.awaitingData ? 'warning' : 'neutral',
      value: formatCount(fleet.awaitingData), meta: 'No mode collected yet' },
  ]
  const modes = fleetModeCounts(fleet.modes)
  const modeTiles = modes.map((mode) => ({
    key: `mode-${mode.id}`, label: mode.label, tone: mode.id === OTHER_MODE.id ? 'neutral' : `mode-${mode.id}`,
    value: formatCount(mode.count), progress: share(mode.count),
    meta: fleet.total ? `${percent(share(mode.count))} of fleet` : undefined,
    to: mode.id === OTHER_MODE.id ? ROUTES.MONITORING : monitoringSearchPath(mode.label),
  }))

  return (
    <ChartCard title="Fleet now" subtitle="Live · machines by connection and current mode" icon="bi-broadcast">
      <TileRow tiles={statusTiles} cols={{ lg: 4 }} />
      <div className="mt-3">
        <TileRow tiles={modeTiles} cols={{ md: 3, xxl: modeTiles.length }} />
      </div>
    </ChartCard>
  )
}

FleetCard.propTypes = { fleet: PropTypes.object.isRequired }

// The day: OEE with its parts, utilization, parts against the plan and cycles. OEE and utilization
// take the colour of their score (scoreTone), unfinished cycles turn the cycles tile amber.
export function DayCard({ home, dayNoun }) {
  const { oee, cycles, plan } = home
  const rate = unfinishedRate(cycles)
  const planShare = plan?.quantity ? (plan.partsMade / plan.quantity) * 100 : null
  const tiles = [
    { key: 'oee', label: 'OEE', icon: 'bi-speedometer2', tone: scoreTone(oee?.oee), value: percent(oee?.oee),
      progress: oee?.oee ?? undefined,
      meta: oee ? `A ${percent(oee.availability)} · P ${percent(oee.performance)} · Q ${percent(oee.quality)}` : 'No time recorded yet' },
    { key: 'utilization', label: 'Utilization', icon: 'bi-power', tone: scoreTone(oee?.availability), value: percent(oee?.availability),
      progress: oee?.availability ?? undefined, meta: `Run time of ${dayNoun}` },
    { key: 'parts', label: 'Parts made', icon: 'bi-box-seam', tone: 'info', value: formatCount(cycles.partsMade),
      progress: planShare ?? undefined,
      meta: plan
        ? `${formatCount(plan.partsMade)} of ${formatCount(plan.quantity)} planned · ${percent(planShare)}`
        : 'No job scheduled' },
    { key: 'cycles', label: 'Cycles completed', icon: 'bi-arrow-repeat', tone: rate != null && rate >= UNFINISHED_WARNING ? 'warning' : 'neutral',
      value: formatCount(cycles.completedCount),
      meta: `${formatCount(cycles.unfinishedCount)} unfinished${rate == null ? '' : ` · ${percent(rate)} of closed`}${
        cycles.runningCount ? ` · ${formatCount(cycles.runningCount)} running` : ''}` },
  ]

  return (
    <ChartCard title="Performance" subtitle="Machines together, weighted by their time · same rules as Productivity" icon="bi-graph-up">
      <TileRow tiles={tiles} cols={{ lg: 4 }} />
    </ChartCard>
  )
}

DayCard.propTypes = { home: PropTypes.object.isRequired, dayNoun: PropTypes.string.isRequired }

// Where the machines' time went: mode groups and the time with no record, as shares of the day
export function TimeCard({ time }) {
  const seconds = Object.fromEntries(time.groups.map((group) => [group.group, group.durationSec]))
  const recorded = time.groups.reduce((sum, group) => sum + group.durationSec, 0)
  const data = [
    ...TIME_GROUPS.map((group) => ({ ...group, value: seconds[group.key] ?? 0 })),
    { ...UNRECORDED_GROUP, value: Math.max(0, time.spanSec - recorded) },
  ].filter((item) => item.value > 0)
  const production = seconds.production ?? 0

  return (
    <ChartCard title="Where the time went" subtitle="Donut · time of every machine by mode group" icon="bi-pie-chart">
      <DonutChart
        data={data}
        centre={{ value: time.spanSec ? percent((production / time.spanSec) * 100) : '—', caption: 'In production' }}
        valueFormatter={(value) => timeShare(value, time.spanSec)}
        emptyText="No machine time for this day."
      />
    </ChartCard>
  )
}

TimeCard.propTypes = { time: PropTypes.object.isRequired }

// Parts made per hour of the day (bars) against the day before (dashed line); today stops at now
export function HourlyCard({ hourly, lastHour }) {
  const data = hourly.filter((row) => row.hour <= lastHour).map((row) => ({ ...row, label: hourLabel(row.hour) }))
  return (
    <ChartCard title="Parts per hour" subtitle="Bars · parts made each hour, the day before as a dashed line" icon="bi-bar-chart">
      <BarLineChart data={data} bars={HOURLY_BARS} lines={HOURLY_LINES} valueFormatter={formatCount} emptyText="No parts yet." />
    </ChartCard>
  )
}

HourlyCard.propTypes = { hourly: PropTypes.arrayOf(PropTypes.object).isRequired, lastHour: PropTypes.number.isRequired }
