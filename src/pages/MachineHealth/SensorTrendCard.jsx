import { memo, useMemo, useState } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import PropTypes from 'prop-types'
import ChartCard from '@/components/charts/ChartCard'
import ChartDateFilter from '@/components/charts/ChartDateFilter'
import LineTrendChart from '@/components/charts/LineTrendChart'
import { niceTicks } from '@/components/charts/chartScale'
import HealthStatusBadge from './HealthStatusBadge'
import { pointsInRange, sensorDay } from './healthSampleData'
import {
  DEFAULT_RANGE,
  HEALTH_DATE_MIN,
  TIME_RANGES,
  formatTimestamp,
  formatValue,
  statusOf,
  tickFormatter,
} from './healthSensors'
import { todayIso } from '@/utils/dateTime'

const Y_HEADROOM = 1.08 // keeps the critical line below the top edge
const Y_FLOOR = 0.9 // starts the axis a little under the lowest reading, so the line is not flattened
const Y_TICKS = 5

// One sensor over time: current reading, time-range buttons, the line over shaded warning / critical
// bands, and a range slider (Brush, with an overview of the line) to zoom into part of the range.
// The date picker chooses the day (today by default); the range buttons look back from its last reading.
function SensorTrendCard({ sensor, machineId }) {
  const today = todayIso()
  const [date, setDate] = useState(today)
  const points = useMemo(() => sensorDay(machineId, sensor.key, date), [machineId, sensor.key, date])
  const [rangeKey, setRangeKey] = useState(DEFAULT_RANGE)
  const range = TIME_RANGES.find((option) => option.key === rangeKey)
  const data = useMemo(() => pointsInRange(points, range.ms), [points, range.ms])
  // Round y ticks from just under the lowest reading to above the critical limit (both limits in view)
  const yTicks = useMemo(() => {
    const values = data.map((point) => point.value)
    const low = Math.min(...values, sensor.warning) * Y_FLOOR
    const high = Math.max(...values, sensor.critical) * Y_HEADROOM
    return niceTicks(Math.max(0, low), high, Y_TICKS)
  }, [data, sensor.warning, sensor.critical])
  const yTop = yTicks[yTicks.length - 1]
  const series = useMemo(() => [{ key: 'value', label: sensor.label }], [sensor.label])

  const current = points.length ? points[points.length - 1].value : null
  const withUnit = (value) => `${formatValue(value, sensor.decimals)} ${sensor.unit}`
  const formatTick = tickFormatter(range.ms)
  const limits = [
    { value: sensor.warning, label: `Warning ${withUnit(sensor.warning)}`, status: 'warning', bandTo: sensor.critical },
    { value: sensor.critical, label: `Critical ${withUnit(sensor.critical)}`, status: 'critical', bandTo: yTop },
  ]

  return (
    <ChartCard
      title={sensor.label}
      icon={sensor.icon}
      actions={
        <>
          <ChartDateFilter value={date} onChange={setDate} min={HEALTH_DATE_MIN} max={today} label={`${sensor.label} date`} />
          {current != null && <HealthStatusBadge status={statusOf(current, sensor)} />}
        </>
      }
    >
      <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
        <div className={`ts-chart-reading${current == null ? ' invisible' : ''}`}>
          <div className="ts-number ts-number-sm font-tabular">
            {current == null ? '—' : formatValue(current, sensor.decimals)}
            <small>{sensor.unit}</small>
          </div>
          <div className="ts-chart-reading-meta">
            <span>{date === today ? 'Current reading' : 'Last reading of the day'}</span>
            <span className="ts-chart-limit is-warning">Warning {withUnit(sensor.warning)}</span>
            <span className="ts-chart-limit is-critical">Critical {withUnit(sensor.critical)}</span>
          </div>
        </div>
        <div className="ts-chart-range ms-md-auto">
          <ButtonGroup size="sm" aria-label={`${sensor.label} time range`}>
            {TIME_RANGES.map((option) => (
              <Button
                key={option.key}
                variant="ghost"
                active={option.key === rangeKey}
                aria-pressed={option.key === rangeKey}
                onClick={() => setRangeKey(option.key)}
              >
                {option.label}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </div>

      <LineTrendChart
        size="lg"
        data={data}
        series={series}
        xType="time"
        xTickFormatter={formatTick}
        yDomain={[yTicks[0], yTop]}
        yTicks={yTicks}
        valueFormatter={withUnit}
        labelFormatter={formatTimestamp}
        limits={limits}
        brush
        brushKey={rangeKey}
        emptyText="No readings in this range."
      />
    </ChartCard>
  )
}

SensorTrendCard.propTypes = {
  sensor: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    decimals: PropTypes.number.isRequired,
    warning: PropTypes.number.isRequired,
    critical: PropTypes.number.isRequired,
  }).isRequired,
  machineId: PropTypes.number.isRequired,
}

export default memo(SensorTrendCard)
