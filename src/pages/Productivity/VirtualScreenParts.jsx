import { useId } from 'react'
import PropTypes from 'prop-types'
import axisHandle from '@/assets/images/virtual-screen/axis-handle.png'
import axisPanel from '@/assets/images/virtual-screen/axis-panel.png'
import axisStripAngled from '@/assets/images/virtual-screen/axis-strip-angled.png'
import axisStrip from '@/assets/images/virtual-screen/axis-strip.png'
import overrideDial from '@/assets/images/virtual-screen/override-dial.png'
import spindleLoadDial from '@/assets/images/virtual-screen/spindle-load-dial.png'
import spindleLoadNeedle from '@/assets/images/virtual-screen/spindle-load-needle.png'
import { SPINDLE_LOAD, statusOf } from '@/pages/MachineHealth/healthSensors'
import { AXES, OVERRIDE_MAX, clamp, formatReading } from './virtualScreenSettings'

// The Virtual Screen's instruments (VirtualScreen.jsx), drawn like the old PHP controller screen:
// its dial, needle, strip and panel images inside SVGs with fixed view boxes, so they scale with
// the layout and every moving part is an SVG attribute (no inline styles). Colours are classes.

// Spindle load: the half-round SPINDLE LOAD dial, the white needle from 0 % (left) over the top to
// 100 % (right) and the reading in the knob, amber / red past the Machine Health limits
const LOAD_GAUGE = { width: 440, height: 364, pivot: 220, dial: { x: 38, size: 364 }, needle: { x: 20, width: 213, height: 34 } }

export function SpindleLoadGauge({ value }) {
  const shown = value == null ? 0 : clamp(value, SPINDLE_LOAD.min, SPINDLE_LOAD.max)
  const angle = (shown / SPINDLE_LOAD.max) * 180
  const status = value == null ? 'idle' : statusOf(value, SPINDLE_LOAD)
  const { pivot, dial, needle } = LOAD_GAUGE

  return (
    <svg
      className="ts-vs-load-gauge"
      viewBox={`0 0 ${LOAD_GAUGE.width} ${LOAD_GAUGE.height}`}
      role="meter"
      aria-label="Spindle load"
      aria-valuemin={SPINDLE_LOAD.min}
      aria-valuemax={SPINDLE_LOAD.max}
      aria-valuenow={shown}
    >
      <image href={spindleLoadDial} x={dial.x} y={0} width={dial.size} height={dial.size} />
      <g className="ts-vs-needle" transform={`rotate(${angle} ${pivot} ${pivot})`}>
        <image href={spindleLoadNeedle} x={needle.x} y={pivot - needle.height / 2} width={needle.width} height={needle.height} />
      </g>
      <text className={`ts-vs-load-value ts-vs-status-${status}`} x={pivot} y={pivot + 66} textAnchor="middle">
        {formatReading(value == null ? null : Math.abs(value), 2)}
        {value != null && <tspan className="ts-vs-unit"> %</tspan>}
      </text>
    </svg>
  )
}

SpindleLoadGauge.propTypes = { value: PropTypes.number }

// Override dial (spindle / feed): the round dial image, a 274° sweep open at the bottom from 0 to
// OVERRIDE_MAX %, the needle drawn as a tapered line in the dial's colour with a ring at the pivot
const DIAL = { size: 170, start: -47, sweep: 274, needle: 70, base: 4, ring: 7 }

export function OverrideGauge({ title, value, tone, children }) {
  const gradientId = useId()
  const shown = value == null ? 0 : clamp(value, 0, OVERRIDE_MAX)
  const angle = DIAL.start + (shown / OVERRIDE_MAX) * DIAL.sweep
  const centre = DIAL.size / 2

  return (
    <div className={`ts-vs-meter ts-vs-needle-${tone}`}>
      <h3 className="ts-vs-meter-title">{title}</h3>
      <div className="ts-vs-meter-body">
        <svg
          className="ts-vs-meter-dial"
          viewBox={`0 0 ${DIAL.size} ${DIAL.size}`}
          role="meter"
          aria-label={`${title} override`}
          aria-valuemin={0}
          aria-valuemax={OVERRIDE_MAX}
          aria-valuenow={shown}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
              <stop className="ts-vs-needle-tip" offset="0" />
              <stop className="ts-vs-needle-base" offset="1" />
            </linearGradient>
          </defs>
          <image href={overrideDial} width={DIAL.size} height={DIAL.size} />
          <g className="ts-vs-needle" transform={`rotate(${angle} ${centre} ${centre})`}>
            <path
              d={`M${centre - DIAL.needle},${centre} L${centre},${centre - DIAL.base} L${centre},${centre + DIAL.base} Z`}
              fill={`url(#${gradientId})`}
            />
            <circle className="ts-vs-needle-ring" cx={centre} cy={centre} r={DIAL.ring} />
          </g>
        </svg>
        <div className="ts-vs-meter-side">
          <div className="ts-vs-meter-value">
            {formatReading(value, 0)}
            {value != null && <span className="ts-vs-unit">%</span>}
          </div>
          <div className="ts-vs-cap">{children}</div>
        </div>
      </div>
    </div>
  )
}

OverrideGauge.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number,
  tone: PropTypes.oneOf(['spindle', 'feed']).isRequired,
  children: PropTypes.node,
}

// Axis load: the slanted panel with a strip per axis and a handle at its load, Z upright and X / Y
// tilted ±60° (three axes), or X and Z upright side by side when the controller sends no Y (a
// lathe); the readings beside it. Axes never read show "—".
const STRIP = { width: 28, height: 89, handle: 9, name: 16 }
const STRIP_LAYOUTS = {
  three: [
    { key: 'axisLoadZ', label: 'Z', x: 112, y: 45, angle: 0, image: axisStrip, fromTop: false },
    { key: 'axisLoadX', label: 'X', x: 62, y: 135, angle: 60, image: axisStripAngled, fromTop: true },
    { key: 'axisLoadY', label: 'Y', x: 162, y: 135, angle: -60, image: axisStripAngled, fromTop: true },
  ],
  two: [
    { key: 'axisLoadZ', label: 'Z', x: 112, y: 45, angle: 0, image: axisStrip, fromTop: false },
    { key: 'axisLoadX', label: 'X', x: 55, y: 45, angle: 0, image: axisStrip, fromTop: false },
  ],
}

function AxisStrip({ strip, value }) {
  const level = (clamp(Math.abs(value ?? 0), 0, 100) / 100) * STRIP.height
  const handleY = (strip.fromTop ? level : STRIP.height - level) - STRIP.handle / 2
  const pivotX = STRIP.width / 2
  const pivotY = STRIP.height / 2
  // Upright strips are named above, tilted ones below (the name kept level)
  const nameY = strip.angle ? STRIP.height + STRIP.name + 4 : -STRIP.name / 2 - 2

  return (
    <g transform={`translate(${strip.x} ${strip.y}) rotate(${strip.angle} ${pivotX} ${pivotY})`}>
      <image href={strip.image} width={STRIP.width} height={STRIP.height} />
      <image className="ts-vs-axis-handle" href={axisHandle} y={handleY} width={STRIP.width} height={STRIP.handle} />
      <text className="ts-vs-axis-name" x={pivotX} y={nameY} textAnchor="middle" transform={`rotate(${-strip.angle} ${pivotX} ${nameY - 5})`}>
        {strip.label}
      </text>
    </g>
  )
}

AxisStrip.propTypes = { strip: PropTypes.object.isRequired, value: PropTypes.number }

export function AxisLoadPanel({ live }) {
  const strips = live.axisLoadY == null && (live.axisLoadX != null || live.axisLoadZ != null) ? STRIP_LAYOUTS.two : STRIP_LAYOUTS.three
  const readings = AXES.filter((axis) => strips.some((strip) => strip.key === axis.key))

  return (
    <div className="ts-vs-axis-panel">
      <svg className="ts-vs-axis-strips" viewBox="0 0 230 240" aria-hidden="true">
        <image href={axisPanel} width={220} height={200} />
        {strips.map((strip) => (
          <AxisStrip key={strip.key} strip={strip} value={live[strip.key]} />
        ))}
      </svg>
      <div className="ts-vs-axis-readings">
        <span className="ts-vs-axis-title">Axis Load</span>
        {readings.map((axis) => (
          <div key={axis.key}>
            <b>{axis.label} :</b>{' '}
            <span className="ts-vs-axis-value">
              {live[axis.key] == null ? '—' : `${formatReading(clamp(Math.abs(live[axis.key]), 0, 100), 2)}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

AxisLoadPanel.propTypes = { live: PropTypes.object.isRequired }

// Batch / cycle progress: the dark track with a gradient fill, a marker at its end carrying the
// share, and tenth ticks underneath (tone batch green, cycle blue, overrun amber)
const BAR = { width: 400, height: 66, track: 16, label: 24, ticks: 11 }

export function ScreenProgress({ share, tone, label }) {
  const gradientId = useId()
  const fill = share == null ? 0 : (clamp(share, 0, 100) / 100) * BAR.width
  const labelX = clamp(fill, BAR.label, BAR.width - BAR.label)

  return (
    <svg
      className={`ts-vs-progress ts-vs-progress-${tone}`}
      viewBox={`0 0 ${BAR.width} ${BAR.height}`}
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={share == null ? undefined : Math.round(share)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
          <stop className="ts-vs-progress-start" offset="0" />
          <stop className="ts-vs-progress-mid" offset="0.9" />
          <stop className="ts-vs-progress-end" offset="1" />
        </linearGradient>
        <clipPath id={`${gradientId}-track`}>
          <rect width={BAR.width} height={BAR.track} rx={BAR.track / 2} />
        </clipPath>
      </defs>
      <rect className="ts-vs-progress-track" width={BAR.width} height={BAR.track} rx={BAR.track / 2} />
      {fill > 0 && <rect width={fill} height={BAR.track} fill={`url(#${gradientId})`} clipPath={`url(#${gradientId}-track)`} />}
      {Array.from({ length: BAR.ticks }, (_, index) => (
        <rect key={index} className="ts-vs-progress-tick" x={(index / (BAR.ticks - 1)) * (BAR.width - 4)} y={26} width={4} height={6} rx={2} />
      ))}
      {share != null && <rect className="ts-vs-progress-marker" x={Math.max(0, fill - 2)} y={8} width={2} height={27} />}
      <text className="ts-vs-progress-label" x={share == null ? BAR.label : labelX} y={BAR.height - 6} textAnchor="middle">
        {share == null ? '—' : `${Math.round(share)}%`}
      </text>
    </svg>
  )
}

ScreenProgress.propTypes = {
  share: PropTypes.number,
  tone: PropTypes.oneOf(['batch', 'cycle', 'overrun']).isRequired,
  label: PropTypes.string.isRequired,
}
