import { useMemo, useState } from 'react'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Loader from '@/components/common/Loader'
import { CUSTOMER_ROLE_ID, MANAGERS, SUPERADMIN_ONLY } from '@/constants/app'
import { MONITOR_REFRESH_MS } from '@/constants/monitoring'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'
import useLoad from '@/hooks/useLoad'
import useOrgUser from '@/hooks/useOrgUser'
import { customerName } from '@/pages/Customers/customerFormat'
import { CycleTrendCard, OeeTrendCard, ReadinessCard } from '@/pages/OperationsCenter/OpsPanels'
import { SLOW_REFRESH_MS, buildReadiness, currentShift, dayOffName } from '@/pages/OperationsCenter/operationsSettings'
import { formatCount } from '@/pages/Productivity/productivitySettings'
import { getClienteles } from '@/services/clienteleService'
import { getHomeDashboard } from '@/services/dashboardService'
import { getDowntimeReasons } from '@/services/downtimeReasonService'
import { getHolidays } from '@/services/holidayService'
import { getLicenceKeys } from '@/services/licenceKeyService'
import { getMachines } from '@/services/machineService'
import { getParts } from '@/services/partService'
import { getProductionSchedules } from '@/services/productionScheduleService'
import { getShifts } from '@/services/shiftService'
import { PICKER_LOCALE, formatClock12, shiftIsoDate } from '@/utils/dateTime'
import { AlarmParetoCard, GroupsCard, InsightsCard, NowCard, OutlookCard, PeriodTiles, TimeLossCard } from './IntelligencePanels'
import MachineHeatmap from './MachineHeatmap'
import { DEFAULT_PERIOD, PERIODS, analyse, buildInsights, groupRows, outlookRows } from './intelligenceSettings'

const clockLabel = new Intl.DateTimeFormat(PICKER_LOCALE, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
const customerOptionLabel = (user) => (customerName(user) === '—' ? user.username : customerName(user))

// One list: a list that fails or is not allowed is null and its panel leaves it out
const orNull = (promise) => promise.catch(() => null)

// Main › Plant Intelligence: why capacity is lost, where, and whether it is improving, over a period
// and per machine, beside Home and Operations Center for comparison (ADR 0025). No endpoint of its own:
// GET /dashboard/home of each day (each with the user's access). Today reloads every MONITOR_REFRESH_MS;
// past days do not change, so they load once.
function PlantIntelligence() {
  const { hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)
  const isManager = hasRole(MANAGERS)
  const { users } = useOrgUser()
  const [period, setPeriod] = useState(DEFAULT_PERIOD)
  const [customerId, setCustomerId] = useState('')
  const scopeUserId = isSuperadmin ? customerId : ''
  // Holidays and shifts belong to one company: only shown when one is in view
  const oneCompany = !isSuperadmin || Boolean(customerId)
  const showCustomer = isSuperadmin && !customerId
  const periodLabel = PERIODS.find((option) => option.value === period).label.toLowerCase()

  const customers = useMemo(
    () =>
      users
        .filter((user) => user.roleId === CUSTOMER_ROLE_ID)
        .sort((a, b) => customerOptionLabel(a).localeCompare(customerOptionLabel(b), undefined, { sensitivity: 'base' })),
    [users],
  )

  const todayState = useLoad(() => getHomeDashboard({ userId: scopeUserId }), `today|${scopeUserId}`, { refreshMs: MONITOR_REFRESH_MS })
  const today = todayState.data

  // The days before the one the server answered for; a day that fails is left out and reported
  const historyState = useLoad(
    () =>
      Promise.all(
        Array.from({ length: period - 1 }, (_, index) =>
          orNull(getHomeDashboard({ date: shiftIsoDate(today.date, index + 1 - period), userId: scopeUserId })),
        ),
      ),
    today ? `history|${scopeUserId}|${today.date}|${period}` : null,
  )
  const failedDays = historyState.data?.filter((day) => !day).length ?? 0

  const days = useMemo(() => (today && historyState.data ? [...historyState.data.filter(Boolean), today] : null), [today, historyState.data])
  const analysis = useMemo(() => (days ? analyse(days) : null), [days])
  const insights = useMemo(() => (analysis ? buildInsights(analysis, periodLabel) : []), [analysis, periodLabel])

  const setupState = useLoad(
    async () => {
      const [machines, schedules, shifts, holidays, parts, clienteles, reasons, licences] = await Promise.all([
        orNull(getMachines(scopeUserId)),
        orNull(getProductionSchedules(scopeUserId)),
        orNull(getShifts(scopeUserId)),
        orNull(getHolidays(scopeUserId)),
        orNull(getParts(scopeUserId)),
        orNull(getClienteles(scopeUserId)),
        orNull(getDowntimeReasons(scopeUserId)),
        isManager ? orNull(getLicenceKeys(scopeUserId)) : null,
      ])
      return { machines, schedules, shifts, holidays, parts, clienteles, reasons, licences }
    },
    `setup|${scopeUserId}|${isManager}`,
    { refreshMs: SLOW_REFRESH_MS },
  )
  const setup = setupState.data
  const lineOf = useMemo(() => new Map((setup?.machines ?? []).filter((machine) => machine.lineName).map((machine) => [machine.id, machine.lineName])), [setup])
  const activeShifts = setup?.shifts?.filter((shift) => shift.status !== 'inactive') ?? null
  const activeHolidays = setup?.holidays?.filter((holiday) => holiday.status !== 'inactive') ?? null
  const shiftNow = today && oneCompany && activeShifts ? currentShift(activeShifts, today.serverTime) : null

  const renderPeriodPanels = () => {
    if (historyState.loading) return <Col><Loader text={`Reading ${periodLabel}…`} /></Col>
    if (!analysis) return <Col><Alert variant="danger" className="mb-0">{historyState.error || 'Could not read this period.'}</Alert></Col>

    const dates = days.map((day) => day.date)
    const byCustomer = showCustomer
    const readiness = buildReadiness({
      machines: setup?.machines ?? null,
      licences: setup?.licences ?? null,
      shifts: activeShifts,
      machineCount: today.fleet.total,
      plannedCount: today.machines.filter((machine) => machine.plannedQuantity != null).length,
      today: today.date,
      // Only the superadmin can open the licence screen; others are told and ask their account team
      licencePath: isSuperadmin ? ROUTES.LICENCE_KEYS : undefined,
    })
    const stats = setup
      ? [
          { key: 'machines', label: 'Machines', icon: 'bi-cpu', value: setup.machines?.length, to: ROUTES.MACHINES },
          { key: 'parts', label: 'Parts', icon: 'bi-rocket-takeoff', value: setup.parts?.length, to: ROUTES.PARTS },
          { key: 'clienteles', label: 'Clienteles', icon: 'bi-person-vcard', value: setup.clienteles?.length, to: ROUTES.CLIENTELES },
          { key: 'schedules', label: 'Schedules', icon: 'bi-gear-wide-connected', value: setup.schedules?.length, to: ROUTES.PRODUCTION_SCHEDULE },
          { key: 'shifts', label: 'Shifts', icon: 'bi-calendar3', value: activeShifts?.length, to: ROUTES.SHIFTS },
          { key: 'reasons', label: 'Downtime reasons', icon: 'bi-exclamation-octagon', value: setup.reasons?.length, to: ROUTES.DOWNTIME_REASONS },
        ].filter((stat) => stat.value != null)
      : []

    return (
      <>
        {failedDays > 0 && (
          <Col>
            <Alert variant="warning" className="mb-0">
              {formatCount(failedDays)} day{failedDays === 1 ? '' : 's'} of this period could not be read and {failedDays === 1 ? 'is' : 'are'} left out of these figures.
            </Alert>
          </Col>
        )}
        <Col>
          <PeriodTiles analysis={analysis} today={today} periodLabel={periodLabel} />
        </Col>
        <Col>
          <Row xs={1} className="g-3">
            <Col xl={5}>
              <InsightsCard insights={insights} periodLabel={periodLabel} />
            </Col>
            <Col xl={7}>
              <TimeLossCard days={days} analysis={analysis} periodLabel={periodLabel} />
            </Col>
          </Row>
        </Col>
        <Col>
          <MachineHeatmap machines={analysis.machines} dates={dates} lineOf={lineOf} showCustomer={showCustomer} />
        </Col>
        <Col>
          <Row xs={1} className="g-3">
            <Col xl={7}>
              <OeeTrendCard rows={analysis.trend} days={dates.length} emptyText="No OEE in this period." />
            </Col>
            <Col xl={5}>
              <CycleTrendCard rows={analysis.trend} days={dates.length} emptyText="No cycles in this period." />
            </Col>
          </Row>
        </Col>
        <Col>
          <Row xs={1} className="g-3">
            <Col xl={7}>
              <GroupsCard rows={groupRows(analysis.machines, lineOf, byCustomer)} byCustomer={byCustomer} periodLabel={periodLabel} />
            </Col>
            <Col xl={5}>
              <AlarmParetoCard alarms={analysis.alarms} dayCount={dates.length} periodLabel={periodLabel} />
            </Col>
          </Row>
        </Col>
        <Col>
          <Row xs={1} className="g-3">
            <Col xl={5}>
              <OutlookCard
                rows={outlookRows({
                  today: today.date,
                  schedules: setup?.schedules ?? [],
                  shifts: oneCompany ? activeShifts : null,
                  holidays: oneCompany ? activeHolidays : null,
                  dayOffName,
                })}
                machineTotal={today.fleet.total}
                canAdd={isManager}
              />
            </Col>
            <Col xl={7}>
              <ReadinessCard alerts={readiness} stats={stats} />
            </Col>
          </Row>
        </Col>
      </>
    )
  }

  const renderBody = () => {
    if (todayState.loading) return <Loader text="Loading plant intelligence…" />
    if (!today) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2">
          <span className="me-auto">
            <b>Could not load Plant Intelligence.</b> {todayState.error}
          </span>
          <Button variant="ghost" size="sm" onClick={todayState.reload}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }
    if (!today.fleet.total) {
      return (
        <div className="ts-empty">
          <i className="bi bi-cpu ts-empty-icon" aria-hidden="true" />
          <p className="mb-2">No active machine to show yet.</p>
          {isManager && <Link to={ROUTES.MACHINE_ADD} className="small">Add a machine</Link>}
        </div>
      )
    }
    return (
      <Row xs={1} className="g-3">
        {todayState.error && (
          <Col>
            <Alert variant="warning" className="mb-0">
              Could not refresh: {todayState.error}. Showing the data read at {clockLabel.format(new Date(today.serverTime))}.
            </Alert>
          </Col>
        )}
        <Col>
          <NowCard today={today} showCustomer={showCustomer} />
        </Col>
        {renderPeriodPanels()}
      </Row>
    )
  }

  const pickedCustomer = customers.find((customer) => String(customer.id) === customerId)
  const scopeLabel = !isSuperadmin ? 'your machines' : pickedCustomer ? `${customerOptionLabel(pickedCustomer)}’s machines` : 'every customer’s machines'

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Main · Plant Intelligence</div>
          <h1>Plant Intelligence</h1>
          <p className="ts-page-subtitle">
            Why capacity is lost, where, and whether it is improving · {scopeLabel}
          </p>
        </div>
        <div className="ts-page-actions">
          {shiftNow && (
            <span className="ts-chip ts-chip-muted">
              <i className="bi bi-clock me-1" aria-hidden="true" />
              {shiftNow.name}: {formatClock12(shiftNow.startTime)} – {formatClock12(shiftNow.endTime)}
            </span>
          )}
          {isSuperadmin && (
            <Form.Select className="w-auto" value={customerId} onChange={(event) => setCustomerId(event.target.value)} aria-label="Customer">
              <option value="">All customers</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customerOptionLabel(customer)}
                </option>
              ))}
            </Form.Select>
          )}
          <Form.Select className="w-auto" value={period} onChange={(event) => setPeriod(Number(event.target.value))} aria-label="Period">
            {PERIODS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
          <Button variant="ghost" onClick={todayState.reload} aria-label="Refresh now" title={today ? `Read at ${clockLabel.format(new Date(today.serverTime))}` : undefined}>
            <i className="bi bi-arrow-clockwise" aria-hidden="true" />
          </Button>
        </div>
      </header>

      {renderBody()}
    </>
  )
}

export default PlantIntelligence
