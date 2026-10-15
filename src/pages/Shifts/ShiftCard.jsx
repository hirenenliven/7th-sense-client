import { memo } from 'react'
import { Badge, Card } from 'react-bootstrap'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import StatusBadge from '@/components/common/StatusBadge'
import { ACTION_ICONS } from '@/constants/icons'
import { SHIFT_STATUS, SHIFT_TYPES, WEEKDAYS } from '@/constants/shifts'
import { formatClock12, formatHoursMinutes, parseTime } from '@/utils/dateTime'

const MINUTES_PER_DAY = 24 * 60

// Breaks shown before the list scrolls — keep in sync with $ts-shift-breaks-visible
const MAX_VISIBLE_BREAKS = 4

const typeLabel = (value) => SHIFT_TYPES.find((option) => option.value === value)?.label ?? value

const toMinutes = (value) => {
  const time = parseTime(value)
  return time ? time.hours * 60 + time.minutes : 0
}

// Minutes from start to end; an end at or before the start is on the next day
const minutesBetween = (start, end) => (toMinutes(end) - toMinutes(start) + MINUTES_PER_DAY) % MINUTES_PER_DAY

// "08:00 PM" → clock "08:00" + period "PM", so the period can be set smaller
function Clock({ label, value, nextDay = false }) {
  const [clock, period] = formatClock12(value).split(' ')
  return (
    <div>
      <div className="ts-shift-card-label">{label}</div>
      <div className="ts-shift-card-clock">
        {clock}
        {period && <span className="ts-shift-card-period">{period}</span>}
        {nextDay && (
          <span className="ts-shift-card-next-day" title="Ends the next day">
            +1
          </span>
        )}
      </div>
    </div>
  )
}

Clock.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  nextDay: PropTypes.bool,
}

// One shift: name, type (Day / Night) and number, its start → end time, shift / break / working
// hours, the working days (days off muted) and breaks. canManage (managers): Edit / Delete.
// `isEditing`: this card is loaded in the form.
function ShiftCard({ shift, number, showCustomer, canManage, isEditing, onEdit, onDelete }) {
  const workingDays = new Set(shift.workingDays)
  const isInactive = shift.status === SHIFT_STATUS.INACTIVE
  const isNight = shift.shiftType === 'night'
  const breakMinutes = shift.breakMinutes ?? 0
  const endsNextDay = toMinutes(shift.endTime) <= toMinutes(shift.startTime)
  const hasManyBreaks = shift.breaks.length > MAX_VISIBLE_BREAKS

  const stats = [
    { label: 'Shift length', value: formatHoursMinutes(shift.durationMinutes) },
    { label: 'Breaks', value: formatHoursMinutes(breakMinutes) },
    { label: 'Working time', value: formatHoursMinutes(shift.durationMinutes - breakMinutes), accent: true },
  ]

  const classes = ['h-100', 'ts-shift-card', isEditing && 'is-editing', isInactive && 'is-inactive'].filter(Boolean)

  return (
    <Card className={classes.join(' ')}>
      <Card.Body className="d-flex flex-column gap-3">
        <div className="d-flex align-items-start gap-3">
          <span className={`ts-shift-card-icon ${isNight ? 'is-night' : 'is-day'}`} aria-hidden="true">
            <i className={`bi ${isNight ? 'bi-moon-stars' : 'bi-sun'}`} />
          </span>

          <div className="flex-grow-1 ts-shift-card-heading">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <h2 className="ts-shift-card-name text-truncate">{shift.name}</h2>
              {isEditing && (
                <Badge bg="" className="badge-soft-primary">
                  Editing
                </Badge>
              )}
              {isInactive && (
                <StatusBadge active={false} />
              )}
            </div>
            <div className="ts-shift-card-meta">
              Shift {number} · {typeLabel(shift.shiftType)}
              {showCustomer && shift.customerName && ` · ${shift.customerName}`}
            </div>
          </div>

          {canManage && (
            <div className="d-flex gap-1 flex-shrink-0">
              <IconAction icon={ACTION_ICONS.edit} label={`Edit shift ${shift.name}`} onClick={() => onEdit(shift)} />
              <IconAction icon={ACTION_ICONS.delete} label={`Delete shift ${shift.name}`} onClick={() => onDelete(shift)} danger />
            </div>
          )}
        </div>

        <div className="ts-shift-card-hours">
          <Clock label="Starts" value={shift.startTime} />
          <i className="bi bi-arrow-right ts-shift-card-arrow" aria-hidden="true" />
          <Clock label="Ends" value={shift.endTime} nextDay={endsNextDay} />
        </div>

        <dl className="ts-shift-card-stats">
          {stats.map((stat) => (
            <div key={stat.label} className={stat.accent ? 'is-accent' : undefined}>
              <dt>{stat.label}</dt>
              <dd>
                {stat.value}
                <span className="ts-shift-card-unit">h</span>
              </dd>
            </div>
          ))}
        </dl>

        <div>
          <div className="ts-shift-card-label">Working days</div>
          <ul className="ts-shift-days">
            {WEEKDAYS.map((day) => {
              const isWorking = workingDays.has(day.id)
              return (
                <li
                  key={day.id}
                  className={isWorking ? 'is-working' : undefined}
                  title={`${day.label}: ${isWorking ? 'working day' : 'day off'}`}
                >
                  {day.label.slice(0, 3)}
                  <span className="visually-hidden">{isWorking ? ' (working day)' : ' (day off)'}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="mt-auto">
          <div className="ts-shift-card-label">Breaks{shift.breaks.length > 0 && ` (${shift.breaks.length})`}</div>
          {shift.breaks.length > 0 ? (
            // More than MAX_VISIBLE_BREAKS: the list scrolls (a tab stop, so the keyboard can scroll it too)
            <ul
              className={`ts-shift-breaks-list${hasManyBreaks ? ' is-scrollable' : ''}`}
              tabIndex={hasManyBreaks ? 0 : undefined}
              aria-label={hasManyBreaks ? `Breaks of shift ${shift.name}` : undefined}
            >
              {shift.breaks.map((shiftBreak) => (
                <li key={shiftBreak.id}>
                  <i className="bi bi-cup-hot ts-shift-break-icon" aria-hidden="true" />
                  <span className="ts-shift-break-name text-truncate">{shiftBreak.name}</span>
                  <span className="ts-shift-break-time">
                    {formatClock12(shiftBreak.startTime)} – {formatClock12(shiftBreak.endTime)}
                  </span>
                  <span className="ts-shift-break-length">
                    {minutesBetween(shiftBreak.startTime, shiftBreak.endTime)} min
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="small text-body-secondary">No breaks</div>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

ShiftCard.propTypes = {
  shift: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    shiftType: PropTypes.string,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    workingDays: PropTypes.arrayOf(PropTypes.number).isRequired,
    status: PropTypes.string,
    customerName: PropTypes.string,
    durationMinutes: PropTypes.number.isRequired,
    breakMinutes: PropTypes.number,
    breaks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        startTime: PropTypes.string.isRequired,
        endTime: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  number: PropTypes.number.isRequired,
  showCustomer: PropTypes.bool.isRequired,
  canManage: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(ShiftCard)
