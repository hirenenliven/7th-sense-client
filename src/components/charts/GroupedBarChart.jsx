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
import { ANIMATION_MS, BAR_CATEGORY_GAP, BAR_GAP, BAR_MAX_SIZE, BAR_RADIUS, CHART_MARGIN } from './chartTheme'

// Bars side by side: every series' value at each x (e.g. four sensors at each hour). One series is a
// plain bar chart (no legend). `legendValues` ({ [series key]: text }) adds a value to each legend
// item, e.g. the series' total over the range.
function GroupedBarChart({
  data,
  series,
  legendValues,
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
  const legendFormatter = (name, entry) => (
    <span className="ts-chart-legend-text">
      {name}
      {legendValues?.[entry.dataKey] != null && (
        <span className="font-tabular text-body-secondary"> {legendValues[entry.dataKey]}</span>
      )}
    </span>
  )

  return (
    <ChartFrame empty={!data.length} emptyText={emptyText}>
      <BarChart data={data} margin={CHART_MARGIN} barGap={BAR_GAP} barCategoryGap={BAR_CATEGORY_GAP}>
        {renderGrid()}
        {renderXAxis({ xKey, tickFormatter: xTickFormatter })}
        {renderYAxis({ unit: yUnit, domain: yDomain, ticks: yTicks, tickFormatter: yTickFormatter })}
        {renderTooltip({ valueFormatter, labelFormatter })}
        {series.length > 1 && renderLegend(legendValues ? { formatter: legendFormatter } : undefined)}
        {series.map((item, index) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            name={item.label}
            fill={seriesColor(item, index)}
            radius={BAR_RADIUS}
            maxBarSize={BAR_MAX_SIZE}
            animationDuration={ANIMATION_MS}
          />
        ))}
      </BarChart>
    </ChartFrame>
  )
}

GroupedBarChart.propTypes = {
  ...axisPropTypes,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  series: PropTypes.arrayOf(seriesShape).isRequired,
  legendValues: PropTypes.objectOf(PropTypes.string),
}

export default memo(GroupedBarChart)
