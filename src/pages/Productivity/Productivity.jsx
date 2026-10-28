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
import { getMachines } from '@/services/machineService'
import { shiftIsoDate, todayIso } from '@/utils/dateTime'
import { cycleCountRows, finishedCycles, oeeRows, samplePrograms } from './productivitySampleData'
import {
  ALL_PROGRAMS,
  CYCLE_COUNTS,
  CYCLE_PARTS,
  CYCLE_TIME,
  DEFAULT_RANGE_DAYS,
  DEFAULT_SCHEDULE_MODE,
  MACHINE_NOUN,
  MAX_RANGE_DAYS,
  OEE_DOMAIN,
  OEE_LIMITS,
  OEE_SERIES,
  OEE_TICKS,
  PRODUCTIVITY_DATE_MIN,
  SAMPLE_SHIFTS,
  SCHEDULE_MODES,
  SHIFT_NOUN,
  formatCycle,
  formatCount,
  formatCycles,
  percent,
} from './productivitySettings'

const CYCLE_COUNT_SERIES = CYCLE_COUNTS.map(({ key, label, color }) => ({ key, label, color: STATUS_COLORS[color] }))

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
// Machines Productivity link; the first machine otherwise). Today's KPI tiles, then the OEE trend
// (one or more machines of the same customer, over a range of days) and the Finish Cycle Summary
// (one day's cycles). Values are SAMPLE data (productivitySampleData.js) until the server has an API.
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
  const oeeMachineIds = useMemo(() => pickedMachineIds(oeeMachines, selectedId), [oeeMachines, selectedId])
  const oeeProgramOptions = useMemo(() => {
    const byName = new Map()
    oeeMachineIds.forEach((id) => samplePrograms(id).forEach((option) => byName.set(option.value, option)))
    return [...byName.values()].sort((a, b) => a.label.localeCompare(b.label))
  }, [oeeMachineIds])
  const oeeProgramPicked = programIn(oeeProgram, oeeProgramOptions)

  const oee = useMemo(
    () =>
      oeeRows(oeeMachineIds, oeeRange.from, oeeRange.to, { schedule, shiftIds: oeeShifts, program: oeeProgramPicked }),
    [oeeMachineIds, oeeRange, schedule, oeeShifts, oeeProgramPicked],
  )

  const cycleProgramOptions = useMemo(() => (selectedId == null ? [] : samplePrograms(selectedId)), [selectedId])
  const cycleProgramPicked = programIn(cycleProgram, cycleProgramOptions)
  const cycles = useMemo(
    () =>
      selectedId == null ? [] : finishedCycles(selectedId, cycleDate, { shiftIds: cycleShifts, program: cycleProgramPicked }),
    [selectedId, cycleDate, cycleShifts, cycleProgramPicked],
  )

  const countMachineIds = useMemo(() => pickedMachineIds(countMachines, selectedId), [countMachines, selectedId])
  const counts = useMemo(() => {
    const rows = cycleCountRows(countMachineIds, countRange.from, countRange.to, { shiftIds: countShifts })
    // Legend: each series' total over the range ("Produced 1,357 cycles")
    const totals = Object.fromEntries(
      CYCLE_COUNTS.map((item) => [item.key, formatCycles(rows.reduce((sum, row) => sum + row[item.key], 0))]),
    )
    return { rows, totals }
  }, [countMachineIds, countRange, countShifts])

  // KPI tiles: today, every shift and program, without schedule
  const kpis = useMemo(() => {
    if (selectedId == null) return []
    const [day] = oeeRows([selectedId], today, today, { schedule: DEFAULT_SCHEDULE_MODE, shiftIds: [] })
    const done = finishedCycles(selectedId, today, { shiftIds: [] })
    const average = done.length ? done.reduce((sum, item) => sum + item.cycle, 0) / done.length : null
    return [
      { key: 'oee', label: 'Today’s OEE', icon: 'bi-speedometer', value: percent(day.oee) },
      { key: 'availability', label: 'Availability', icon: 'bi-clock-history', value: percent(day.availability) },
      { key: 'performance', label: 'Performance', icon: 'bi-lightning-charge', value: percent(day.performance) },
      { key: 'quality', label: 'Quality', icon: 'bi-patch-check', value: percent(day.quality) },
      { key: 'cycles', label: 'Finished Cycles', icon: 'bi-check2-circle', value: String(done.length) },
      {
        key: 'averageCycle',
        label: 'Avg. Cycle Time',
        icon: 'bi-stopwatch',
        value: average == null ? '—' : formatCycle(average),
        unit: average == null ? undefined : 'min',
      },
    ]
  }, [selectedId, today])

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
        <Alert variant="info" className="d-flex align-items-center gap-2">
          <i className="bi bi-info-circle" aria-hidden="true" />
          <span>
            <b>Sample data.</b> These charts show example values until live production data is connected.
          </span>
        </Alert>

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
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row xs={1} className="g-3">
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
                    options={SAMPLE_SHIFTS}
                    value={oeeShifts}
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
                emptyText={oeeMachineIds.length ? 'No OEE for these dates.' : 'Select at least one machine.'}
              />
            </ChartCard>
          </Col>
          <Col>
            <ChartCard
              title="Finish Cycle Summary"
              subtitle="Stacked bar + line · each finished cycle of the day, in minutes"
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
                    options={SAMPLE_SHIFTS}
                    value={cycleShifts}
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
                yUnit="m"
                valueFormatter={formatCycle}
                emptyText="No finished cycles for this day, shift and program."
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
                    options={SAMPLE_SHIFTS}
                    value={countShifts}
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
                emptyText={countMachineIds.length ? 'No cycles for these dates.' : 'Select at least one machine.'}
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
