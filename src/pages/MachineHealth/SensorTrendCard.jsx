import { memo, useMemo, useState } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import { Brush, CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import PropTypes from 'prop-types'
import ChartCard from '@/components/charts/ChartCard'
import ChartTooltip from '@/components/charts/ChartTooltip'
import {
  ACTIVE_DOT,
  ANIMATION_MS,
  CHART_MARGIN,
  GRID_PROPS,
  LINE_WIDTH,
  SERIES_COLORS,
  STATUS_COLORS,
  X_AXIS_PROPS,
  Y_AXIS_PROPS,
} from '@/components/charts/chartTheme'
import HealthStatusBadge from './HealthStatusBadge'
import { pointsInRange } from './healthSampleData'
import { DEFAULT_RANGE, TIME_RANGES, formatTimestamp, formatValue, statusOf, tickFormatter } from './healthSensors'

const BRUSH_HEIGHT = 24
const BRUSH_TRAVELLER = 8
const Y_HEADROOM = 1.15 // keeps the critical line below the top edge
const LIMIT_DASH = '4 4'

// One sensor over time: current reading, time-range buttons, the line with its warning / critical
// limits, and a range slider (Brush) to zoom into part of the range.
function SensorTrendCard({ sensor, points }) {
  const [rangeKey, setRangeKey] = useState(DEFAULT_RANGE)
  const range = TIME_RANGES.find((option) => option.key === rangeKey)
  const data = useMemo(() => pointsInRange(points, range.ms), [points, range.ms])

  const current = points[points.length - 1].value
  const withUnit = (value) => `${formatValue(value, sensor.decimals)} ${sensor.unit}`
  const formatTick = tickFormatter(range.ms)
  const limitLabel = (name, value) => ({
    value: `${name} ${withUnit(value)}`,
    position: 'insideTopRight',
    className: 'ts-chart-ref-label',
  })

  return (
    <ChartCard title={sensor.label} icon={sensor.icon} actions={<HealthStatusBadge status={statusOf(current, sensor)} />}>
      <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
        <div className="card-inset px-3 py-2">
          <div className="ts-number ts-number-sm font-tabular">
            {formatValue(current, sensor.decimals)}
            <small>{sensor.unit}</small>
          </div>
          <div className="small text-body-secondary">Current reading</div>
        </div>
        <ButtonGroup size="sm" className="ms-auto flex-wrap" aria-label={`${sensor.label} time range`}>
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

      <div className="ts-chart ts-chart-lg">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={CHART_MARGIN}>
            <CartesianGrid {...GRID_PROPS} />
            <XAxis
              {...X_AXIS_PROPS}
              dataKey="time"
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              tickFormatter={formatTick}
            />
            <YAxis {...Y_AXIS_PROPS} domain={[0, (max) => Math.ceil(Math.max(max, sensor.critical) * Y_HEADROOM)]} />
            <Tooltip
              isAnimationActive={false}
              content={<ChartTooltip labelFormatter={formatTimestamp} valueFormatter={withUnit} />}
            />
            <ReferenceLine
              y={sensor.warning}
              stroke={STATUS_COLORS.warning}
              strokeDasharray={LIMIT_DASH}
              label={limitLabel('Warning', sensor.warning)}
            />
            <ReferenceLine
              y={sensor.critical}
              stroke={STATUS_COLORS.critical}
              strokeDasharray={LIMIT_DASH}
              label={limitLabel('Critical', sensor.critical)}
            />
            <Line
              type="monotone"
              dataKey="value"
              name={sensor.label}
              stroke={SERIES_COLORS[0]}
              strokeWidth={LINE_WIDTH}
              dot={false}
              activeDot={ACTIVE_DOT}
              animationDuration={ANIMATION_MS}
            />
            <Brush
              key={rangeKey}
              dataKey="time"
              height={BRUSH_HEIGHT}
              travellerWidth={BRUSH_TRAVELLER}
              tickFormatter={formatTick}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
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
  points: PropTypes.arrayOf(PropTypes.shape({ time: PropTypes.number, value: PropTypes.number })).isRequired,
}

export default memo(SensorTrendCard)
