import { memo } from 'react'
import { Cell, Label, Pie, PieChart } from 'recharts'
import PropTypes from 'prop-types'
import ChartFrame from './ChartFrame'
import { LEGEND_BOTTOM_PROPS } from './chartLegend'
import { renderLegend, renderTooltip, seriesColor } from './chartParts'
import { ANIMATION_MS, CHART_MARGIN, MUTED_OPACITY, SEGMENT_GAP } from './chartTheme'

const RADIUS = { inner: '62%', outer: '84%' }
const CORNER = 4
const PADDING_ANGLE = 1

// Headline in the hole. Recharts gives the label a polar box (cx, cy) or a plain one (x, y, size).
function DonutCentre({ viewBox, value, caption }) {
  const cx = viewBox.cx ?? viewBox.x + viewBox.width / 2
  const cy = viewBox.cy ?? viewBox.y + viewBox.height / 2
  return (
    <text x={cx} y={cy} textAnchor="middle">
      <tspan className="ts-chart-center-value" x={cx} dy="0.1em">
        {value}
      </tspan>
      {caption && (
        <tspan className="ts-chart-center-caption" x={cx} dy="1.6em">
          {caption}
        </tspan>
      )}
    </text>
  )
}

DonutCentre.propTypes = {
  viewBox: PropTypes.object.isRequired,
  value: PropTypes.node.isRequired,
  caption: PropTypes.string,
}

// Parts of a whole, clockwise from the top: items [{ key, label, value, color?, muted? }].
// Optional `centre` { value, caption } in the hole; the legend lists each part with its value
// (`valueFormatter`) unless legendValues is false; `legend={false}` drops it (the page lists the
// parts itself). `minAngle` (degrees) keeps a tiny part visible.
function DonutChart({ data, centre, valueFormatter = String, legend = true, legendValues = true, minAngle = 0, emptyText }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const legendFormatter = (name, entry) => (
    <span className="ts-chart-legend-text">
      {name}
      {legendValues && (
        <span className="font-tabular text-body-secondary"> {valueFormatter(entry.payload.value)}</span>
      )}
    </span>
  )

  return (
    <ChartFrame empty={!total} emptyText={emptyText}>
      <PieChart margin={CHART_MARGIN}>
        {renderTooltip({ valueFormatter })}
        {legend && renderLegend({ ...LEGEND_BOTTOM_PROPS, formatter: legendFormatter })}
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          startAngle={90}
          endAngle={-270}
          innerRadius={RADIUS.inner}
          outerRadius={RADIUS.outer}
          cornerRadius={CORNER}
          paddingAngle={PADDING_ANGLE}
          minAngle={minAngle}
          {...SEGMENT_GAP}
          animationDuration={ANIMATION_MS}
        >
          {data.map((item, index) => (
            <Cell key={item.key} fill={seriesColor(item, index)} fillOpacity={item.muted ? MUTED_OPACITY : 1} />
          ))}
          {centre && (
            <Label
              position="center"
              content={({ viewBox }) => <DonutCentre viewBox={viewBox} value={centre.value} caption={centre.caption} />}
            />
          )}
        </Pie>
      </PieChart>
    </ChartFrame>
  )
}

DonutChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string,
      muted: PropTypes.bool,
    }),
  ).isRequired,
  centre: PropTypes.shape({ value: PropTypes.node.isRequired, caption: PropTypes.string }),
  valueFormatter: PropTypes.func,
  legend: PropTypes.bool,
  legendValues: PropTypes.bool,
  minAngle: PropTypes.number,
  emptyText: PropTypes.string,
}

export default memo(DonutChart)
