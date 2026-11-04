import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Link, useSearchParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import ChartCard from '@/components/charts/ChartCard'
import ChartDateFilter from '@/components/charts/ChartDateFilter'
import LineTrendChart from '@/components/charts/LineTrendChart'
import Loader from '@/components/common/Loader'
import MultiSelectPicker from '@/components/common/MultiSelectPicker'
import { SUPERADMIN_ONLY } from '@/constants/app'
import { modeTypeOf } from '@/constants/machines'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'
import useLoad from '@/hooks/useLoad'
import { getMachines } from '@/services/machineService'
import { getOee } from '@/services/productivityService'
import { getShifts } from '@/services/shiftService'
import { PICKER_LOCALE, parseIsoDate, shiftIsoDate, todayIso } from '@/utils/dateTime'
import ModeTimelineCard from './ModeTimelineCard'
import SummaryCards from './SummaryCards'
import {
  ALL_PROGRAMS,
  DEFAULT_RANGE_DAYS,
  DEFAULT_SCHEDULE_MODE,
  MACHINE_NOUN,
  MAX_RANGE_DAYS,
  OEE_DOMAIN,
  OEE_LIMITS,
  OEE_SERIES,
  OEE_TICKS,
  PRODUCTIVITY_DATE_MIN,
  SCHEDULE_MODES,
  SHIFT_NOUN,
  percent,
  shiftOption,
} from './productivitySettings'

const dayLabel = new Intl.DateTimeFormat(PICKER_LOCALE, { day: '2-digit', month: 'short' })
// Rows of a per-day chart get their axis label ("03 Nov")
const withDayLabels = (rows) => rows.map((row) => ({ ...row, label: dayLabel.format(parseIsoDate(row.date)) }))

// Program names from the server as select options
const programOptions = (names) => (names ?? []).map((name) => ({ value: name, label: name }))

// Shift picks that are shifts of the current customer (a pick is dropped when the machine changes customer)
const shiftsIn = (picked, options) => picked.filter((id) => options.some((option) => option.value === id))

// Text in place of a chart: loading, the load error, or what an empty result means
const chartMessage = (state, emptyText) => (state.loading ? 'Loading…' : state.error || emptyText)

const machineLabel = (machine, withCustomer) =>
  withCustomer && machine.customerName ? `${machine.name} · ${machine.customerName}` : machine.name

// A machine pick belongs to the header machine it was made for (`forId`); for another machine it
// starts again as that machine alone
const pickedMachineIds = (pick, selectedId) =>
  pick.forId === selectedId ? pick.ids : selectedId == null ? [] : [String(selectedId)]

// Program picked, or All when it is not one of the options (e.g. after the machine changed)
const programIn = (program, options) => (options.some((option) => option.value === program) ? program : ALL_PROGRAMS)

function ProgramSelect({ id, value, options, onChange }) {
  return (
    <Form.Select id={id} className="w-auto" value={value} onChange={(event) => onChange(event.target.value)} aria-label="Program">
      <option value={ALL_PROGRAMS}>All programs</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Form.Select>
  )
}

ProgramSelect.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string.isRequired }))
    .isRequired,
  onChange: PropTypes.func.isRequired,
}

// Operations › Monitoring › Productivity: a machine's productivity (`?machineId=`, set by the Monitoring
// › Machines Productivity link; the first machine otherwise). Today's Cycles, OEE and Machine Modes cards
// (SummaryCards), the Machine Mode Timeline (ModeTimelineCard; both reload themselves), then the OEE
// trend (one or more machines of the same customer, over a range of days). Live data from
// GET /productivity/* (what the CNC collector recorded).
function Productivity() {
  const { hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)
  const [searchParams, setSearchParams] = useSearchParams()
  const machineId = searchParams.get('machineId')

  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const today = todayIso()

  // OEE filters
  const [oeeMachines, setOeeMachines] = useState({ forId: null, ids: [] })
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE_MODE)
  const [oeeRange, setOeeRange] = useState(() => ({ from: shiftIsoDate(today, 1 - DEFAULT_RANGE_DAYS), to: today }))
  const [oeeShifts, setOeeShifts] = useState([])
  const [oeeProgram, setOeeProgram] = useState(ALL_PROGRAMS)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getMachines()
      .then((list) => active && setMachines(list))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  const machine = machines.find((item) => String(item.id) === machineId) ?? machines[0]
  const selectedId = machine?.id

  // Keep the URL on the machine shown (no id, or one this user cannot see)
  useEffect(() => {
    if (selectedId != null && String(selectedId) !== machineId) {
      setSearchParams({ machineId: String(selectedId) }, { replace: true })
    }
  }, [selectedId, machineId, setSearchParams])

  // OEE compares machines of the header machine's customer; a pick starts as that machine. Each
  // option shows the machine's current mode, so the search finds machines by mode too
  const customerMachineOptions = useMemo(
    () =>
      machines
        .filter((item) => item.userId === machine?.userId)
        .map((item) => ({ value: String(item.id), label: item.name, hint: modeTypeOf(item.modeId)?.label })),
    [machines, machine?.userId],
  )
  // Shift filters: the header machine's customer's shifts
  const shiftsState = useLoad(
    () => getShifts(isSuperadmin ? machine.userId : undefined),
    machine ? `shifts|${machine.userId}` : null,
  )
  const shiftOptions = useMemo(
    () => (shiftsState.data ?? []).filter((shift) => shift.userId === machine?.userId).map(shiftOption),
    [shiftsState.data, machine?.userId],
  )

  const oeeMachineIds = useMemo(() => pickedMachineIds(oeeMachines, selectedId), [oeeMachines, selectedId])
  const oeeFilters = {
    machineIds: oeeMachineIds,
    from: oeeRange.from,
    to: oeeRange.to,
    shiftIds: shiftsIn(oeeShifts, shiftOptions),
    program: oeeProgram,
    schedule,
  }
  const oeeState = useLoad(() => getOee(oeeFilters), oeeMachineIds.length ? JSON.stringify(oeeFilters) : null)
  const oeeProgramOptions = useMemo(() => programOptions(oeeState.data?.programs), [oeeState.data])
  const oeeProgramPicked = programIn(oeeProgram, oeeProgramOptions)
  const oee = useMemo(() => withDayLabels(oeeState.data?.rows ?? []), [oeeState.data])

  const renderBody = () => {
    if (loading) return <Loader text="Loading machines…" />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load machines.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }

    if (!machine) {
      return (
        <Card>
          <Card.Body className="ts-empty">
            <i className="bi bi-graph-up-arrow ts-empty-icon" aria-hidden="true" />
            <p className="mb-2">No machines to show productivity for.</p>
            <Button as={Link} to={ROUTES.MACHINES} size="sm" variant="ghost">
              All Machines
            </Button>
          </Card.Body>
        </Card>
      )
    }

    return (
      <>
        <Row xs={1} className="g-3">
          <Col>
            <SummaryCards key={selectedId} machineId={selectedId} today={today} />
          </Col>
          <Col>
            <ModeTimelineCard key={selectedId} machineId={selectedId} min={PRODUCTIVITY_DATE_MIN} today={today} />
          </Col>
          <Col>
            <ChartCard title="OEE" subtitle="Line · daily %, averaged over the machines and shifts picked" icon="bi-graph-up">
              <div className="ts-toolbar">
                <Form.Select
                  className="w-auto"
                  value={schedule}
                  onChange={(event) => setSchedule(event.target.value)}
                  aria-label="Schedule"
                >
                  {SCHEDULE_MODES.map((mode) => (
                    <option key={mode.value} value={mode.value}>
                      {mode.label}
                    </option>
                  ))}
                </Form.Select>
                <div className="ts-chart-filter">
                  <MultiSelectPicker
                    id="oee-machines"
                    options={customerMachineOptions}
                    value={oeeMachineIds}
                    onChange={(ids) => setOeeMachines({ forId: selectedId, ids })}
                    noun={MACHINE_NOUN}
                    placeholder="Select machines"
                    showPicked={false}
                  />
                </div>
                <ChartDateFilter
                  mode="range"
                  value={oeeRange}
                  onChange={setOeeRange}
                  min={PRODUCTIVITY_DATE_MIN}
                  max={today}
                  maxDays={MAX_RANGE_DAYS}
                  label="OEE dates"
                />
                <div className="ts-chart-filter">
                  <MultiSelectPicker
                    id="oee-shifts"
                    options={shiftOptions}
                    value={shiftsIn(oeeShifts, shiftOptions)}
                    onChange={setOeeShifts}
                    noun={SHIFT_NOUN}
                    placeholder="All shifts"
                    showPicked={false}
                  />
                </div>
                <ProgramSelect id="oee-program" value={oeeProgramPicked} options={oeeProgramOptions} onChange={setOeeProgram} />
              </div>
              <LineTrendChart
                data={oee}
                series={OEE_SERIES}
                xKey="label"
                yUnit="%"
                yDomain={OEE_DOMAIN}
                yTicks={OEE_TICKS}
                valueFormatter={percent}
                limits={OEE_LIMITS}
                dots
                size="lg"
                emptyText={
                  oeeMachineIds.length ? chartMessage(oeeState, 'No OEE for these dates.') : 'Select at least one machine.'
                }
              />
            </ChartCard>
          </Col>
        </Row>
      </>
    )
  }

  return (
    <>
      <div className="ts-tab-header">
        <div>
          <h2 className="ts-section-title">Productivity</h2>
          <p className="ts-note mb-0">
            {machine ? `${machine.name}: today's summary, machine modes and OEE.` : 'Summary, machine modes and OEE of a machine.'}
          </p>
        </div>
        {machines.length > 0 && (
          <div className="ts-page-actions">
            <Form.Select
              className="w-auto"
              value={selectedId ?? ''}
              onChange={(event) => setSearchParams({ machineId: event.target.value })}
              aria-label="Machine"
            >
              {machines.map((item) => (
                <option key={item.id} value={item.id}>
                  {machineLabel(item, isSuperadmin)}
                </option>
              ))}
            </Form.Select>
          </div>
        )}
      </div>

      {renderBody()}
    </>
  )
}

export default Productivity
