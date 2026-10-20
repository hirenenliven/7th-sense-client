import { memo, useId } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Label,
  Legend,
  Line,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import PropTypes from 'prop-types'
import ChartTooltip from '@/components/charts/ChartTooltip'
import { LEGEND_PROPS } from '@/components/charts/chartLegend'
import {
  ACTIVE_DOT,
  ANIMATION_MS,
  BAR_GAP,
  BAR_MAX_SIZE,
  BAR_RADIUS,
  CHART_MARGIN,
  GRID_PROPS,
  LINE_WIDTH,
  SEGMENT_GAP,
  SERIES_COLORS,
  STATUS_COLORS,
  X_AXIS_PROPS,
  Y_AXIS_PROPS,
} from '@/components/charts/chartTheme'
import { MACHINE_STATES, TEMPERATURE_GROUP, formatHours, formatValue } from './healthSensors'

// The Machine Health example charts other than the sensor trends (SensorTrendCard). Each renders
// into a `.ts-chart` box; the page puts it in a ChartCard.

const DAY_HOURS = [0, 6, 12, 18, 24]
const AREA_OPACITY = { top: 0.35, bottom: 0 }
const RADAR_FILL_OPACITY = 0.2
const DONUT_RADIUS = { inner: '58%', outer: '82%' }
const DONUT_CORNER = 4

const celsius = (value) => `${formatValue(value, 1)} °C`
const tooltip = (props) => <Tooltip isAnimationActive={false} content={<ChartTooltip {...props} />} />

// Grouped bars: four temperatures side by side at each hour
export const TemperatureGroupChart = memo(function TemperatureGroupChart({ data }) {
  return (
    <div className="ts-chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={CHART_MARGIN} barGap={BAR_GAP}>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis {...X_AXIS_PROPS} dataKey="label" />
          <YAxis {...Y_AXIS_PROPS} unit="°" />
          {tooltip({ valueFormatter: celsius })}
          <Legend {...LEGEND_PROPS} />
          {TEMPERATURE_GROUP.map((series, index) => (
            <Bar
              key={series.key}
              dataKey={series.key}
              name={series.label}
              fill={SERIES_COLORS[index]}
              radius={BAR_RADIUS}
              maxBarSize={BAR_MAX_SIZE}
              animationDuration={ANIMATION_MS}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
})

// Stacked bars: each day's 24 h split into running / idle / alarm / off
export const MachineTimeChart = memo(function MachineTimeChart({ data }) {
  const last = MACHINE_STATES.length - 1
  return (
    <div className="ts-chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={CHART_MARGIN}>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis {...X_AXIS_PROPS} dataKey="label" />
          <YAxis {...Y_AXIS_PROPS} domain={[0, 24]} ticks={DAY_HOURS} unit="h" />
          {tooltip({ valueFormatter: formatHours })}
          <Legend {...LEGEND_PROPS} />
          {MACHINE_STATES.map((state, index) => (
            <Bar
              key={state.key}
              dataKey={state.key}
              name={state.label}
              stackId="day"
              fill={STATUS_COLORS[state.color]}
              {...SEGMENT_GAP}
              radius={index === last ? BAR_RADIUS : 0}
              maxBarSize={BAR_MAX_SIZE}
              animationDuration={ANIMATION_MS}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
})

// Growth: running total of spindle run hours (area with a fading fill)
export const RunHourGrowthChart = memo(function RunHourGrowthChart({ data }) {
  // useId may contain characters a url(#…) reference does not accept
  const gradientId = `growth-${useId().replace(/[^\w-]/g, '')}`
  return (
    <div className="ts-chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={CHART_MARGIN}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SERIES_COLORS[0]} stopOpacity={AREA_OPACITY.top} />
              <stop offset="100%" stopColor={SERIES_COLORS[0]} stopOpacity={AREA_OPACITY.bottom} />
            </linearGradient>
          </defs>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis {...X_AXIS_PROPS} dataKey="label" />
          <YAxis {...Y_AXIS_PROPS} unit="h" />
          {tooltip({ valueFormatter: formatHours })}
          <Area
            type="monotone"
            dataKey="cumulative"
            name="Total run hours"
            stroke={SERIES_COLORS[0]}
            strokeWidth={LINE_WIDTH}
            fill={`url(#${gradientId})`}
            activeDot={ACTIVE_DOT}
            animationDuration={ANIMATION_MS}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
})

// Bars + line on one axis (both hours): each day's run hours and their 7-day average
export const RunHourDailyChart = memo(function RunHourDailyChart({ data }) {
  return (
    <div className="ts-chart">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={CHART_MARGIN}>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis {...X_AXIS_PROPS} dataKey="label" />
          <YAxis {...Y_AXIS_PROPS} domain={[0, 24]} ticks={DAY_HOURS} unit="h" />
          {tooltip({ valueFormatter: formatHours })}
          <Legend {...LEGEND_PROPS} />
          <Bar
            dataKey="running"
            name="Run hours"
            fill={SERIES_COLORS[0]}
            radius={BAR_RADIUS}
            maxBarSize={BAR_MAX_SIZE}
            animationDuration={ANIMATION_MS}
          />
          <Line
            type="monotone"
            dataKey="average"
            name="7-day average"
            stroke={SERIES_COLORS[1]}
            strokeWidth={LINE_WIDTH}
            dot={false}
            activeDot={ACTIVE_DOT}
            animationDuration={ANIMATION_MS}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
})

// Donut: today's hours per machine state, running share in the centre
export const MachineTimeDonut = memo(function MachineTimeDonut({ data }) {
  const total = data.reduce((sum, state) => sum + state.hours, 0)
  const running = data.find((state) => state.key === 'running')?.hours ?? 0
  return (
    <div className="ts-chart">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={CHART_MARGIN}>
          {tooltip({ valueFormatter: formatHours })}
          <Legend {...LEGEND_PROPS} />
          <Pie
            data={data}
            dataKey="hours"
            nameKey="label"
            innerRadius={DONUT_RADIUS.inner}
            outerRadius={DONUT_RADIUS.outer}
            cornerRadius={DONUT_CORNER}
            {...SEGMENT_GAP}
            animationDuration={ANIMATION_MS}
          >
            {data.map((state) => (
              <Cell key={state.key} fill={STATUS_COLORS[state.color]} />
            ))}
            <Label
              position="center"
              className="ts-chart-center-label"
              value={`${total ? Math.round((running / total) * 100) : 0}% running`}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
})

// Radar: health score (0–100) of each subsystem
export const SubsystemRadarChart = memo(function SubsystemRadarChart({ data }) {
  return (
    <div className="ts-chart">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={CHART_MARGIN} outerRadius="72%">
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          {tooltip({ valueFormatter: (value) => `${value} / 100` })}
          <Radar
            dataKey="score"
            name="Health score"
            stroke={SERIES_COLORS[0]}
            strokeWidth={LINE_WIDTH}
            fill={SERIES_COLORS[0]}
            fillOpacity={RADAR_FILL_OPACITY}
            activeDot={ACTIVE_DOT}
            animationDuration={ANIMATION_MS}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
})

const rows = PropTypes.arrayOf(PropTypes.object).isRequired
TemperatureGroupChart.propTypes = { data: rows }
MachineTimeChart.propTypes = { data: rows }
RunHourGrowthChart.propTypes = { data: rows }
RunHourDailyChart.propTypes = { data: rows }
MachineTimeDonut.propTypes = { data: rows }
SubsystemRadarChart.propTypes = { data: rows }
