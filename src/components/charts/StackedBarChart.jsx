import { memo } from 'react'
import { Bar, BarChart } from 'recharts'
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
  ANIMATION_MS,
  BAR_CATEGORY_GAP,
  BAR_MAX_SIZE,
  BAR_RADIUS,
  CHART_MARGIN,
  MUTED_OPACITY,
  SEGMENT_GAP,
} from './chartTheme'

// Series stacked into one bar per x (first series at the bottom), e.g. a day's hours per machine
// state. Segments are split by a 2px gap; only the top one is rounded; `muted` series recede.
function StackedBarChart({
  data,
  series,
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
  const last = series.length - 1
  return (
    <ChartFrame empty={!data.length} emptyText={emptyText}>
      <BarChart data={data} margin={CHART_MARGIN} barCategoryGap={BAR_CATEGORY_GAP}>
        {renderGrid()}
        {renderXAxis({ xKey, tickFormatter: xTickFormatter })}
        {renderYAxis({ unit: yUnit, domain: yDomain, ticks: yTicks, tickFormatter: yTickFormatter })}
        {renderTooltip({ valueFormatter, labelFormatter })}
        {renderLegend()}
        {series.map((item, index) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            name={item.label}
            stackId="stack"
            fill={seriesColor(item, index)}
            fillOpacity={item.muted ? MUTED_OPACITY : 1}
            {...SEGMENT_GAP}
            radius={index === last ? BAR_RADIUS : 0}
            maxBarSize={BAR_MAX_SIZE}
            animationDuration={ANIMATION_MS}
          />
        ))}
      </BarChart>
    </ChartFrame>
  )
}

StackedBarChart.propTypes = {
  ...axisPropTypes,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  series: PropTypes.arrayOf(seriesShape).isRequired,
}

export default memo(StackedBarChart)
