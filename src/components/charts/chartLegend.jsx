// Legend label in the text colour; Recharts paints it in the series colour by default and the
// swatch beside it already carries that.
const legendText = (value) => <span className="ts-chart-legend-text">{value}</span>

// <Legend {...LEGEND_PROPS} />: top right, in series order (Recharts sorts by name by default)
export const LEGEND_PROPS = {
  iconType: 'circle',
  iconSize: 8,
  itemSorter: null,
  verticalAlign: 'top',
  align: 'right',
  formatter: legendText,
}

// Under a round chart (donut), centred; `formatter` may add each item's value
export const LEGEND_BOTTOM_PROPS = { ...LEGEND_PROPS, verticalAlign: 'bottom', align: 'center' }
