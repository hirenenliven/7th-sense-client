import { memo, useId } from 'react'
import { Area, AreaChart } from 'recharts'
import PropTypes from 'prop-types'
import ChartFrame from './ChartFrame'
import { axisPropTypes, renderGrid, renderTooltip, renderXAxis, renderYAxis, seriesColor, seriesShape } from './chartParts'
import { ACTIVE_DOT, ANIMATION_MS, AREA_OPACITY, CHART_MARGIN, LINE_WIDTH } from './chartTheme'

// Growth / trend of one series: a line with a fill fading towards the baseline
function AreaGrowthChart({
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
  // useId may contain characters a url(#…) reference does not accept
  const gradientId = `area-${useId().replace(/[^\w-]/g, '')}`
  const color = seriesColor(series, 0)

  return (
    <ChartFrame empty={!data.length} emptyText={emptyText}>
      <AreaChart data={data} margin={CHART_MARGIN}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={AREA_OPACITY.top} />
            <stop offset="100%" stopColor={color} stopOpacity={AREA_OPACITY.bottom} />
          </linearGradient>
        </defs>
        {renderGrid()}
        {renderXAxis({ xKey, tickFormatter: xTickFormatter })}
        {renderYAxis({ unit: yUnit, domain: yDomain, ticks: yTicks, tickFormatter: yTickFormatter })}
        {renderTooltip({ valueFormatter, labelFormatter })}
        <Area
          type="monotone"
          dataKey={series.key}
          name={series.label}
          stroke={color}
          strokeWidth={LINE_WIDTH}
          fill={`url(#${gradientId})`}
          activeDot={ACTIVE_DOT}
          animationDuration={ANIMATION_MS}
        />
      </AreaChart>
    </ChartFrame>
  )
}

AreaGrowthChart.propTypes = {
  ...axisPropTypes,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  series: seriesShape.isRequired,
}

export default memo(AreaGrowthChart)
