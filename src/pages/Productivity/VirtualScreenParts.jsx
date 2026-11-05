import { ProgressBar } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { STATUS_COLORS } from '@/components/charts/chartTheme'
import { statusOf } from '@/pages/MachineHealth/healthSensors'
import { AXES, AXIS_LOAD, OVERRIDE_MAX, OVERRIDE_PROGRAMMED, formatReading } from './virtualScreenSettings'

// The Virtual Screen's dials, bars and rows (VirtualScreen.jsx). Colours are theme variables, so
// they follow dark / light.

// Override dial: a 270° ring open at the bottom, 0 … OVERRIDE_MAX %, a tick at the programmed 100 %
const DIAL = { size: 120, radius: 50, sweep: 270, start: 135 }
const DIAL_CENTER = DIAL.size / 2
const DIAL_CIRCUMFERENCE = 2 * Math.PI * DIAL.radius
const DIAL_ARC = (DIAL.sweep / 360) * DIAL_CIRCUMFERENCE
const RADIANS = Math.PI / 180

const dialPoint = (radius, share) => {
  const angle = (DIAL.start + DIAL.sweep * share) * RADIANS
  return { x: DIAL_CENTER + radius * Math.cos(angle), y: DIAL_CENTER + radius * Math.sin(angle) }
}

// "−20% vs program", "At program", "+10% vs program"
const overrideNote = (value) => {
  if (value == null) return 'Not read yet'
  const delta = Math.round(value - OVERRIDE_PROGRAMMED)
  if (delta === 0) return 'At programmed rate'
  return `${delta > 0 ? '+' : '−'}${Math.abs(delta)}% vs program`
}

export function OverrideDial({ label, value, children }) {
  const shown = value == null ? 0 : Math.min(OVERRIDE_MAX, Math.max(0, value))
  const status = value == null || value === OVERRIDE_PROGRAMMED ? 'info' : 'warning'
  const tickInner = dialPoint(DIAL.radius - 9, OVERRIDE_PROGRAMMED / OVERRIDE_MAX)
  const tickOuter = dialPoint(DIAL.radius + 7, OVERRIDE_PROGRAMMED / OVERRIDE_MAX)
  const rotate = `rotate(${DIAL.start} ${DIAL_CENTER} ${DIAL_CENTER})`

  return (
    <div className="ts-vs-dial">
      <div className="ts-vs-label">{label}</div>
      <div
        className="ts-vs-dial-face"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={OVERRIDE_MAX}
        aria-valuenow={shown}
      >
        <svg viewBox={`0 0 ${DIAL.size} ${DIAL.size}`} aria-hidden="true">
          <circle
            className="ts-vs-dial-track"
            cx={DIAL_CENTER}
            cy={DIAL_CENTER}
            r={DIAL.radius}
            strokeDasharray={`${DIAL_ARC} ${DIAL_CIRCUMFERENCE}`}
            transform={rotate}
          />
          <circle
            className="ts-vs-dial-value"
            cx={DIAL_CENTER}
            cy={DIAL_CENTER}
            r={DIAL.radius}
            stroke={STATUS_COLORS[status]}
            strokeDasharray={`${(shown / OVERRIDE_MAX) * DIAL_ARC} ${DIAL_CIRCUMFERENCE}`}
            transform={rotate}
          />
          <line className="ts-vs-dial-tick" x1={tickInner.x} y1={tickInner.y} x2={tickOuter.x} y2={tickOuter.y} />
        </svg>
        <div className="ts-vs-dial-readout">
          <span className="ts-number ts-number-sm font-tabular">
            {formatReading(value, 0)}
            {value != null && <small>%</small>}
          </span>
          <span className="ts-vs-dial-scale font-tabular">0 – {OVERRIDE_MAX}%</span>
        </div>
      </div>
      <div className={`small ${status === 'warning' ? 'text-warning' : 'text-body-secondary'}`}>{overrideNote(value)}</div>
      {children}
    </div>
  )
}

OverrideDial.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number,
  children: PropTypes.node,
}

// Axis load: a vertical bar per axis filled to its load, coloured by status. Axes the controller
// does not send (a lathe has no Y) are left out; with none read, all three show "—".
const BAR = { width: 28, height: 120, radius: 6 }

export function AxisLoadBars({ live }) {
  const read = AXES.filter((axis) => live[axis.key] != null)
  const axes = read.length ? read : AXES

  return (
    <div className="ts-vs-axes">
      <div className="ts-vs-label">Axis Load</div>
      <div className="ts-vs-axes-bars">
        {axes.map((axis) => {
          const value = live[axis.key]
          const shown = value == null ? 0 : Math.min(100, Math.max(0, Math.abs(value)))
          const fill = (shown / 100) * BAR.height
          return (
            <div key={axis.key} className="ts-vs-axis" role="meter" aria-label={`${axis.label} axis load`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={shown}>
              <span className="font-tabular small">{value == null ? '—' : `${formatReading(shown)}%`}</span>
              <svg viewBox={`0 0 ${BAR.width} ${BAR.height}`} aria-hidden="true">
                <rect className="ts-vs-axis-track" width={BAR.width} height={BAR.height} rx={BAR.radius} />
                {fill > 0 && (
                  <rect
                    y={BAR.height - fill}
                    width={BAR.width}
                    height={fill}
                    rx={BAR.radius}
                    fill={STATUS_COLORS[statusOf(shown, AXIS_LOAD)]}
                  />
                )}
              </svg>
              <span className="ts-vs-axis-name">{axis.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

AxisLoadBars.propTypes = {
  live: PropTypes.object.isRequired,
}

// Progress of the batch / the cycle: the share in a thick bar with tenth ticks underneath
const TICKS = Array.from({ length: 11 }, (_, index) => index)

export function ProgressMeter({ label, share, variant }) {
  return (
    <div className="ts-vs-progress">
      <div className="d-flex justify-content-between align-items-baseline mb-2">
        <span className="ts-vs-label">{label}</span>
        <span className={`ts-number ts-number-sm font-tabular text-${variant}`}>
          {share == null ? '—' : Math.round(share)}
          {share != null && <small>%</small>}
        </span>
      </div>
      <ProgressBar className="progress-lg" variant={variant} now={share ?? 0} aria-label={label} />
      <div className="ts-vs-ticks" aria-hidden="true">
        {TICKS.map((tick) => (
          <span key={tick} />
        ))}
      </div>
    </div>
  )
}

ProgressMeter.propTypes = {
  label: PropTypes.string.isRequired,
  share: PropTypes.number,
  variant: PropTypes.oneOf(['success', 'info', 'warning']).isRequired,
}

// One label / value pair of a card (Remaining time, Job ID, …)
export function Reading({ label, value, emphasis }) {
  return (
    <div className="ts-vs-reading">
      <span className="ts-vs-label">{label}</span>
      <span className={emphasis ? 'ts-number ts-number-sm font-tabular' : 'ts-vs-reading-value text-truncate'}>{value}</span>
    </div>
  )
}

Reading.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
  emphasis: PropTypes.bool,
}
