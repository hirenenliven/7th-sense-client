import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import PickerField from './PickerField'
import { TIME_PLACEHOLDER, TIME_TEXT_LENGTH, maskTimeText, pad2, parseTime, timeTextToValue, toTimeValue } from '@/utils/dateTime'

const HOURS = Array.from({ length: 24 }, (_, hour) => hour)
const MINUTES = Array.from({ length: 60 }, (_, minute) => minute)

// One scrolling column of options (hours or minutes); ↑ ↓ Home End move, ← → switch column
function TimeColumn({ label, options, selected, highlight, onPick, columnRef, onSwitchColumn }) {
  const handleKeyDown = (event) => {
    const buttons = [...event.currentTarget.querySelectorAll('button')]
    const index = buttons.indexOf(document.activeElement)
    const moves = { ArrowUp: index - 1, ArrowDown: index + 1, Home: 0, End: buttons.length - 1 }
    if (event.key in moves) {
      event.preventDefault()
      buttons[Math.max(0, Math.min(buttons.length - 1, moves[event.key]))]?.focus()
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      onSwitchColumn(event.key === 'ArrowLeft' ? -1 : 1)
    }
  }

  // Roving tab stop: the selected option, else the highlighted one (current hour / minute 0)
  const tabStop = selected ?? highlight

  return (
    <div className="ts-time-column">
      <div className="ts-time-column-label" aria-hidden="true">
        {label}
      </div>
      <div className="ts-time-list" role="listbox" aria-label={label} ref={columnRef} onKeyDown={handleKeyDown}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            role="option"
            className={`ts-time-option${option === selected ? ' is-selected' : ''}`}
            aria-selected={option === selected}
            tabIndex={option === tabStop ? 0 : -1}
            data-value={option}
            onClick={() => onPick(option)}
          >
            {pad2(option)}
          </button>
        ))}
      </div>
    </div>
  )
}

TimeColumn.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.number).isRequired,
  selected: PropTypes.number,
  highlight: PropTypes.number.isRequired,
  onPick: PropTypes.func.isRequired,
  columnRef: PropTypes.object.isRequired,
  onSwitchColumn: PropTypes.func.isRequired,
}

// Scroll an option to the middle of its column
const centerOption = (column, value) => {
  const option = column?.querySelector(`[data-value="${value}"]`)
  if (option) column.scrollTop = option.offsetTop - (column.clientHeight - option.offsetHeight) / 2
}

function TimePanel({ value, autoFocus, onPick, onClear, onDone }) {
  const time = parseTime(value)
  const hoursRef = useRef(null)
  const minutesRef = useRef(null)
  const nowHour = new Date().getHours()

  // On open: show the picked time (or the current hour) and focus it when opened from the button
  useEffect(() => {
    centerOption(hoursRef.current, time?.hours ?? nowHour)
    centerOption(minutesRef.current, time?.minutes ?? 0)
    if (autoFocus) hoursRef.current?.querySelector('[tabindex="0"]')?.focus({ preventScroll: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the panel opens
  }, [])

  const switchColumn = (direction) => {
    const target = direction < 0 ? hoursRef.current : minutesRef.current
    target?.querySelector('[tabindex="0"]')?.focus()
  }

  const setNow = () => {
    const now = new Date()
    onPick(toTimeValue(now.getHours(), now.getMinutes()))
    centerOption(hoursRef.current, now.getHours())
    centerOption(minutesRef.current, now.getMinutes())
  }

  return (
    <div className="ts-time-panel">
      <div className="ts-time-columns">
        <TimeColumn
          label="Hour"
          options={HOURS}
          selected={time?.hours}
          highlight={nowHour}
          columnRef={hoursRef}
          onSwitchColumn={switchColumn}
          onPick={(hours) => onPick(toTimeValue(hours, time?.minutes ?? 0))}
        />
        <div className="ts-time-separator" aria-hidden="true">
          :
        </div>
        <TimeColumn
          label="Minute"
          options={MINUTES}
          selected={time?.minutes}
          highlight={0}
          columnRef={minutesRef}
          onSwitchColumn={switchColumn}
          onPick={(minutes) => onPick(toTimeValue(time?.hours ?? nowHour, minutes))}
        />
      </div>

      <div className="ts-picker-footer">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClear} disabled={!value}>
          Clear
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={setNow}>
          Now
        </button>
        <button type="button" className="btn btn-primary btn-sm ms-auto" onClick={onDone}>
          Done
        </button>
      </div>
    </div>
  )
}

TimePanel.propTypes = {
  value: PropTypes.string.isRequired,
  autoFocus: PropTypes.bool.isRequired,
  onPick: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
}

// Themed 24-hour time field. Value and onChange use "HH:mm" (like <input type="time">), so it drops
// into a React Hook Form <Controller>: render={({ field }) => <TimePicker {...field} isInvalid={…} />}.
// The value stays '' until the typed time is complete and valid.
function TimePicker({ ref, value = '', onChange, onBlur, name, id, isInvalid = false, disabled = false }) {
  const [text, setText] = useState(value)
  const [syncedValue, setSyncedValue] = useState(value)

  // Value changed from outside (form reset, record loaded) → show it
  if (value !== syncedValue) {
    setSyncedValue(value)
    if (timeTextToValue(text) !== value) setText(value)
  }

  const handleTextChange = (raw) => {
    const masked = maskTimeText(raw)
    setText(masked)
    const next = timeTextToValue(masked)
    if (next !== value) onChange(next)
  }

  const commit = (next) => {
    setText(next)
    if (next !== value) onChange(next)
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
      placeholder={TIME_PLACEHOLDER}
      maxLength={TIME_TEXT_LENGTH}
      inputMode="numeric"
      icon="bi-clock"
      toggleLabel="Choose time"
      panelLabel="Choose time"
      renderPanel={({ close, autoFocus }) => (
        <TimePanel
          value={value}
          autoFocus={autoFocus}
          onPick={commit}
          onClear={() => {
            commit('')
            close({ returnFocus: true })
          }}
          onDone={() => close({ returnFocus: true })}
        />
      )}
    />
  )
}

TimePicker.propTypes = {
  ref: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  name: PropTypes.string,
  id: PropTypes.string,
  isInvalid: PropTypes.bool,
  disabled: PropTypes.bool,
}

export default TimePicker
