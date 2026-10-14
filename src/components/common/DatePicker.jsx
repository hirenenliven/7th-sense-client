import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import PickerField from './PickerField'
import {
  DATE_PLACEHOLDER,
  DATE_TEXT_LENGTH,
  PICKER_LOCALE,
  addDays,
  addMonths,
  dateTextToIso,
  isSameDay,
  isoToDateText,
  maskDateText,
  parseIsoDate,
  startOfToday,
  toIsoDate,
} from '@/utils/dateTime'

const WEEK_START = 1 // Monday, as in en-GB
const YEARS_PER_PAGE = 12

const monthTitle = new Intl.DateTimeFormat(PICKER_LOCALE, { month: 'long', year: 'numeric' })
const monthName = new Intl.DateTimeFormat(PICKER_LOCALE, { month: 'short' })
const dayLabel = new Intl.DateTimeFormat(PICKER_LOCALE, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

// Mon … Sun: 1 Jan 2024 was a Monday
const WEEKDAYS = Array.from({ length: 7 }, (_, index) => {
  const date = new Date(2024, 0, 1 + ((WEEK_START + index + 6) % 7))
  return {
    short: date.toLocaleDateString(PICKER_LOCALE, { weekday: 'short' }).slice(0, 2),
    long: date.toLocaleDateString(PICKER_LOCALE, { weekday: 'long' }),
  }
})

const MONTHS = Array.from({ length: 12 }, (_, month) => monthName.format(new Date(2024, month, 1)))

// 6 weeks × 7 days covering the cursor's month
const monthGrid = (cursor) => {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const start = addDays(first, -((first.getDay() - WEEK_START + 7) % 7))
  return Array.from({ length: 42 }, (_, index) => addDays(start, index))
}

const clamp = (date, min, max) => {
  if (min && date < min) return min
  if (max && date > max) return max
  return date
}

// Arrow / Page / Home / End keys in the day grid → the day to move to
const keyToDay = (event, cursor) => {
  const weekday = (cursor.getDay() - WEEK_START + 7) % 7
  switch (event.key) {
    case 'ArrowLeft': return addDays(cursor, -1)
    case 'ArrowRight': return addDays(cursor, 1)
    case 'ArrowUp': return addDays(cursor, -7)
    case 'ArrowDown': return addDays(cursor, 7)
    case 'Home': return addDays(cursor, -weekday)
    case 'End': return addDays(cursor, 6 - weekday)
    case 'PageUp': return addMonths(cursor, event.shiftKey ? -12 : -1)
    case 'PageDown': return addMonths(cursor, event.shiftKey ? 12 : 1)
    default: return null
  }
}

function DateCalendar({ value, min, max, autoFocus, onSelect, onClear }) {
  const selected = parseIsoDate(value)
  const minDate = parseIsoDate(min)
  const maxDate = parseIsoDate(max)
  const today = startOfToday()
  const [view, setView] = useState('days')
  const [cursor, setCursor] = useState(() => clamp(selected ?? today, minDate, maxDate))
  const [shownValue, setShownValue] = useState(value)
  const gridRef = useRef(null)
  const focusCursor = useRef(autoFocus)

  // Follow a date typed into the field while the calendar is open
  if (value !== shownValue) {
    setShownValue(value)
    if (selected) setCursor(selected)
  }

  useEffect(() => {
    if (!focusCursor.current || view !== 'days') return
    focusCursor.current = false
    // preventScroll: on open the popup is not placed yet, focusing it must not move the page
    gridRef.current?.querySelector(`[data-date="${toIsoDate(cursor)}"]`)?.focus({ preventScroll: true })
  }, [cursor, view])

  const isDisabled = (date) => Boolean((minDate && date < minDate) || (maxDate && date > maxDate))

  const moveTo = (date, focus = true) => {
    focusCursor.current = focus
    setCursor(clamp(date, minDate, maxDate))
  }

  const handleGridKeyDown = (event) => {
    const next = keyToDay(event, cursor)
    if (!next) return
    event.preventDefault()
    moveTo(next)
  }

  const days = monthGrid(cursor)
  const year = cursor.getFullYear()
  const pageStart = Math.floor(year / YEARS_PER_PAGE) * YEARS_PER_PAGE

  // Header: ‹ title › — the title steps up a level (days → months → years)
  const header = {
    days: {
      title: monthTitle.format(cursor),
      prev: () => moveTo(addMonths(cursor, -1), false),
      next: () => moveTo(addMonths(cursor, 1), false),
      up: () => setView('months'),
      step: 'month',
    },
    months: {
      title: String(year),
      prev: () => moveTo(addMonths(cursor, -12), false),
      next: () => moveTo(addMonths(cursor, 12), false),
      up: () => setView('years'),
      step: 'year',
    },
    years: {
      title: `${pageStart} – ${pageStart + YEARS_PER_PAGE - 1}`,
      prev: () => moveTo(addMonths(cursor, -12 * YEARS_PER_PAGE), false),
      next: () => moveTo(addMonths(cursor, 12 * YEARS_PER_PAGE), false),
      up: null,
      step: `${YEARS_PER_PAGE} years`,
    },
  }[view]

  const pickMonth = (month) => {
    moveTo(new Date(year, month, Math.min(cursor.getDate(), new Date(year, month + 1, 0).getDate())))
    setView('days')
  }

  const pickYear = (pickedYear) => {
    moveTo(addMonths(cursor, (pickedYear - year) * 12), false)
    setView('months')
  }

  return (
    <div className="ts-calendar">
      <div className="ts-calendar-header">
        <button type="button" className="ts-calendar-nav" onClick={header.prev} aria-label={`Previous ${header.step}`}>
          <i className="bi bi-chevron-left" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="ts-calendar-title"
          onClick={header.up ?? undefined}
          disabled={!header.up}
          aria-live="polite"
          aria-label={header.up ? `${header.title}, choose ${view === 'days' ? 'month' : 'year'}` : header.title}
        >
          {header.title}
          {header.up && <i className="bi bi-chevron-down" aria-hidden="true" />}
        </button>
        <button type="button" className="ts-calendar-nav" onClick={header.next} aria-label={`Next ${header.step}`}>
          <i className="bi bi-chevron-right" aria-hidden="true" />
        </button>
      </div>

      {view === 'days' && (
        <table className="ts-calendar-grid" role="grid" aria-label={monthTitle.format(cursor)} ref={gridRef} onKeyDown={handleGridKeyDown}>
          <thead>
            <tr>
              {WEEKDAYS.map((weekday) => (
                <th key={weekday.long} scope="col" abbr={weekday.long}>
                  {weekday.short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, week) => (
              <tr key={week}>
                {days
                  .slice(week * 7, week * 7 + 7)
                  .map((date) => {
                    const iso = toIsoDate(date)
                    const isSelected = isSameDay(date, selected)
                    const isOutside = date.getMonth() !== cursor.getMonth()
                    const classes = [
                      'ts-calendar-day',
                      isSelected && 'is-selected',
                      isSameDay(date, today) && 'is-today',
                      isOutside && 'is-outside',
                    ].filter(Boolean)
                    return (
                      <td key={iso} role="gridcell" aria-selected={isSelected}>
                        <button
                          type="button"
                          className={classes.join(' ')}
                          data-date={iso}
                          tabIndex={isSameDay(date, cursor) ? 0 : -1}
                          disabled={isDisabled(date)}
                          aria-label={dayLabel.format(date)}
                          aria-current={isSameDay(date, today) ? 'date' : undefined}
                          onClick={() => onSelect(date)}
                        >
                          {date.getDate()}
                        </button>
                      </td>
                    )
                  })}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {view === 'months' && (
        <div className="ts-calendar-options">
          {MONTHS.map((label, month) => {
            const isSelected = selected?.getFullYear() === year && selected?.getMonth() === month
            const isCurrent = today.getFullYear() === year && today.getMonth() === month
            return (
              <button
                key={label}
                type="button"
                className={`ts-calendar-option${isSelected ? ' is-selected' : ''}${isCurrent ? ' is-today' : ''}`}
                aria-pressed={isSelected}
                onClick={() => pickMonth(month)}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      {view === 'years' && (
        <div className="ts-calendar-options">
          {Array.from({ length: YEARS_PER_PAGE }, (_, index) => pageStart + index).map((option) => {
            const isSelected = selected?.getFullYear() === option
            return (
              <button
                key={option}
                type="button"
                className={`ts-calendar-option${isSelected ? ' is-selected' : ''}${today.getFullYear() === option ? ' is-today' : ''}`}
                aria-pressed={isSelected}
                onClick={() => pickYear(option)}
              >
                {option}
              </button>
            )
          })}
        </div>
      )}

      <div className="ts-picker-footer">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClear} disabled={!value}>
          Clear
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onSelect(today)} disabled={isDisabled(today)}>
          Today
        </button>
      </div>
    </div>
  )
}

DateCalendar.propTypes = {
  value: PropTypes.string.isRequired,
  min: PropTypes.string,
  max: PropTypes.string,
  autoFocus: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
}

// Themed date field. Value and onChange use "YYYY-MM-DD" (like <input type="date">), so it drops
// into a React Hook Form <Controller>: render={({ field }) => <DatePicker {...field} isInvalid={…} />}.
// Shows and accepts DD-MM-YYYY; the value stays '' until the typed date is complete and real.
function DatePicker({ ref, value = '', onChange, onBlur, name, id, isInvalid = false, disabled = false, min, max }) {
  const [text, setText] = useState(() => isoToDateText(value))
  const [syncedValue, setSyncedValue] = useState(value)

  // Value changed from outside (form reset, record loaded) → show it
  if (value !== syncedValue) {
    setSyncedValue(value)
    if (dateTextToIso(text) !== value) setText(isoToDateText(value))
  }

  const handleTextChange = (raw) => {
    const masked = maskDateText(raw)
    setText(masked)
    const iso = dateTextToIso(masked)
    if (iso !== value) onChange(iso)
  }

  const commit = (iso) => {
    setText(isoToDateText(iso))
    if (iso !== value) onChange(iso)
  }

  return (
    <PickerField
      inputRef={ref}
      id={id}
      name={name}
      text={text}
      onTextChange={handleTextChange}
      onBlur={onBlur}
      isInvalid={isInvalid}
      disabled={disabled}
      placeholder={DATE_PLACEHOLDER}
      maxLength={DATE_TEXT_LENGTH}
      inputMode="numeric"
      icon="bi-calendar3"
      toggleLabel="Choose date"
      panelLabel="Choose date"
      renderPanel={({ close, autoFocus }) => (
        <DateCalendar
          value={value}
          min={min}
          max={max}
          autoFocus={autoFocus}
          onSelect={(date) => {
            commit(toIsoDate(date))
            close({ returnFocus: true })
          }}
          onClear={() => {
            commit('')
            close({ returnFocus: true })
          }}
        />
      )}
    />
  )
}

DatePicker.propTypes = {
  ref: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  name: PropTypes.string,
  id: PropTypes.string,
  isInvalid: PropTypes.bool,
  disabled: PropTypes.bool,
  min: PropTypes.string, // "YYYY-MM-DD"
  max: PropTypes.string, // "YYYY-MM-DD"
}

export default DatePicker
