// Settings every Recharts chart shares. Colours are the theme's CSS variables (--ts-*), so charts
// follow dark / light without re-rendering; axis, grid, legend and tooltip styles are `.ts-chart`
// in _components.scss.

// Categorical series in this fixed order (never cycled): a 5th series needs a new chart, not a colour
export const SERIES_COLORS = ['var(--ts-chart-1)', 'var(--ts-chart-2)', 'var(--ts-chart-3)', 'var(--ts-chart-4)']

// States (good / warning / critical, machine running / idle / alarm / off) — never used as series colours
export const STATUS_COLORS = {
  good: 'var(--ts-good)',
  warning: 'var(--ts-amber)',
  critical: 'var(--ts-red)',
  neutral: 'var(--ts-neutral)',
}

export const SURFACE_COLOR = 'var(--ts-panel)'

export const CHART_MARGIN = { top: 8, right: 8, bottom: 0, left: 0 }

export const X_AXIS_PROPS = { tickLine: false, tickMargin: 8, minTickGap: 24 }
export const Y_AXIS_PROPS = { axisLine: false, tickLine: false, tickMargin: 4, width: 44 }
export const GRID_PROPS = { vertical: false, strokeDasharray: '3 3' }

export const LINE_WIDTH = 2
export const ACTIVE_DOT = { r: 4, strokeWidth: 2 }
// Rounded data end, square at the baseline; 2px gap between the bars of a group
export const BAR_RADIUS = [4, 4, 0, 0]
export const BAR_GAP = 2
export const BAR_MAX_SIZE = 28
// 2px panel-coloured outline between stacked segments / pie slices
export const SEGMENT_GAP = { stroke: SURFACE_COLOR, strokeWidth: 2 }

export const ANIMATION_MS = 500
