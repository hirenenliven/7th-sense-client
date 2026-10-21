import { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { DateCalendar } from './DatePicker'
import PickerField from './PickerField'
import {
  DATE_RANGE_PLACEHOLDER,
  DATE_RANGE_TEXT_LENGTH,
  daysBetweenIso,
  dateRangeTextToIso,
  isoRangeToText,
  maskDateRangeText,
  shiftIsoDate,
  toIsoDate,
  todayIso,
} from '@/utils/dateTime'

const DEFAULT_PRESETS = [7, 14, 30] // "last n days" buttons (only those within maxDays)

const earlier = (a, b) => (a <= b ? a : b)
const later = (a, b) => (a >= b ? a : b)

// A valid range: from ≤ to, inside min / max, at most maxDays days (inclusive, keeping `from`)
const normalizeRange = ({ from, to }, { min, max, maxDays }) => {
  let start = earlier(from, to)
  let end = later(from, to)
  if (min) start = later(start, min)
  if (max) end = earlier(end, max)
  if (maxDays && daysBetweenIso(start, end) > maxDays - 1) end = shiftIsoDate(start, maxDays - 1)
  return { from: earlier(start, end), to: end }
}

const sameRange = (a, b) => a.from === b.from && a.to === b.to

// Calendar panel: the first click sets the start, the second the end (the days between preview on
// hover). While the end is picked only days within maxDays of the start can be chosen.
function RangePanel({ value, min, max, maxDays, presets, autoFocus, onPick }) {
  const [start, setStart] = useState(null)
  const [hover, setHover] = useState(null)
  const { t } = useTranslation()
  const span = maxDays ? maxDays - 1 : null
  const lastDay = max ? earlier(max, todayIso()) : todayIso()

  const shown = start ? { from: earlier(start, hover ?? start), to: later(start, hover ?? start) } : value
  const pickMin = start && span != null ? later(min ?? '', shiftIsoDate(start, -span)) : min
  const pickMax = start && span != null ? earlier(max ?? '9999-12-31', shiftIsoDate(start, span)) : max

  const select = (date) => {
    const iso = toIsoDate(date)
    if (!start) {
      setStart(iso)
      setHover(iso)
      return
    }
    setStart(null)
    onPick({ from: earlier(start, iso), to: later(start, iso) })
  }

  return (
    <DateCalendar
      value={start ?? value.to}
      min={pickMin || undefined}
      max={pickMax}
      autoFocus={autoFocus}
      range={shown}
      onSelect={select}
      onHoverDate={start ? (date) => setHover(toIsoDate(date)) : undefined}
      footer={
        <div className="ts-picker-footer flex-wrap">
          <span className="ts-range-hint" aria-live="polite">
            {start ? t('Pick the end date') : t('Pick the start date')}
          </span>
          <div className="d-flex gap-1">
            {presets
              .filter((days) => !maxDays || days <= maxDays)
              .map((days) => (
                <button
                  key={days}
                  type="button"
                  className="btn btn-ghost btn-sm"
                  aria-label={t('Last {{n}} days', { n: days })}
                  onClick={() => onPick({ from: shiftIsoDate(lastDay, 1 - days), to: lastDay })}
                >
                  {t('{{n}}D', { n: days })}
                </button>
              ))}
          </div>
        </div>
      }
    />
  )
}

RangePanel.propTypes = {
  value: PropTypes.shape({ from: PropTypes.string, to: PropTypes.string }).isRequired,
  min: PropTypes.string,
  max: PropTypes.string,
  maxDays: PropTypes.number,
  presets: PropTypes.arrayOf(PropTypes.number).isRequired,
  autoFocus: PropTypes.bool.isRequired,
  onPick: PropTypes.func.isRequired,
}

// Themed date-range field: ONE input "DD-MM-YYYY – DD-MM-YYYY" (typed, or picked in the calendar:
// start, then end; or a "last n days" preset). Value / onChange use { from, to } "YYYY-MM-DD"; every
// change is kept valid (from ≤ to, within min / max and maxDays). A half-typed range is not sent.
function DateRangePicker({ id, value, onChange, min, max, maxDays, presets = DEFAULT_PRESETS, isInvalid = false, disabled = false }) {
  const [text, setText] = useState(() => isoRangeToText(value))
  const [syncedValue, setSyncedValue] = useState(value)
  const limits = { min, max, maxDays }
  const { t } = useTranslation()

  // Value changed from outside → show it
  if (!sameRange(value, syncedValue)) {
    setSyncedValue(value)
    setText(isoRangeToText(value))
  }

  const send = (range) => {
    const next = normalizeRange(range, limits)
    if (!sameRange(next, value)) onChange(next)
    return next
  }

  const handleTextChange = (raw) => {
    const masked = maskDateRangeText(raw)
    setText(masked)
    const typed = dateRangeTextToIso(masked)
    if (typed) send(typed)
  }

  // Leaving the field: show the range in force (a half-typed or adjusted range is replaced)
  const handleBlur = () => setText(isoRangeToText(value))

  return (
    <PickerField
      id={id}
      text={text}
      onTextChange={handleTextChange}
      onBlur={handleBlur}
      isInvalid={isInvalid}
      disabled={disabled}
      placeholder={DATE_RANGE_PLACEHOLDER}
      maxLength={DATE_RANGE_TEXT_LENGTH}
      inputMode="numeric"
      icon="bi-calendar-range"
      toggleLabel={t('Choose date range')}
      panelLabel={t('Choose date range')}
      renderPanel={({ close, autoFocus }) => (
        <RangePanel
          value={value}
          min={min}
          max={max}
          maxDays={maxDays}
          presets={presets}
          autoFocus={autoFocus}
          onPick={(range) => {
            setText(isoRangeToText(send(range)))
            close({ returnFocus: true })
          }}
        />
      )}
    />
  )
}

DateRangePicker.propTypes = {
  id: PropTypes.string,
  value: PropTypes.shape({ from: PropTypes.string.isRequired, to: PropTypes.string.isRequired }).isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.string, // "YYYY-MM-DD"
  max: PropTypes.string, // "YYYY-MM-DD"
  maxDays: PropTypes.number,
  presets: PropTypes.arrayOf(PropTypes.number),
  isInvalid: PropTypes.bool,
  disabled: PropTypes.bool,
}

export default DateRangePicker
