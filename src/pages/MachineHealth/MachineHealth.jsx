import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Link, useSearchParams } from 'react-router-dom'
import ChartCard from '@/components/charts/ChartCard'
import Speedometer from '@/components/charts/Speedometer'
import Loader from '@/components/common/Loader'
import { SUPERADMIN_ONLY } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'
import { getMachines } from '@/services/machineService'
import HealthStatusBadge from './HealthStatusBadge'
import {
  MachineTimeChart,
  MachineTimeDonut,
  RunHourDailyChart,
  RunHourGrowthChart,
  SubsystemRadarChart,
  TemperatureGroupChart,
} from './HealthCharts'
import { buildHealthSample } from './healthSampleData'
import { SPINDLE_LOAD, TREND_SENSORS, formatHours, formatValue, statusOf } from './healthSensors'
import SensorTrendCard from './SensorTrendCard'

const machineLabel = (machine, withCustomer) =>
  withCustomer && machine.customerName ? `${machine.name} · ${machine.customerName}` : machine.name

// Operations › Machine Health: one machine's sensors (`?machineId=`, set by the All Machines Health
// link; the first machine otherwise). KPI tiles, a spindle-load speedometer, a trend per sensor and
// summary charts. Readings are SAMPLE data (healthSampleData.js) until the server has a sensor API.
function MachineHealth() {
  const { hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)
  const [searchParams, setSearchParams] = useSearchParams()
  const machineId = searchParams.get('machineId')

  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

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

  const sample = useMemo(() => (selectedId == null ? null : buildHealthSample(selectedId)), [selectedId])

  const kpis = useMemo(() => {
    if (!sample) return []
    return [
      ...TREND_SENSORS.map((sensor) => {
        const points = sample.series[sensor.key]
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
      { key: 'runHours', label: 'Today’s Spindle Run Hours', icon: 'bi-clock-history', value: formatHours(sample.runHoursToday) },
      {
        key: 'spindleLoad',
        label: SPINDLE_LOAD.label,
        icon: 'bi-speedometer2',
        value: formatValue(sample.spindleLoad, 1),
        unit: SPINDLE_LOAD.unit,
        status: statusOf(sample.spindleLoad, SPINDLE_LOAD),
      },
    ]
  }, [sample])

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
            <ChartCard title="Spindle Load" subtitle="Speedometer · now" icon="bi-speedometer2">
              <Speedometer
                value={sample.spindleLoad}
                min={SPINDLE_LOAD.min}
                max={SPINDLE_LOAD.max}
                warning={SPINDLE_LOAD.warning}
                critical={SPINDLE_LOAD.critical}
                unit={SPINDLE_LOAD.unit}
                label={SPINDLE_LOAD.label}
              >
                <div className="ts-number ts-number-md font-tabular mt-2">
                  {formatValue(sample.spindleLoad, 1)}
                  <small>{SPINDLE_LOAD.unit}</small>
                </div>
                <div className="mt-2">
                  <HealthStatusBadge status={statusOf(sample.spindleLoad, SPINDLE_LOAD)} />
                </div>
              </Speedometer>
            </ChartCard>
          </Col>
          <Col>
            <ChartCard title="Machine Time Today" subtitle="Donut · hours per state" icon="bi-pie-chart">
              <MachineTimeDonut data={sample.stateShare} />
            </ChartCard>
          </Col>
          <Col>
            <ChartCard title="Subsystem Health" subtitle="Radar · score out of 100" icon="bi-bullseye">
              <SubsystemRadarChart data={sample.subsystems} />
            </ChartCard>
          </Col>
        </Row>

        <Row xs={1} xxl={2} className="g-3 mb-3">
          {TREND_SENSORS.map((sensor) => (
            <Col key={sensor.key}>
              <SensorTrendCard sensor={sensor} points={sample.series[sensor.key]} />
            </Col>
          ))}
        </Row>

        <Row xs={1} xl={2} className="g-3 mb-3">
          <Col>
            <ChartCard title="Temperatures by Hour" subtitle="Grouped bar · four sensors at each hour" icon="bi-bar-chart">
              <TemperatureGroupChart data={sample.hourly} />
            </ChartCard>
          </Col>
          <Col>
            <ChartCard title="Machine Time by Day" subtitle="Stacked bar · 24 h per day" icon="bi-bar-chart-steps">
              <MachineTimeChart data={sample.daily} />
            </ChartCard>
          </Col>
        </Row>

        <Row xs={1} xl={2} className="g-3">
          <Col>
            <ChartCard title="Spindle Run Hours Growth" subtitle="Area · running total, last 14 days" icon="bi-graph-up-arrow">
              <RunHourGrowthChart data={sample.daily} />
            </ChartCard>
          </Col>
          <Col>
            <ChartCard title="Daily Spindle Run Hours" subtitle="Bar + line · with 7-day average" icon="bi-graph-up">
              <RunHourDailyChart data={sample.daily} />
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
