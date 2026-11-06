import { useMemo, useState } from 'react'
import { Alert, Col, Form, Row } from 'react-bootstrap'
import ChartDateFilter from '@/components/charts/ChartDateFilter'
import Loader from '@/components/common/Loader'
import { CUSTOMER_ROLE_ID, SUPERADMIN_ONLY } from '@/constants/app'
import { MONITOR_REFRESH_MS } from '@/constants/monitoring'
import useAuth from '@/hooks/useAuth'
import useLoad from '@/hooks/useLoad'
import useOrgUser from '@/hooks/useOrgUser'
import { customerName } from '@/pages/Customers/customerFormat'
import { PRODUCTIVITY_DATE_MIN } from '@/pages/Productivity/productivitySettings'
import { getHomeDashboard } from '@/services/dashboardService'
import { PICKER_LOCALE, parseIsoDate, todayIso } from '@/utils/dateTime'
import { DayCard, FleetCard, TimeCard } from './HomeCards'
import { AlarmsCard, AttentionCard, LowestOeeCard } from './HomeLists'

const dayTitle = new Intl.DateTimeFormat(PICKER_LOCALE, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })

const customerOptionLabel = (user) => (customerName(user) === '—' ? user.username : customerName(user))

// Main › Dashboard (/): every active machine the user may read, together, from GET
// /dashboard/home (one request; reloaded every MONITOR_REFRESH_MS while it shows today). Fleet
// now (connection and mode counts), the day's OEE / utilization / parts vs plan / cycles, where
// the time went, machines needing attention, the lowest OEE and the top alarms.
// The superadmin can narrow it to one customer.
function Home() {
  const { hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)
  const { users } = useOrgUser()
  const today = todayIso()
  // Empty = today: the screen moves to the new day by itself, and the server decides which day that is
  const [pickedDate, setPickedDate] = useState('')
  const date = pickedDate || today
  const [customerId, setCustomerId] = useState('')

  const customers = useMemo(
    () =>
      users
        .filter((user) => user.roleId === CUSTOMER_ROLE_ID)
        .sort((a, b) => customerOptionLabel(a).localeCompare(customerOptionLabel(b), undefined, { sensitivity: 'base' })),
    [users],
  )

  const pickedCustomer = customers.find((customer) => String(customer.id) === customerId)
  const scopeLabel = !isSuperadmin
    ? 'your machines'
    : pickedCustomer
      ? `${customerOptionLabel(pickedCustomer)}’s machines`
      : 'every customer’s machines'

  const isToday = !pickedDate
  const query = { date: pickedDate, userId: isSuperadmin ? customerId : '' }
  const homeState = useLoad(() => getHomeDashboard(query), JSON.stringify(query), {
    refreshMs: isToday ? MONITOR_REFRESH_MS : undefined,
  })
  const home = homeState.data

  const dayNoun = isToday ? 'the day so far' : 'the day'

  const renderBody = () => {
    if (homeState.loading) return <Loader text="Loading dashboard…" />
    if (!home) return <Alert variant="danger">{homeState.error}</Alert>
    return (
      <Row xs={1} className="g-3">
        {homeState.error && (
          <Col>
            <Alert variant="warning" className="mb-0">
              Could not refresh: {homeState.error}
            </Alert>
          </Col>
        )}
        <Col>
          <FleetCard fleet={home.fleet} />
        </Col>
        <Col>
          <DayCard home={home} dayNoun={dayNoun} />
        </Col>
        {/* Parts per hour (HourlyCard) is hidden while the controllers send no part count; the
            response still carries `hourly` */}
        <Col>
          <TimeCard time={home.time} />
        </Col>
        <Col>
          <Row xs={1} lg={2} className="g-3">
            <Col>
              <AttentionCard machines={home.machines} serverTime={home.serverTime} showCustomer={isSuperadmin} />
            </Col>
            <Col>
              <LowestOeeCard machines={home.machines} showCustomer={isSuperadmin} />
            </Col>
          </Row>
        </Col>
        <Col>
          <AlarmsCard alarms={home.alarms} />
        </Col>
      </Row>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Main · Dashboard</div>
          <h1>Dashboard</h1>
          <p className="ts-page-subtitle">
            {isToday ? 'Today' : dayTitle.format(parseIsoDate(date))} ·{' '}
            {scopeLabel}, live from the CNC collector.
          </p>
        </div>
        <div className="ts-page-actions">
          {isSuperadmin && (
            <Form.Select
              className="w-auto"
              value={customerId}
              onChange={(event) => setCustomerId(event.target.value)}
              aria-label="Customer"
            >
              <option value="">All customers</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customerOptionLabel(customer)}
                </option>
              ))}
            </Form.Select>
          )}
          <ChartDateFilter
            value={date}
            onChange={(value) => setPickedDate(value === today ? '' : value)}
            min={PRODUCTIVITY_DATE_MIN}
            max={today}
            label="Dashboard date"
          />
        </div>
      </header>

      {renderBody()}
    </>
  )
}

export default Home
