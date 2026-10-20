import { CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import PropTypes from 'prop-types'
import ChartTooltip from './ChartTooltip'
import { LEGEND_PROPS } from './chartLegend'
import { GRID_PROPS, SERIES_COLORS, X_AXIS_PROPS, Y_AXIS_PROPS } from './chartTheme'

// Building blocks the chart components share. They are plain functions returning Recharts elements
// (called inside a chart, never rendered as components), so every chart gets the same axes, grid,
// tooltip and legend.

export const renderGrid = () => <CartesianGrid {...GRID_PROPS} />

// type "time": `xKey` holds timestamps (ms) on a time scale; otherwise categories (labels)
export const renderXAxis = ({ xKey, type = 'category', tickFormatter }) =>
  type === 'time' ? (
    <XAxis
      {...X_AXIS_PROPS}
      dataKey={xKey}
      type="number"
      scale="time"
      domain={['dataMin', 'dataMax']}
      tickFormatter={tickFormatter}
    />
  ) : (
    <XAxis {...X_AXIS_PROPS} dataKey={xKey} tickFormatter={tickFormatter} />
  )

export const renderYAxis = ({ unit, domain, ticks, tickFormatter }) => (
  <YAxis {...Y_AXIS_PROPS} unit={unit} domain={domain} ticks={ticks} tickFormatter={tickFormatter} />
)

export const renderTooltip = ({ valueFormatter, labelFormatter } = {}) => (
  <Tooltip
    isAnimationActive={false}
    content={<ChartTooltip valueFormatter={valueFormatter} labelFormatter={labelFormatter} />}
  />
)

export const renderLegend = (props) => <Legend {...LEGEND_PROPS} {...props} />

// Series colour: its own `color`, else the categorical colour of its position (fixed order, never
// cycled: a 5th series needs its own `color` or another chart)
export const seriesColor = (series, index) => series.color ?? SERIES_COLORS[index]

// PropTypes shared by the chart components
export const seriesShape = PropTypes.shape({
  key: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string, // CSS colour, e.g. a chartTheme SERIES_COLORS / STATUS_COLORS value
  muted: PropTypes.bool, // drawn faded (e.g. "off" time)
  dashed: PropTypes.bool, // lines only
})

export const axisPropTypes = {
  xKey: PropTypes.string,
  xTickFormatter: PropTypes.func,
  yUnit: PropTypes.string,
  yDomain: PropTypes.array,
  yTicks: PropTypes.arrayOf(PropTypes.number),
  yTickFormatter: PropTypes.func,
  valueFormatter: PropTypes.func,
  labelFormatter: PropTypes.func,
  emptyText: PropTypes.string,
}
