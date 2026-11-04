import { useMemo, useState } from 'react'
import { Alert, Card, Col, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
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
import { MACHINE_MODES } from '@/constants/machines'
import useLoad from '@/hooks/useLoad'
import { getMachineTimeByDay } from '@/services/machineHealthService'
import { PICKER_LOCALE, parseIsoDate, shiftIsoDate, todayIso } from '@/utils/dateTime'
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

// Series of the summary charts (colours: categorical order, or the machine mode's status colour)
const STATE_SERIES = MACHINE_MODES.map(({ key, label, color, muted }) => ({ key, label, color: STATUS_COLORS[color], muted }))
const RUN_HOURS = { key: 'production', label: 'Run hours' }
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

// Machine Time by Day is live (GET /machine-health/machine-time-by-day): reloaded every minute
const MACHINE_TIME_REFRESH_MS = 60_000
const dayLabel = new Intl.DateTimeFormat(PICKER_LOCALE, { day: '2-digit', month: 'short' })

const celsius = (value) => `${formatValue(value, 1)} °C`
const outOf100 = (value) => `${value} / 100`

// Operations › Monitoring › a machine › Machine Health tab (MonitoringMachine passes the machine).
// Today's KPI tiles, then charts that each have a date filter (one day or a range). Machine Time by
// Day is live data; the other readings are SAMPLE data (healthSampleData.js) until the server has a
// sensor API.
function MachineHealth({ machine }) {
  const selectedId = machine.id
  const [dates, setDates] = useState(initialDates)
  const today = todayIso()

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
    const production = parts.find((part) => part.key === RUN_HOURS.key)?.value ?? 0
    return { parts, share: `${total ? Math.round((production / total) * 100) : 0}%` }
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
      growth: rows(dates.runHoursGrowth),
      daily: rows(dates.runHoursDaily),
    }
  }, [selectedId, dates.runHoursGrowth, dates.runHoursDaily])

  const machineTimeRange = dates.machineTimeByDay
  const machineTimeState = useLoad(
    () => getMachineTimeByDay(selectedId, machineTimeRange.from, machineTimeRange.to),
    selectedId == null ? null : `${selectedId}|${machineTimeRange.from}|${machineTimeRange.to}`,
    { refreshMs: machineTimeRange.to === today ? MACHINE_TIME_REFRESH_MS : undefined },
  )
  const machineTimeRows = useMemo(
    () => (machineTimeState.data ?? []).map((row) => ({ ...row, label: dayLabel.format(parseIsoDate(row.date)) })),
    [machineTimeState.data],
  )

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
              subtitle="Donut · hours per machine mode"
              icon="bi-pie-chart"
              actions={dateFilter('machineTime', 'Machine time')}
            >
              <DonutChart data={donut.parts} centre={{ value: donut.share, caption: 'in production' }} valueFormatter={formatHours} />
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
              subtitle="Stacked bar · live hours per machine mode, 24 h per day"
              icon="bi-bar-chart-steps"
              actions={dateFilter('machineTimeByDay', 'Machine time by day')}
            >
              <StackedBarChart
                data={machineTimeRows}
                series={STATE_SERIES}
                yUnit="h"
                yDomain={DAY_DOMAIN}
                yTicks={DAY_HOURS}
                valueFormatter={formatHours}
                emptyText={
                  machineTimeState.loading ? 'Loading…' : machineTimeState.error || 'No machine time for these dates.'
                }
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
      <div className="ts-tab-header">
        <div>
          <h2 className="ts-section-title">Machine Health</h2>
          <p className="ts-note mb-0">
            {machine.name}: sensor readings, limits and trends.
          </p>
        </div>
      </div>

      {renderBody()}
    </>
  )
}

MachineHealth.propTypes = {
  machine: PropTypes.shape({ id: PropTypes.number.isRequired, name: PropTypes.string }).isRequired,
}

export default MachineHealth
