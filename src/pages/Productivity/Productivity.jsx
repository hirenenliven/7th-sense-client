import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Link, useSearchParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import BarLineChart from '@/components/charts/BarLineChart'
import ChartCard from '@/components/charts/ChartCard'
import ChartDateFilter from '@/components/charts/ChartDateFilter'
import GroupedBarChart from '@/components/charts/GroupedBarChart'
import LineTrendChart from '@/components/charts/LineTrendChart'
import { STATUS_COLORS } from '@/components/charts/chartTheme'
import Loader from '@/components/common/Loader'
import MultiSelectPicker from '@/components/common/MultiSelectPicker'
import { SUPERADMIN_ONLY } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'
import useLoad from '@/hooks/useLoad'
import { getMachines } from '@/services/machineService'
import { getCycleCounts, getFinishCycles, getOee } from '@/services/productivityService'
import { getShifts } from '@/services/shiftService'
import { PICKER_LOCALE, parseIsoDate, shiftIsoDate, todayIso } from '@/utils/dateTime'
import ModeTimelineCard from './ModeTimelineCard'
import {
  ALL_PROGRAMS,
  CYCLE_COUNTS,
  CYCLE_PARTS,
  CYCLE_TIME,
  DEFAULT_RANGE_DAYS,
  KPI_REFRESH_MS,
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
  cycleTicks,
  formatCycle,
  formatCycleTick,
  formatCount,
  formatCycles,
  percent,
  shiftOption,
} from './productivitySettings'

const CYCLE_COUNT_SERIES = CYCLE_COUNTS.map(({ key, label, color }) => ({ key, label, color: STATUS_COLORS[color] }))

const dayLabel = new Intl.DateTimeFormat(PICKER_LOCALE, { day: '2-digit', month: 'short' })
const clock = new Intl.DateTimeFormat(PICKER_LOCALE, { hour: '2-digit', minute: '2-digit' })
// Finish Cycle Summary x axis: the clock time a cycle finished ("12:30 PM"; the tooltip adds seconds)
const clock12 = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
const clock12Seconds = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })

// Tooltip title of a finished cycle: "Finished 12:30:15 PM · O1234"
const cycleTooltipLabel = (label, payload) => {
  const row = payload?.[0]?.payload
  if (!row) return label
  return `Finished ${row.finishedAt}${row.program ? ` · ${row.program}` : ''}`
}

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

// Operations › Productivity: OEE and finished cycles of a machine (`?machineId=`, set by the All
// Machines Productivity link; the first machine otherwise). Today's cycle counts, then the OEE trend
// (one or more machines of the same customer, over a range of days) and the Finish Cycle Summary
// (one day's cycles). Live data from GET /productivity/* (what the CNC collector recorded); the
// Machine Mode Timeline reloads itself (ModeTimelineCard).
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

  // Finish Cycle Summary filters
  const [cycleDate, setCycleDate] = useState(today)
  const [cycleShifts, setCycleShifts] = useState([])
  const [cycleProgram, setCycleProgram] = useState(ALL_PROGRAMS)

  // Finished / Unfinished Cycles filters
  const [countMachines, setCountMachines] = useState({ forId: null, ids: [] })
  const [countRange, setCountRange] = useState(() => ({ from: shiftIsoDate(today, 1 - DEFAULT_RANGE_DAYS), to: today }))
  const [countShifts, setCountShifts] = useState([])

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

  // OEE and cycle counts compare machines of the header machine's customer; a pick starts as that machine
  const customerMachineOptions = useMemo(
    () =>
      machines
        .filter((item) => item.userId === machine?.userId)
        .map((item) => ({ value: String(item.id), label: item.name })),
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

  const cycleFilters = {
    machineId: selectedId,
    date: cycleDate,
    shiftIds: shiftsIn(cycleShifts, shiftOptions),
    program: cycleProgram,
  }
  const cycleState = useLoad(() => getFinishCycles(cycleFilters), selectedId == null ? null : JSON.stringify(cycleFilters))
  const cycleProgramOptions = useMemo(() => programOptions(cycleState.data?.programs), [cycleState.data])
  const cycleProgramPicked = programIn(cycleProgram, cycleProgramOptions)
  const cycles = useMemo(
    () =>
      (cycleState.data?.cycles ?? []).map((cycle) => ({
        label: clock12.format(new Date(cycle.endedAt)),
        finishedAt: clock12Seconds.format(new Date(cycle.endedAt)),
        program: cycle.programName,
        cycle: cycle.durationSec,
        production: cycle.productionSec,
        hold: cycle.holdSec,
        downtime: cycle.downtimeSec,
        offline: cycle.offlineSec,
      })),
    [cycleState.data],
  )
  // Highest bar or line point (a cycle's mode parts can add up to more than its duration)
  const cycleYTicks = useMemo(
    () =>
      cycleTicks(
        cycles.reduce(
          (max, row) => Math.max(max, row.cycle, row.production + row.hold + row.downtime + row.offline),
          0,
        ),
      ),
    [cycles],
  )

  const countMachineIds = useMemo(() => pickedMachineIds(countMachines, selectedId), [countMachines, selectedId])
  const countFilters = {
    machineIds: countMachineIds,
    from: countRange.from,
    to: countRange.to,
    shiftIds: shiftsIn(countShifts, shiftOptions),
  }
  const countState = useLoad(() => getCycleCounts(countFilters), countMachineIds.length ? JSON.stringify(countFilters) : null)
  const counts = useMemo(() => {
    const rows = withDayLabels(countState.data ?? [])
    // Legend: each series' total over the range ("Produced 1,357 cycles")
    const totals = Object.fromEntries(
      CYCLE_COUNTS.map((item) => [item.key, formatCycles(rows.reduce((sum, row) => sum + row[item.key], 0))]),
    )
    return { rows, totals }
  }, [countState.data])

  // KPI tiles: today's plain counts for the header machine (every shift and program); no OEE maths
  const todayState = useLoad(
    () => getFinishCycles({ machineId: selectedId, date: today }),
    selectedId == null ? null : `${selectedId}|${today}`,
    { refreshMs: KPI_REFRESH_MS },
  )
  const kpis = useMemo(() => {
    const day = todayState.data
    if (!day) return []
    const { summary } = day
    const average = summary.completedCount ? summary.averageCycleSec : null
    return [
      { key: 'produced', label: 'Cycles Started', icon: 'bi-play-circle', value: formatCount(summary.cycleCount) },
      { key: 'finished', label: 'Finished Cycles', icon: 'bi-check2-circle', value: formatCount(summary.completedCount) },
      { key: 'unfinished', label: 'Unfinished Cycles', icon: 'bi-x-circle', value: formatCount(summary.unfinishedCount) },
      {
        key: 'finishRate',
        label: 'Finish Rate',
        icon: 'bi-percent',
        value: summary.cycleCount ? percent((summary.completedCount / summary.cycleCount) * 100) : '—',
      },
      {
        key: 'averageCycle',
        label: 'Avg. Cycle Time',
        icon: 'bi-stopwatch',
        value: average == null ? '—' : formatCycle(average),
        // Held / offline time makes a cycle longer than its cutting time
        meta: average == null ? undefined : `${formatCycle(summary.averageProductionSec)} in production`,
      },
      {
        key: 'lastCycle',
        label: 'Last Cycle Finished',
        icon: 'bi-clock',
        value: day.lastFinishedAt ? clock.format(new Date(day.lastFinishedAt)) : '—',
      },
    ]
  }, [todayState.data])

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
        {todayState.error && (
          <Alert variant="danger">
            <b>Could not load today’s cycles.</b> {todayState.error}
          </Alert>
        )}

        <Row xs={1} sm={2} lg={3} xxl={6} className="g-3 mb-3">
          {kpis.map((kpi) => (
            <Col key={kpi.key}>
              <Card className="ts-kpi h-100">
                <Card.Body>
                  <div className="ts-kpi-label">
                    <i className={`bi ${kpi.icon} me-1`} aria-hidden="true" />
                    {kpi.label}
                  </div>
                  <div className="ts-kpi-value font-tabular">
                    {kpi.value}
                    {kpi.unit && <small> {kpi.unit}</small>}
                  </div>
                  {kpi.meta && <div className="ts-kpi-meta small text-body-secondary">{kpi.meta}</div>}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row xs={1} className="g-3">
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
          <Col>
            <ChartCard
              title="Finish Cycle Summary"
              subtitle="Cycle time vs clock time · each finished cycle of the day, time per machine mode"
              icon="bi-bar-chart-steps"
            >
              <div className="ts-toolbar">
                <ChartDateFilter
                  value={cycleDate}
                  onChange={setCycleDate}
                  min={PRODUCTIVITY_DATE_MIN}
                  max={today}
                  label="Finish cycle date"
                />
                <div className="ts-chart-filter">
                  <MultiSelectPicker
                    id="cycle-shifts"
                    options={shiftOptions}
                    value={shiftsIn(cycleShifts, shiftOptions)}
                    onChange={setCycleShifts}
                    noun={SHIFT_NOUN}
                    placeholder="All shifts"
                    showPicked={false}
                  />
                </div>
                <ProgramSelect
                  id="cycle-program"
                  value={cycleProgramPicked}
                  options={cycleProgramOptions}
                  onChange={setCycleProgram}
                />
                <span className="ms-auto small text-body-secondary">
                  {cycles.length} {cycles.length === 1 ? 'cycle' : 'cycles'}
                </span>
              </div>
              <BarLineChart
                data={cycles}
                bars={CYCLE_PARTS}
                lines={CYCLE_TIME}
                stacked
                yDomain={[0, cycleYTicks.at(-1)]}
                yTicks={cycleYTicks}
                yTickFormatter={formatCycleTick}
                valueFormatter={formatCycle}
                labelFormatter={cycleTooltipLabel}
                emptyText={chartMessage(cycleState, 'No finished cycles for this day, shift and program.')}
              />
            </ChartCard>
          </Col>
          <Col>
            <ChartCard
              title="Finished / Unfinished Cycles"
              subtitle="Grouped bar · cycles per day, summed over the machines and shifts picked"
              icon="bi-bar-chart"
            >
              <div className="ts-toolbar">
                <div className="ts-chart-filter">
                  <MultiSelectPicker
                    id="count-machines"
                    options={customerMachineOptions}
                    value={countMachineIds}
                    onChange={(ids) => setCountMachines({ forId: selectedId, ids })}
                    noun={MACHINE_NOUN}
                    placeholder="Select machines"
                    showPicked={false}
                  />
                </div>
                <ChartDateFilter
                  mode="range"
                  value={countRange}
                  onChange={setCountRange}
                  min={PRODUCTIVITY_DATE_MIN}
                  max={today}
                  maxDays={MAX_RANGE_DAYS}
                  label="Cycle count dates"
                />
                <div className="ts-chart-filter">
                  <MultiSelectPicker
                    id="count-shifts"
                    options={shiftOptions}
                    value={shiftsIn(countShifts, shiftOptions)}
                    onChange={setCountShifts}
                    noun={SHIFT_NOUN}
                    placeholder="All shifts"
                    showPicked={false}
                  />
                </div>
              </div>
              <GroupedBarChart
                data={counts.rows}
                series={CYCLE_COUNT_SERIES}
                legendValues={counts.totals}
                yTickFormatter={formatCount}
                valueFormatter={formatCycles}
                emptyText={
                  countMachineIds.length ? chartMessage(countState, 'No cycles for these dates.') : 'Select at least one machine.'
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
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Operations · Machines</div>
          <h1>Productivity</h1>
          <p className="ts-page-subtitle">
            {machine ? `${machine.name}: OEE and finished cycles.` : 'OEE and finished cycles of a machine.'}
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
      </header>

      {renderBody()}
    </>
  )
}

export default Productivity
