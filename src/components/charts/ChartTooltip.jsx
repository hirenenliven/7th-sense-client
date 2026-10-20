import PropTypes from 'prop-types'

// Series dot: an SVG circle, so the colour is a fill attribute (no inline style)
function ChartSwatch({ color }) {
  return (
    <svg className="ts-chart-swatch" viewBox="0 0 10 10" aria-hidden="true">
      <circle cx="5" cy="5" r="5" fill={color} />
    </svg>
  )
}

ChartSwatch.propTypes = { color: PropTypes.string }

// Tooltip body for every chart: <Tooltip content={<ChartTooltip valueFormatter={…} />} />.
// Recharts fills active / payload / label; the formatters shape the title and each value.
function ChartTooltip({ active, payload, label, labelFormatter, valueFormatter }) {
  if (!active || !payload?.length) return null
  const title = labelFormatter ? labelFormatter(label, payload) : label

  return (
    <div className="ts-chart-tooltip">
      {title != null && title !== '' && <div className="ts-chart-tooltip-title">{title}</div>}
      {payload.map((entry) => (
        <div key={entry.dataKey ?? entry.name} className="ts-chart-tooltip-row">
          <ChartSwatch color={entry.color ?? entry.payload?.fill} />
          <span className="ts-chart-tooltip-name">{entry.name}</span>
          <span className="ts-chart-tooltip-value font-tabular">
            {valueFormatter ? valueFormatter(entry.value, entry) : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

ChartTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  labelFormatter: PropTypes.func,
  valueFormatter: PropTypes.func,
}

export default ChartTooltip
