import { memo } from 'react'
import { Bar, ComposedChart, Line } from 'recharts'
import PropTypes from 'prop-types'
import ChartFrame from './ChartFrame'
import {
  axisPropTypes,
  renderGrid,
  renderLegend,
  renderTooltip,
  renderXAxis,
  renderYAxis,
  seriesColor,
  seriesShape,
} from './chartParts'
import {
  ACTIVE_DOT,
  ANIMATION_MS,
  BAR_CATEGORY_GAP,
  BAR_GAP,
  BAR_MAX_SIZE,
  BAR_RADIUS,
  CHART_MARGIN,
  LINE_WIDTH,
  SEGMENT_GAP,
} from './chartTheme'

const LINE_DASH = '5 4'

// Bars with lines over them on ONE y axis (same unit), e.g. daily values and their moving average.
// Colours run through bars then lines in order; a `dashed` line reads as a reference (average, target).
// `stacked`: the bars stack into one per x (parts of the line's total, e.g. a cycle's feed / rapid time).
function BarLineChart({
  data,
  bars,
  lines,
  stacked = false,
  xKey = 'label',
  xTickFormatter,
  yUnit,
  yDomain,
  yTicks,
  yTickFormatter,
  valueFormatter,
  labelFormatter,
  emptyText,
}) {
  return (
    <ChartFrame empty={!data.length} emptyText={emptyText}>
      <ComposedChart data={data} margin={CHART_MARGIN} barGap={BAR_GAP} barCategoryGap={BAR_CATEGORY_GAP}>
        {renderGrid()}
        {renderXAxis({ xKey, tickFormatter: xTickFormatter })}
        {renderYAxis({ unit: yUnit, domain: yDomain, ticks: yTicks, tickFormatter: yTickFormatter })}
        {renderTooltip({ valueFormatter, labelFormatter })}
        {renderLegend()}
        {bars.map((item, index) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            name={item.label}
            fill={seriesColor(item, index)}
            {...(stacked ? { stackId: 'stack', ...SEGMENT_GAP } : {})}
            radius={!stacked || index === bars.length - 1 ? BAR_RADIUS : 0}
            maxBarSize={BAR_MAX_SIZE}
            animationDuration={ANIMATION_MS}
          />
        ))}
        {lines.map((item, index) => (
          <Line
            key={item.key}
            type="monotone"
            dataKey={item.key}
            name={item.label}
            stroke={seriesColor(item, bars.length + index)}
            strokeWidth={LINE_WIDTH}
            strokeDasharray={item.dashed ? LINE_DASH : undefined}
            dot={false}
            activeDot={ACTIVE_DOT}
            animationDuration={ANIMATION_MS}
          />
        ))}
      </ComposedChart>
    </ChartFrame>
  )
}

BarLineChart.propTypes = {
  ...axisPropTypes,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  bars: PropTypes.arrayOf(seriesShape).isRequired,
  lines: PropTypes.arrayOf(seriesShape).isRequired,
  stacked: PropTypes.bool,
}

export default memo(BarLineChart)
