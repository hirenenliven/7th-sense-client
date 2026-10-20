import { memo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import PropTypes from 'prop-types'
import { ANIMATION_MS, SEGMENT_GAP, STATUS_COLORS } from './chartTheme'

// Recharts has no gauge, so the speedometer is a PieChart: a half-circle Pie of the zones (normal /
// warning / critical) and a second, invisible Pie split at the value whose first sector is drawn as
// the needle. Recharts hands that sector the centre, radius and end angle in pixels (animated), so
// the needle sweeps to the value without measuring the chart.

// Width ÷ height of the dial. Pie radii are a % of half the shorter side (the height here), so radii
// above 100% fill the wide box.
const ASPECT = 1.8
const CENTER_Y = '88%'
const ZONE_RADIUS = { inner: '148%', outer: '172%' }
const NEEDLE_RADIUS = '134%'
const NEEDLE_BASE = 0.045 // half the needle's base, as a share of its length
const HUB_SIZE = 1.9 // hub radius, in needle half-bases
const HUB_DOT_SIZE = 0.8
const ZONE_CORNER = 4
const PIE_PROPS = { cx: '50%', cy: CENTER_Y, startAngle: 180, endAngle: 0, dataKey: 'size', legendType: 'none' }

const RADIANS = Math.PI / 180
const polar = (cx, cy, radius, angle) => ({
  x: cx + radius * Math.cos(-angle * RADIANS),
  y: cy + radius * Math.sin(-angle * RADIANS),
})

// Pie `shape` of the value Pie: the first sector (min → value) becomes the needle, the rest is empty
function Needle({ index, cx, cy, outerRadius, endAngle }) {
  if (index !== 0) return null
  const half = outerRadius * NEEDLE_BASE
  const tip = polar(cx, cy, outerRadius, endAngle)
  const left = polar(cx, cy, half, endAngle + 90)
  const right = polar(cx, cy, half, endAngle - 90)
  return (
    <g className="ts-gauge-needle">
      <path d={`M${left.x},${left.y} L${tip.x},${tip.y} L${right.x},${right.y} Z`} />
      <circle cx={cx} cy={cy} r={half * HUB_SIZE} />
      <circle className="ts-gauge-hub-dot" cx={cx} cy={cy} r={half * HUB_DOT_SIZE} />
    </g>
  )
}

Needle.propTypes = {
  index: PropTypes.number,
  cx: PropTypes.number,
  cy: PropTypes.number,
  outerRadius: PropTypes.number,
  endAngle: PropTypes.number,
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

// value between min and max; warning / critical: where those zones start. The readout (number,
// status) is the caller's `children`, shown under the dial.
function Speedometer({ value, min = 0, max = 100, warning, critical, unit = '', label, children }) {
  const shown = clamp(value, min, max)
  const zones = [
    { name: 'Normal', size: warning - min, fill: STATUS_COLORS.good },
    { name: 'Warning', size: critical - warning, fill: STATUS_COLORS.warning },
    { name: 'Critical', size: max - critical, fill: STATUS_COLORS.critical },
  ]
  // A sliver at the minimum keeps the needle drawn at 0
  const needle = [{ size: Math.max(shown - min, (max - min) / 1000) }, { size: max - shown }]

  return (
    <div
      className="ts-gauge"
      role="meter"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={shown}
      aria-valuetext={`${value}${unit}`}
    >
      <ResponsiveContainer width="100%" aspect={ASPECT}>
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }} accessibilityLayer={false}>
          <Pie
            {...PIE_PROPS}
            data={zones}
            innerRadius={ZONE_RADIUS.inner}
            outerRadius={ZONE_RADIUS.outer}
            cornerRadius={ZONE_CORNER}
            {...SEGMENT_GAP}
            isAnimationActive={false}
          >
            {zones.map((zone) => (
              <Cell key={zone.name} fill={zone.fill} />
            ))}
          </Pie>
          <Pie
            {...PIE_PROPS}
            data={needle}
            innerRadius={0}
            outerRadius={NEEDLE_RADIUS}
            stroke="none"
            shape={Needle}
            animationDuration={ANIMATION_MS * 2}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="ts-gauge-scale font-tabular" aria-hidden="true">
        <span>{`${min}${unit}`}</span>
        <span>{`${max}${unit}`}</span>
      </div>
      {children}
    </div>
  )
}

Speedometer.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  warning: PropTypes.number.isRequired,
  critical: PropTypes.number.isRequired,
  unit: PropTypes.string,
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
}

export default memo(Speedometer)
