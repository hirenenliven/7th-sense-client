import { memo } from 'react'
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts'
import PropTypes from 'prop-types'
import ChartFrame from './ChartFrame'
import { renderLegend, renderTooltip, seriesColor, seriesShape } from './chartParts'
import { ACTIVE_DOT, ANIMATION_MS, CHART_MARGIN, LINE_WIDTH, POINT_DOT } from './chartTheme'

const OUTER_RADIUS = '72%'
const FILL_OPACITY = 0.18

// Scores of several aspects on one scale (e.g. subsystem health 0–100): one axis per row of `data`
// (`angleKey` names it), one shape per series; a legend for two or more series.
function RadarScoreChart({ data, series, angleKey = 'name', domain = [0, 100], valueFormatter, emptyText }) {
  return (
    <ChartFrame empty={!data.length} emptyText={emptyText}>
      <RadarChart data={data} margin={CHART_MARGIN} outerRadius={OUTER_RADIUS}>
        <PolarGrid gridType="polygon" />
        <PolarAngleAxis dataKey={angleKey} />
        <PolarRadiusAxis domain={domain} tick={false} axisLine={false} />
        {renderTooltip({ valueFormatter })}
        {series.length > 1 && renderLegend()}
        {series.map((item, index) => {
          const color = seriesColor(item, index)
          return (
            <Radar
              key={item.key}
              dataKey={item.key}
              name={item.label}
              stroke={color}
              strokeWidth={LINE_WIDTH}
              fill={color}
              fillOpacity={FILL_OPACITY}
              dot={{ ...POINT_DOT, fill: color }}
              activeDot={ACTIVE_DOT}
              animationDuration={ANIMATION_MS}
            />
          )
        })}
      </RadarChart>
    </ChartFrame>
  )
}

RadarScoreChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  series: PropTypes.arrayOf(seriesShape).isRequired,
  angleKey: PropTypes.string,
  domain: PropTypes.arrayOf(PropTypes.number),
  valueFormatter: PropTypes.func,
  emptyText: PropTypes.string,
}

export default memo(RadarScoreChart)
