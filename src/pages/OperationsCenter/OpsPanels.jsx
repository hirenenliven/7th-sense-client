import { useMemo } from 'react'
import { Badge, Card, Col, ProgressBar, Row, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ChartCard from '@/components/charts/ChartCard'
import SortableHead from '@/components/common/SortableHead'
import { STATUS_COLORS } from '@/components/charts/chartTheme'
import LineTrendChart from '@/components/charts/LineTrendChart'
import StackedBarChart from '@/components/charts/StackedBarChart'
import { UNKNOWN_MODE_COLOR, modeTypeOf } from '@/constants/machines'
import { MONITOR_REFRESH_MS, machineMonitorPath } from '@/constants/monitoring'
import { ROUTES } from '@/constants/routes'
import useTableSort from '@/hooks/useTableSort'
import { KpiTile } from '@/pages/Home/HomeCards'
import { fleetModeCounts, scoreTone } from '@/pages/Home/homeSettings'
import {
  OEE_DOMAIN,
  OEE_LIMITS,
  OEE_SERIES,
  OEE_TICKS,
  formatCount,
  percent,
} from '@/pages/Productivity/productivitySettings'
import { ACTION_LIMIT, PLAN_LIMIT, SEVERITY_TONE, biggestLoss, oeeFactors } from './operationsSettings'

const CYCLE_SERIES = [
  { key: 'finished', label: 'Completed', color: STATUS_COLORS.good },
  { key: 'unfinished', label: 'Unfinished', color: STATUS_COLORS.warning },
]

// The day's OEE beside the day before, its three factors and where the most is lost
export function PulseCard({ home, previous, isToday }) {
  const { oee } = home
  const loss = biggestLoss(oee)
  const change = oee?.oee != null && previous?.oee != null ? oee.oee - previous.oee : null

  return (
    <Card className={`ts-chart-card h-100 ts-tone-${scoreTone(oee?.oee)}`}>
      <Card.Body className="d-flex flex-column">
        <div className="ts-kpi-label">OEE {isToday ? 'today so far' : 'of the day'}</div>
        <div className="ts-ops-oee font-tabular">{percent(oee?.oee)}</div>
        <div className="ts-ops-oee-note small text-body-secondary">
          {change == null ? (
            oee ? 'No day before to compare' : 'No time recorded yet'
          ) : (
            <>
              <i className={`bi ${change >= 0 ? 'bi-arrow-up-right text-success' : 'bi-arrow-down-right text-danger'} me-1`} aria-hidden="true" />
              {`${change >= 0 ? '+' : ''}${change.toFixed(1)} points vs the day before (${percent(previous.oee)}, whole day)`}
            </>
          )}
        </div>
        <div className="ts-ops-factors">
          {oeeFactors(oee).map((factor) => (
            <div key={factor.key} className={`ts-ops-factor ts-tone-${scoreTone(factor.value)}`}>
              <span className="text-body-secondary">{factor.label}</span>
              <ProgressBar now={factor.value ?? 0} aria-hidden="true" />
              <span className="font-tabular">{percent(factor.value)}</span>
            </div>
          ))}
        </div>
        {loss && (
          <div className="ts-ops-loss small mt-auto">
            <i className="bi bi-bullseye me-1" aria-hidden="true" />
            Biggest loss: <b>{loss.label}</b> at {percent(loss.value)}
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

PulseCard.propTypes = { home: PropTypes.object.isRequired, previous: PropTypes.object, isToday: PropTypes.bool.isRequired }

// The fleet and the day in tiles. Parts only count when the controllers report them, so the tile
// says so rather than showing 0 against a plan.
export function FleetTiles({ home, previous }) {
  const { fleet, cycles, machines } = home
  const share = (count) => (fleet.total ? (count / fleet.total) * 100 : 0)
  const modes = fleetModeCounts(fleet.modes)
  const countOf = (id) => modes.find((mode) => mode.id === id)?.count ?? 0
  const producing = countOf(3)
  const stopped = countOf(6) + countOf(4)
  const planned = machines.filter((machine) => machine.plannedQuantity != null).length
  const tiles = [
    { key: 'online', label: 'Online now', icon: 'bi-wifi', tone: fleet.offline ? 'warning' : 'good', value: `${formatCount(fleet.online)} / ${formatCount(fleet.total)}`,
      progress: share(fleet.online), meta: fleet.inactive ? `${formatCount(fleet.inactive)} inactive not counted` : `${formatCount(fleet.offline)} offline`, to: ROUTES.MONITORING },
    { key: 'producing', label: 'Producing now', icon: 'bi-play-circle', tone: 'mode-3', value: formatCount(producing), progress: share(producing), meta: `${percent(share(producing))} of machines`, to: ROUTES.MONITORING },
    { key: 'stopped', label: 'Stopped now', icon: 'bi-stop-circle', tone: stopped ? 'critical' : 'neutral', value: formatCount(stopped), meta: `${formatCount(countOf(6))} downtime · ${formatCount(countOf(4))} hold`, to: ROUTES.MONITORING },
    { key: 'cycles', label: 'Cycles completed', icon: 'bi-arrow-repeat', tone: 'info', value: formatCount(cycles.completedCount),
      meta: `${formatCount(cycles.unfinishedCount)} unfinished · ${formatCount(cycles.runningCount)} running${previous ? ` · ${formatCount(previous.finished)} the day before` : ''}` },
    { key: 'plan', label: 'With a job', icon: 'bi-calendar-check', tone: planned ? 'info' : 'neutral', value: `${formatCount(planned)} / ${formatCount(fleet.total)}`,
      progress: share(planned), meta: 'Machines scheduled for this day', to: ROUTES.PRODUCTION_SCHEDULE },
    { key: 'parts', label: 'Parts made', icon: 'bi-box-seam', tone: 'neutral', value: cycles.partsMade ? formatCount(cycles.partsMade) : '—',
      meta: cycles.partsMade ? (home.plan ? `Machines with a job: ${formatCount(home.plan.partsMade)} of ${formatCount(home.plan.quantity)}` : 'No job scheduled') : 'No part count from the controllers' },
  ]

  return (
    <Row xs={2} xl={3} className="g-3 h-100">
      {tiles.map((tile) => (
        <Col key={tile.key}>
          <KpiTile tile={tile} />
        </Col>
      ))}
    </Row>
  )
}

FleetTiles.propTypes = { home: PropTypes.object.isRequired, previous: PropTypes.object }

// One row of the action queue or the readiness list: tone icon, what, why; a link when it can be acted on
export function ActionRow({ action }) {
  const body = (
    <>
      <i className={`bi ${action.icon} ts-ops-action-icon`} aria-hidden="true" />
      <span className="ts-ops-action-text">
        <span className="ts-ops-action-title">{action.title}</span>
        {action.detail && <span className="small text-body-secondary">{action.detail}</span>}
      </span>
      {action.to && <i className="bi bi-chevron-right ts-drill" aria-hidden="true" />}
    </>
  )
  const className = `ts-ops-action ts-tone-${SEVERITY_TONE[action.severity]}`
  return (
    <li>
      {action.to ? (
        <Link to={action.to} className={`${className} text-reset text-decoration-none`}>
          {body}
        </Link>
      ) : (
        <div className={className}>{body}</div>
      )}
    </li>
  )
}

ActionRow.propTypes = { action: PropTypes.object.isRequired }

// The most serious problems across machines, schedule and alarms, each opening where it can be fixed
export function ActionQueueCard({ actions, isToday }) {
  const count = (severity) => actions.filter((action) => action.severity === severity).length
  const critical = count('critical')
  const warning = count('warning')
  const hidden = actions.length - ACTION_LIMIT

  return (
    <ChartCard
      title="Action queue"
      subtitle={isToday ? `Live · refreshed every ${MONITOR_REFRESH_MS / 1000} s, most serious first` : 'What stood out on this day'}
      icon="bi-lightning-charge"
      actions={
        <>
          {critical > 0 && <Badge bg="danger">{formatCount(critical)} critical</Badge>}
          {warning > 0 && <Badge bg="warning" text="dark">{formatCount(warning)} warning</Badge>}
        </>
      }
    >
      {actions.length ? (
        <>
          <ul className="list-unstyled mb-0">
            {actions.slice(0, ACTION_LIMIT).map((action) => (
              <ActionRow key={action.key} action={action} />
            ))}
          </ul>
          {hidden > 0 && (
            <Link to={ROUTES.MONITORING} className="small mt-2">
              {formatCount(hidden)} more · open Monitoring
            </Link>
          )}
        </>
      ) : (
        <div className="ts-empty">
          <i className="bi bi-check2-circle ts-empty-icon" aria-hidden="true" />
          <p className="mb-0">Nothing needs action {isToday ? 'right now' : 'on this day'}.</p>
        </div>
      )}
    </ChartCard>
  )
}

ActionQueueCard.propTypes = { actions: PropTypes.arrayOf(PropTypes.object).isRequired, isToday: PropTypes.bool.isRequired }

// Daily OEE with its factors over the last days (the machines together, weighted by the server)
export function OeeTrendCard({ rows, emptyText, days }) {
  return (
    <ChartCard title="OEE trend" subtitle={`Last ${days} days · the machines together, weighted by their time`} icon="bi-graph-up">
      <LineTrendChart
        data={rows}
        series={OEE_SERIES}
        xKey="label"
        yUnit="%"
        yDomain={OEE_DOMAIN}
        yTicks={OEE_TICKS}
        valueFormatter={percent}
        limits={OEE_LIMITS}
        dots
        emptyText={emptyText}
      />
    </ChartCard>
  )
}

OeeTrendCard.propTypes = { rows: PropTypes.arrayOf(PropTypes.object).isRequired, emptyText: PropTypes.string.isRequired, days: PropTypes.number.isRequired }

// Cycles closed per day, completed and unfinished
export function CycleTrendCard({ rows, emptyText, days }) {
  return (
    <ChartCard title="Cycles per day" subtitle={`Last ${days} days · completed and unfinished`} icon="bi-bar-chart-steps">
      <StackedBarChart data={rows} series={CYCLE_SERIES} xKey="label" valueFormatter={formatCount} emptyText={emptyText} />
    </ChartCard>
  )
}

CycleTrendCard.propTypes = { rows: PropTypes.arrayOf(PropTypes.object).isRequired, emptyText: PropTypes.string.isRequired, days: PropTypes.number.isRequired }

function ModeLabel({ modeId }) {
  const mode = modeTypeOf(modeId)
  return (
    <>
      <svg className="me-1" width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
        <circle cx="4" cy="4" r="4" fill={mode?.color ?? UNKNOWN_MODE_COLOR} />
      </svg>
      {mode?.label ?? '—'}
    </>
  )
}

ModeLabel.propTypes = { modeId: PropTypes.number }

// The machines with a job this day: where they are now and completed cycles against the quantity
// (like the Virtual Screen's batch progress, which works without a part count from the controller)
export function PlanCard({ machines, schedules, showCustomer, canAdd }) {
  const rows = useMemo(
    () =>
      machines
        .filter((machine) => machine.plannedQuantity != null)
        .map((machine) => ({ ...machine, done: machine.plannedQuantity ? (machine.completedCount / machine.plannedQuantity) * 100 : 0 }))
        .sort((a, b) => a.done - b.done),
    [machines],
  )
  const columns = [
    { label: 'Machine', sort: (row) => row.machineName },
    { label: 'Now', sort: (row) => modeTypeOf(row.modeId)?.label },
    { label: 'Cycles / Qty.', sort: (row) => row.done },
    { label: 'Parts', sort: (row) => row.partsMade },
  ]
  const { sortedRows, sort, onSort } = useTableSort(rows, columns)
  const jobs = schedules?.reduce((sum, schedule) => sum + schedule.itemCount, 0)

  return (
    <ChartCard
      title="Production plan"
      subtitle={schedules ? `${formatCount(schedules.length)} active schedule${schedules.length === 1 ? '' : 's'} · ${formatCount(jobs)} job${jobs === 1 ? '' : 's'} · least done first` : 'Least done first'}
      icon="bi-calendar-check"
      actions={<Link to={ROUTES.PRODUCTION_SCHEDULE} className="small">Open schedule</Link>}
    >
      {rows.length ? (
        <>
          <div className="ts-table-panel">
            <Table responsive size="sm" className="mb-0">
              <SortableHead columns={columns} sort={sort} onSort={onSort} />
              <tbody>
                {sortedRows.slice(0, PLAN_LIMIT).map((machine) => (
                  <tr key={machine.machineId}>
                    <td>
                      <Link to={machineMonitorPath(ROUTES.MACHINE_PRODUCTIVITY, { id: machine.machineId })}>{machine.machineName}</Link>
                      {showCustomer && <div className="small text-body-secondary">{machine.customerName || '—'}</div>}
                    </td>
                    <td className="text-nowrap">
                      <ModeLabel modeId={machine.modeId} />
                    </td>
                    <td className="ts-ops-plan-cell">
                      <span className="font-tabular">
                        {formatCount(machine.completedCount)} / {formatCount(machine.plannedQuantity)}
                      </span>
                      <ProgressBar now={Math.min(100, machine.done)} aria-hidden="true" />
                    </td>
                    <td className="font-tabular">{machine.partsMade ? formatCount(machine.partsMade) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {rows.length > PLAN_LIMIT && <span className="small text-body-secondary mt-2">Showing {PLAN_LIMIT} of {formatCount(rows.length)} machines with a job.</span>}
        </>
      ) : (
        <div className="ts-empty">
          <i className="bi bi-calendar-x ts-empty-icon" aria-hidden="true" />
          <p className="mb-2">No job is scheduled for this day.</p>
          {canAdd && <Link to={ROUTES.PRODUCTION_SCHEDULE_ADD} className="small">Add a schedule</Link>}
        </div>
      )}
    </ChartCard>
  )
}

PlanCard.propTypes = {
  machines: PropTypes.arrayOf(PropTypes.object).isRequired,
  schedules: PropTypes.arrayOf(PropTypes.object),
  showCustomer: PropTypes.bool.isRequired,
  canAdd: PropTypes.bool.isRequired,
}

// What will get in the way soon, and how far the set-up behind the numbers has come
export function ReadinessCard({ alerts, stats }) {
  return (
    <ChartCard title="Readiness" subtitle="Warranties, licences, maintenance and the set-up behind these numbers" icon="bi-clipboard-check">
      <Row className="g-3">
        <Col lg={6}>
          {alerts.length ? (
            <ul className="list-unstyled mb-0">
              {alerts.map((alert) => (
                <ActionRow key={alert.key} action={alert} />
              ))}
            </ul>
          ) : (
            <div className="ts-empty">
              <i className="bi bi-check2-circle ts-empty-icon" aria-hidden="true" />
              <p className="mb-0">Nothing is ending soon and the set-up is complete.</p>
            </div>
          )}
        </Col>
        <Col lg={6}>
          <div className="ts-ops-stats">
            {stats.map((stat) => (
              <Link key={stat.key} to={stat.to} className="ts-ops-stat text-reset text-decoration-none">
                <i className={`bi ${stat.icon} ts-ops-stat-icon`} aria-hidden="true" />
                <span className="ts-ops-stat-value font-tabular">{formatCount(stat.value)}</span>
                <span className="small text-body-secondary">{stat.label}</span>
              </Link>
            ))}
          </div>
        </Col>
      </Row>
    </ChartCard>
  )
}

ReadinessCard.propTypes = {
  alerts: PropTypes.arrayOf(PropTypes.object).isRequired,
  stats: PropTypes.arrayOf(PropTypes.object).isRequired,
}
