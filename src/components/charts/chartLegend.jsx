// Legend label in the text colour; Recharts paints it in the series colour by default and the
// swatch beside it already carries that.
const legendText = (value) => <span className="ts-chart-legend-text">{value}</span>

// <Legend {...LEGEND_PROPS} />
export const LEGEND_PROPS = { iconType: 'circle', iconSize: 8, formatter: legendText }
