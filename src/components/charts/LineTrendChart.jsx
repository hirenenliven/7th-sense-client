import { memo } from 'react'
import { Brush, Line, LineChart, ReferenceArea, ReferenceLine, YAxis } from 'recharts'
import PropTypes from 'prop-types'
import ChartFrame from './ChartFrame'
import { axisPropTypes, renderGrid, renderLegend, renderTooltip, renderXAxis, renderYAxis, seriesColor, seriesShape } from './chartParts'
import { ACTIVE_DOT, ANIMATION_MS, BAND_OPACITY, CHART_MARGIN, LINE_WIDTH, STATUS_COLORS } from './chartTheme'

const BRUSH_HEIGHT = 36
const BRUSH_TRAVELLER = 10
const BRUSH_MARGIN = { top: 4, right: 0, bottom: 4, left: 0 }
const LIMIT_DASH = '4 4'

// Line chart of one or more series over x (a time scale with xType "time"). Optional:
// - limits: dashed lines at warning / critical values, each shading a band up to `bandTo`;
// - brush: a range slider with an overview of the first series (zoom into part of the range);
//   `brushKey` resets it (e.g. when the time range changes).
// A legend is shown for two or more series.
function LineTrendChart({
  data,
  series,
  xKey = 'time',
  xType = 'category',
  xTickFormatter,
  yUnit,
  yDomain,
  yTicks,
  yTickFormatter,
  valueFormatter,
  labelFormatter,
  limits = [],
  brush = false,
  brushKey,
  size,
  emptyText,
}) {
  const [first] = series
  return (
    <ChartFrame size={size} empty={!data.length} emptyText={emptyText}>
      <LineChart data={data} margin={CHART_MARGIN}>
        {renderGrid()}
        {renderXAxis({ xKey, type: xType, tickFormatter: xTickFormatter })}
        {renderYAxis({ unit: yUnit, domain: yDomain, ticks: yTicks, tickFormatter: yTickFormatter })}
        {limits.map((limit) =>
          limit.bandTo == null ? null : (
            <ReferenceArea
              key={`band-${limit.value}`}
              y1={limit.value}
              y2={limit.bandTo}
              fill={STATUS_COLORS[limit.status]}
              fillOpacity={BAND_OPACITY}
              stroke="none"
            />
          ),
        )}
        {limits.map((limit) => (
          <ReferenceLine
            key={`line-${limit.value}`}
            y={limit.value}
            stroke={STATUS_COLORS[limit.status]}
            strokeDasharray={LIMIT_DASH}
            label={{ value: limit.label, position: 'insideBottomLeft', className: 'ts-chart-ref-label' }}
          />
        ))}
        {renderTooltip({ valueFormatter, labelFormatter })}
        {series.length > 1 && renderLegend()}
        {series.map((item, index) => (
          <Line
            key={item.key}
            type="monotone"
            dataKey={item.key}
            name={item.label}
            stroke={seriesColor(item, index)}
            strokeWidth={LINE_WIDTH}
            strokeDasharray={item.dashed ? LIMIT_DASH : undefined}
            dot={false}
            activeDot={ACTIVE_DOT}
            animationDuration={ANIMATION_MS}
          />
        ))}
        {brush && (
          <Brush
            key={brushKey}
            dataKey={xKey}
            height={BRUSH_HEIGHT}
            travellerWidth={BRUSH_TRAVELLER}
            tickFormatter={xTickFormatter}
          >
            <LineChart data={data} margin={BRUSH_MARGIN}>
              {/* Own axis id: the overview must not take over the main chart's y axis */}
              <YAxis yAxisId="overview" hide domain={['dataMin', 'dataMax']} />
              <Line
                yAxisId="overview"
                type="monotone"
                dataKey={first.key}
                stroke={seriesColor(first, 0)}
                strokeWidth={1}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </Brush>
        )}
      </LineChart>
    </ChartFrame>
  )
}

LineTrendChart.propTypes = {
  ...axisPropTypes,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  series: PropTypes.arrayOf(seriesShape).isRequired,
  xType: PropTypes.oneOf(['category', 'time']),
  limits: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['good', 'warning', 'critical']).isRequired,
      bandTo: PropTypes.number,
    }),
  ),
  brush: PropTypes.bool,
  brushKey: PropTypes.string,
  size: PropTypes.oneOf(['lg']),
}

export default memo(LineTrendChart)
