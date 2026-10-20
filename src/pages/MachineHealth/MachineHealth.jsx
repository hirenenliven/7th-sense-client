import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Link, useSearchParams } from 'react-router-dom'
import AreaGrowthChart from '@/components/charts/AreaGrowthChart'
import BarLineChart from '@/components/charts/BarLineChart'
import ChartCard from '@/components/charts/ChartCard'
import ChartDateFilter from '@/components/charts/ChartDateFilter'
import DonutChart from '@/components/charts/DonutChart'
import GroupedBarChart from '@/components/charts/GroupedBarChart'
import RadarScoreChart from '@/components/charts/RadarScoreChart'
import Speedometer from '@/components/charts/Speedometer'
import StackedBarChart from '@/components/charts/StackedBarChart'
import { STATUS_COLORS } from '@/components/charts/chartTheme'
import Loader from '@/components/common/Loader'
import { SUPERADMIN_ONLY } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'
import { getMachines } from '@/services/machineService'
import { shiftIsoDate, todayIso } from '@/utils/dateTime'
import HealthStatusBadge from './HealthStatusBadge'
import {
  dailyRows,
  hourlyTemperatures,
  runHours,
  sensorDay,
  spindleLoad,
  stateShare,
  subsystemScores,
} from './healthSampleData'
import {
  DEFAULT_RANGE_DAYS,
  HEALTH_DATE_MIN,
  MACHINE_STATES,
  MAX_RANGE_DAYS,
  SPINDLE_LOAD,
  TEMPERATURE_GROUP,
  TREND_SENSORS,
  formatHours,
  formatValue,
  statusOf,
} from './healthSensors'
import SensorTrendCard from './SensorTrendCard'

// Coloured left edge on a tile whose reading needs attention
const KPI_EDGE = { warning: 'card-status-warning', critical: 'card-status-danger' }

// Series of the summary charts (colours: categorical order, or the machine state's status colour)
const STATE_SERIES = MACHINE_STATES.map(({ key, label, color, muted }) => ({ key, label, color: STATUS_COLORS[color], muted }))
const RUN_HOURS = { key: 'running', label: 'Run hours' }
const RUN_HOURS_AVERAGE = [{ key: 'average', label: '7-day average', dashed: true }]
const RUN_HOURS_TOTAL = { key: 'cumulative', label: 'Total run hours' }
const SCORE_SERIES = [{ key: 'score', label: 'Health score' }]
const DAY_HOURS = [0, 6, 12, 18, 24]
const DAY_DOMAIN = [0, 24]

// Date filter of each summary chart: one day, or a range of days (sensor trends pick their own day)
const DATE_FILTERS = {
  load: 'single',
  machineTime: 'single',
  subsystems: 'single',
  temperatures: 'single',
  machineTimeByDay: 'range',
  runHoursGrowth: 'range',
  runHoursDaily: 'range',
}

const initialDates = () => {
  const today = todayIso()
  const lastDays = { from: shiftIsoDate(today, 1 - DEFAULT_RANGE_DAYS), to: today }
  return Object.fromEntries(
    Object.entries(DATE_FILTERS).map(([key, mode]) => [key, mode === 'range' ? lastDays : today]),
  )
}

const celsius = (value) => `${formatValue(value, 1)} °C`
const outOf100 = (value) => `${value} / 100`

const machineLabel = (machine, withCustomer) =>
  withCustomer && machine.customerName ? `${machine.name} · ${machine.customerName}` : machine.name

// Operations › Machine Health: one machine's sensors (`?machineId=`, set by the All Machines Health
// link; the first machine otherwise). Today's KPI tiles, then charts that each have a date filter (one
// day or a range). Readings are SAMPLE data (healthSampleData.js) until the server has a sensor API.
function MachineHealth() {
  const { hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)
  const [searchParams, setSearchParams] = useSearchParams()
  const machineId = searchParams.get('machineId')

  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [dates, setDates] = useState(initialDates)
  const today = todayIso()

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

  // Each chart's data for its own date / range
  const load = useMemo(() => (selectedId == null ? 0 : spindleLoad(selectedId, dates.load)), [selectedId, dates.load])
  const loadStatus = statusOf(load, SPINDLE_LOAD)

  const donut = useMemo(() => {
    if (selectedId == null) return null
    const parts = stateShare(selectedId, dates.machineTime).map((state) => ({
      ...STATE_SERIES.find((series) => series.key === state.key),
      value: state.hours,
    }))
    const total = parts.reduce((sum, part) => sum + part.value, 0)
    const running = parts.find((part) => part.key === RUN_HOURS.key)?.value ?? 0
    return { parts, share: `${total ? Math.round((running / total) * 100) : 0}%` }
  }, [selectedId, dates.machineTime])

  const subsystems = useMemo(
    () => (selectedId == null ? [] : subsystemScores(selectedId, dates.subsystems)),
    [selectedId, dates.subsystems],
  )
  const hourly = useMemo(
    () => (selectedId == null ? [] : hourlyTemperatures(selectedId, dates.temperatures)),
    [selectedId, dates.temperatures],
  )
  const byDay = useMemo(() => {
    const rows = (range) => (selectedId == null ? [] : dailyRows(selectedId, range.from, range.to))
    return {
      machineTime: rows(dates.machineTimeByDay),
      growth: rows(dates.runHoursGrowth),
      daily: rows(dates.runHoursDaily),
    }
  }, [selectedId, dates.machineTimeByDay, dates.runHoursGrowth, dates.runHoursDaily])

  // KPI tiles: today's latest readings
  const kpis = useMemo(() => {
    if (selectedId == null) return []
    const loadNow = spindleLoad(selectedId, today)
    return [
      ...TREND_SENSORS.map((sensor) => {
        const points = sensorDay(selectedId, sensor.key, today)
        const value = points[points.length - 1].value
        return {
          key: sensor.key,
          label: sensor.label,
          icon: sensor.icon,
          value: formatValue(value, sensor.decimals),
          unit: sensor.unit,
          status: statusOf(value, sensor),
        }
      }),
      {
        key: 'runHours',
        label: 'Today’s Spindle Run Hours',
        icon: 'bi-clock-history',
        value: formatHours(runHours(selectedId, today)),
      },
      {
        key: 'spindleLoad',
        label: SPINDLE_LOAD.label,
        icon: 'bi-speedometer2',
        value: formatValue(loadNow, 1),
        unit: SPINDLE_LOAD.unit,
        status: statusOf(loadNow, SPINDLE_LOAD),
      },
    ]
  }, [selectedId, today])

  // The header date filter of the chart `key` (DATE_FILTERS says single day or range)
  const dateFilter = (key, label) => (
    <ChartDateFilter
      mode={DATE_FILTERS[key]}
      value={dates[key]}
      onChange={(value) => setDates((current) => ({ ...current, [key]: value }))}
      min={HEALTH_DATE_MIN}
      max={today}
      maxDays={MAX_RANGE_DAYS}
      label={`${label} date`}
    />
  )

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
            <i className="bi bi-heart-pulse ts-empty-icon" aria-hidden="true" />
            <p className="mb-2">No machines to show health for.</p>
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
            <b>Sample data.</b> These charts show example readings until live sensor data is connected.
          </span>
        </Alert>

        <Row xs={1} sm={2} lg={3} xxl={6} className="g-3 mb-3">
          {kpis.map((kpi) => (
            <Col key={kpi.key}>
              <Card className={`ts-kpi h-100 ${KPI_EDGE[kpi.status] ?? ''}`}>
                <Card.Body>
                  <div className="ts-kpi-label">
                    <i className={`bi ${kpi.icon} me-1`} aria-hidden="true" />
                    {kpi.label}
                  </div>
                  <div className="ts-kpi-value font-tabular">
                    {kpi.value}
                    {kpi.unit && <small> {kpi.unit}</small>}
                  </div>
                  {kpi.status && (
                    <div className="ts-kpi-meta">
                      <HealthStatusBadge status={kpi.status} />
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row xs={1} xl={3} className="g-3 mb-3">
          <Col>
            <ChartCard
              title="Spindle Load"
              subtitle={dates.load === today ? 'Speedometer · now' : 'Speedometer · end of day'}
              icon="bi-speedometer2"
              actions={dateFilter('load', 'Spindle load')}
            >
              <Speedometer
                value={load}
                min={SPINDLE_LOAD.min}
                max={SPINDLE_LOAD.max}
                warning={SPINDLE_LOAD.warning}
                critical={SPINDLE_LOAD.critical}
                unit={SPINDLE_LOAD.unit}
                status={loadStatus}
                label={SPINDLE_LOAD.label}
              >
                <div className="ts-number ts-number-md font-tabular mt-3">
                  {formatValue(load, 1)}
                  <small>{SPINDLE_LOAD.unit}</small>
                </div>
                <div className="mt-2">
                  <HealthStatusBadge status={loadStatus} />
                </div>
              </Speedometer>
            </ChartCard>
          </Col>
          <Col>
            <ChartCard
              title="Machine Time"
              subtitle="Donut · hours per state"
              icon="bi-pie-chart"
              actions={dateFilter('machineTime', 'Machine time')}
            >
              <DonutChart data={donut.parts} centre={{ value: donut.share, caption: 'running' }} valueFormatter={formatHours} />
            </ChartCard>
          </Col>
          <Col>
            <ChartCard
              title="Subsystem Health"
              subtitle="Radar · score out of 100"
              icon="bi-bullseye"
              actions={dateFilter('subsystems', 'Subsystem health')}
            >
              <RadarScoreChart data={subsystems} series={SCORE_SERIES} valueFormatter={outOf100} />
            </ChartCard>
          </Col>
        </Row>

        <Row xs={1} xxl={2} className="g-3 mb-3">
          {TREND_SENSORS.map((sensor) => (
            <Col key={sensor.key}>
              <SensorTrendCard sensor={sensor} machineId={selectedId} />
            </Col>
          ))}
        </Row>

        <Row xs={1} xl={2} className="g-3 mb-3">
          <Col>
            <ChartCard
              title="Temperatures by Hour"
              subtitle="Grouped bar · four sensors every 3 hours"
              icon="bi-bar-chart"
              actions={dateFilter('temperatures', 'Temperatures')}
            >
              <GroupedBarChart data={hourly} series={TEMPERATURE_GROUP} yUnit="°" valueFormatter={celsius} />
            </ChartCard>
          </Col>
          <Col>
            <ChartCard
              title="Machine Time by Day"
              subtitle="Stacked bar · 24 h per day"
              icon="bi-bar-chart-steps"
              actions={dateFilter('machineTimeByDay', 'Machine time by day')}
            >
              <StackedBarChart
                data={byDay.machineTime}
                series={STATE_SERIES}
                yUnit="h"
                yDomain={DAY_DOMAIN}
                yTicks={DAY_HOURS}
                valueFormatter={formatHours}
              />
            </ChartCard>
          </Col>
        </Row>

        <Row xs={1} xl={2} className="g-3">
          <Col>
            <ChartCard
              title="Spindle Run Hours Growth"
              subtitle="Area · running total over the range"
              icon="bi-graph-up-arrow"
              actions={dateFilter('runHoursGrowth', 'Run hours growth')}
            >
              <AreaGrowthChart data={byDay.growth} series={RUN_HOURS_TOTAL} yUnit="h" valueFormatter={formatHours} />
            </ChartCard>
          </Col>
          <Col>
            <ChartCard
              title="Daily Spindle Run Hours"
              subtitle="Bar + line · with 7-day average"
              icon="bi-graph-up"
              actions={dateFilter('runHoursDaily', 'Daily run hours')}
            >
              <BarLineChart
                data={byDay.daily}
                bars={[RUN_HOURS]}
                lines={RUN_HOURS_AVERAGE}
                yUnit="h"
                yDomain={DAY_DOMAIN}
                yTicks={DAY_HOURS}
                valueFormatter={formatHours}
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
          <h1>Machine Health</h1>
          <p className="ts-page-subtitle">
            {machine ? `${machine.name}: sensor readings, limits and trends.` : 'Sensor readings, limits and trends of a machine.'}
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

export default MachineHealth
