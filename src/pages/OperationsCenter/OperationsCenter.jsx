import { useMemo, useState } from 'react'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ChartDateFilter from '@/components/charts/ChartDateFilter'
import Loader from '@/components/common/Loader'
import { CUSTOMER_ROLE_ID, MANAGERS, SUPERADMIN_ONLY } from '@/constants/app'
import { MONITOR_REFRESH_MS } from '@/constants/monitoring'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'
import useLoad from '@/hooks/useLoad'
import useOrgUser from '@/hooks/useOrgUser'
import { customerName } from '@/pages/Customers/customerFormat'
import { HourlyCard, TimeCard } from '@/pages/Home/HomeCards'
import { AlarmsCard, LowestOeeCard } from '@/pages/Home/HomeLists'
import { PRODUCTIVITY_DATE_MIN, formatCount } from '@/pages/Productivity/productivitySettings'
import { getClienteles } from '@/services/clienteleService'
import { getHomeDashboard } from '@/services/dashboardService'
import { getDowntimeReasons } from '@/services/downtimeReasonService'
import { getHolidays } from '@/services/holidayService'
import { getLicenceKeys } from '@/services/licenceKeyService'
import { getMachines } from '@/services/machineService'
import { getParts } from '@/services/partService'
import { getProductionSchedules } from '@/services/productionScheduleService'
import { getCycleCounts, getOee } from '@/services/productivityService'
import { getShifts } from '@/services/shiftService'
import { PICKER_LOCALE, formatClock12, parseIsoDate, shiftIsoDate, todayIso } from '@/utils/dateTime'
import OpsFloorMap from './OpsFloorMap'
import { ActionQueueCard, CycleTrendCard, FleetTiles, OeeTrendCard, PlanCard, PulseCard, ReadinessCard } from './OpsPanels'
import { SLOW_REFRESH_MS, TREND_DAYS, buildActions, buildReadiness, currentShift, dayOffName } from './operationsSettings'

const dayTitle = new Intl.DateTimeFormat(PICKER_LOCALE, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
const dayLabel = new Intl.DateTimeFormat(PICKER_LOCALE, { day: '2-digit', month: 'short' })
const clockLabel = new Intl.DateTimeFormat(PICKER_LOCALE, { hour: '2-digit', minute: '2-digit', second: '2-digit' })

const customerOptionLabel = (user) => (customerName(user) === '—' ? user.username : customerName(user))
const withDayLabels = (rows) => rows.map((row) => ({ ...row, label: dayLabel.format(parseIsoDate(row.date)) }))
const chartMessage = (state, emptyText) => (state.loading ? 'Loading…' : state.error || emptyText)

// One list of the slow data: a list that fails or is not allowed is null and its panel leaves it out
const orNull = (promise) => promise.catch(() => null)

// Main › Operations Center: one screen to see how the plant runs and decide what to do first, next
// to Home for comparison (ADR 0024). Reads only existing APIs, each with the user's own access:
// GET /dashboard/home (live, every MONITOR_REFRESH_MS on today), the 7-day OEE and cycles of the same
// machines, and the machines, schedules, shifts, holidays, parts, clienteles, downtime reasons and
// licence keys for what only they can tell. A panel whose data fails leaves the others standing.
function OperationsCenter() {
  const { hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)
  const isManager = hasRole(MANAGERS)
  const { users } = useOrgUser()
  const today = todayIso()
  // Empty = today: the screen moves to the new day by itself, and the server decides which day that is
  const [pickedDate, setPickedDate] = useState('')
  const [customerId, setCustomerId] = useState('')
  const isToday = !pickedDate
  const scopeUserId = isSuperadmin ? customerId : ''
  // Holidays and shifts belong to one company: only shown when one is in view
  const oneCompany = !isSuperadmin || Boolean(customerId)
  const showCustomer = isSuperadmin && !customerId

  const customers = useMemo(
    () =>
      users
        .filter((user) => user.roleId === CUSTOMER_ROLE_ID)
        .sort((a, b) => customerOptionLabel(a).localeCompare(customerOptionLabel(b), undefined, { sensitivity: 'base' })),
    [users],
  )

  const query = { date: pickedDate, userId: scopeUserId }
  const homeState = useLoad(() => getHomeDashboard(query), JSON.stringify(query), { refreshMs: isToday ? MONITOR_REFRESH_MS : undefined })
  const home = homeState.data

  // The days up to the one the server answered for, of the machines it answered with
  const machineIds = useMemo(() => (home?.machines ?? []).map((machine) => machine.machineId).sort((a, b) => a - b), [home])
  const trendQuery = home && machineIds.length ? { machineIds, from: shiftIsoDate(home.date, 1 - TREND_DAYS), to: home.date } : null
  const trendState = useLoad(
    async () => {
      const [oee, cycles] = await Promise.all([getOee(trendQuery), getCycleCounts(trendQuery)])
      return { oee: withDayLabels(oee?.rows ?? []), cycles: withDayLabels(cycles ?? []) }
    },
    trendQuery && JSON.stringify(trendQuery),
    { refreshMs: isToday ? SLOW_REFRESH_MS : undefined },
  )
  const previousDay = home ? shiftIsoDate(home.date, -1) : null
  const previousOee = trendState.data?.oee.find((row) => row.date === previousDay) ?? null
  const previousCycles = trendState.data?.cycles.find((row) => row.date === previousDay) ?? null

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

  const actions = useMemo(() => (home ? buildActions(home, isToday) : []), [home, isToday])
  const activeShifts = setup?.shifts?.filter((shift) => shift.status !== 'inactive') ?? null
  const shiftNow = home && isToday && oneCompany && activeShifts ? currentShift(activeShifts, home.serverTime) : null
  const activeHolidays = setup?.holidays?.filter((holiday) => holiday.status !== 'inactive') ?? []
  const dayOff = home && oneCompany ? dayOffName(activeHolidays, home.date) : null
  const activeSchedules = home && setup?.schedules
    ? setup.schedules.filter((row) => row.status === 'active' && row.startDate <= home.date && home.date <= row.endDate)
    : null

  const renderBody = () => {
    if (homeState.loading) return <Loader text="Loading operations…" />
    if (!home) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2">
          <span className="me-auto">
            <b>Could not load the Operations Center.</b> {homeState.error}
          </span>
          <Button variant="ghost" size="sm" onClick={homeState.reload}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }
    if (!home.fleet.total) {
      return (
        <div className="ts-empty">
          <i className="bi bi-cpu ts-empty-icon" aria-hidden="true" />
          <p className="mb-2">No active machine to show yet.</p>
          {isManager && <Link to={ROUTES.MACHINE_ADD} className="small">Add a machine</Link>}
        </div>
      )
    }

    const readiness = buildReadiness({
      machines: setup?.machines ?? null,
      licences: setup?.licences ?? null,
      shifts: activeShifts,
      machineCount: home.fleet.total,
      plannedCount: home.machines.filter((machine) => machine.plannedQuantity != null).length,
      today: home.date,
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
    // Only with a part count on this day: most controllers send none, and an empty chart says nothing
    const hasParts = home.hourly.some((hour) => hour.partsMade > 0)
    const lastHour = isToday ? new Date(home.serverTime).getHours() : 23

    return (
      <Row xs={1} className="g-3">
        {homeState.error && (
          <Col>
            <Alert variant="warning" className="mb-0">
              Could not refresh: {homeState.error}. Showing the data read at {clockLabel.format(new Date(home.serverTime))}.
            </Alert>
          </Col>
        )}
        {dayOff && (
          <Col>
            <Alert variant="info" className="mb-0">
              <i className="bi bi-calendar-event me-2" aria-hidden="true" />
              <b>{dayOff}</b> on this day: low production and idle machines may be expected.
            </Alert>
          </Col>
        )}

        <Col>
          <Row xs={1} className="g-3">
            <Col lg={3}>
              <PulseCard home={home} previous={previousOee} isToday={isToday} />
            </Col>
            <Col lg={5}>
              <FleetTiles home={home} previous={previousCycles} />
            </Col>
            <Col lg={4}>
              <ActionQueueCard actions={actions} isToday={isToday} />
            </Col>
          </Row>
        </Col>

        <Col>
          <OpsFloorMap home={home} setup={setup?.machines ?? []} showCustomer={showCustomer} />
        </Col>

        <Col>
          <Row xs={1} className="g-3">
            <Col lg={7}>
              <OeeTrendCard rows={trendState.data?.oee ?? []} days={TREND_DAYS} emptyText={chartMessage(trendState, 'No OEE for these days.')} />
            </Col>
            <Col lg={5}>
              <TimeCard time={home.time} />
            </Col>
          </Row>
        </Col>

        <Col>
          <Row xs={1} className="g-3">
            <Col lg={5}>
              <CycleTrendCard rows={trendState.data?.cycles ?? []} days={TREND_DAYS} emptyText={chartMessage(trendState, 'No cycles for these days.')} />
            </Col>
            <Col lg={7}>
              <PlanCard machines={home.machines} schedules={activeSchedules} showCustomer={showCustomer} canAdd={isManager} />
            </Col>
          </Row>
        </Col>

        {hasParts && (
          <Col>
            <HourlyCard hourly={home.hourly} lastHour={lastHour} />
          </Col>
        )}

        <Col>
          <Row xs={1} lg={2} className="g-3">
            <Col>
              <LowestOeeCard machines={home.machines} showCustomer={showCustomer} />
            </Col>
            <Col>
              <AlarmsCard alarms={home.alarms} />
            </Col>
          </Row>
        </Col>

        <Col>
          <ReadinessCard alerts={readiness} stats={stats} />
        </Col>
      </Row>
    )
  }

  const scopeLabel = !isSuperadmin
    ? 'your machines'
    : customerId
      ? `${customerOptionLabel(customers.find((customer) => String(customer.id) === customerId) ?? {})}’s machines`
      : 'every customer’s machines'

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Main · Operations Center</div>
          <h1>Operations Center</h1>
          <p className="ts-page-subtitle">
            {isToday ? 'Today' : dayTitle.format(parseIsoDate(pickedDate))} · {scopeLabel}
            {home && ` · ${formatCount(home.fleet.total)} active machine${home.fleet.total === 1 ? '' : 's'}`}
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
          <ChartDateFilter
            value={pickedDate || today}
            onChange={(value) => setPickedDate(value === today ? '' : value)}
            min={PRODUCTIVITY_DATE_MIN}
            max={today}
            label="Operations date"
          />
          <Button variant="ghost" onClick={homeState.reload} aria-label="Refresh now" title={home ? `Read at ${clockLabel.format(new Date(home.serverTime))}` : undefined}>
            <i className="bi bi-arrow-clockwise" aria-hidden="true" />
          </Button>
        </div>
      </header>

      {renderBody()}
    </>
  )
}

export default OperationsCenter
