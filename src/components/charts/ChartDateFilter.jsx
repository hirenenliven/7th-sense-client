import { memo, useId } from 'react'
import PropTypes from 'prop-types'
import DatePicker from '@/components/common/DatePicker'
import DateRangePicker from '@/components/common/DateRangePicker'

// Date filter for a chart card header (ChartCard `actions`): one field either way, same look.
// - mode "single": DatePicker, value "YYYY-MM-DD" (a half-typed date is ignored);
// - mode "range": DateRangePicker, value { from, to } — kept valid (from ≤ to, at most maxDays days).
// min / max bound every pick (e.g. max = today).
function ChartDateFilter({ mode = 'single', value, onChange, min, max, maxDays, label = 'Date' }) {
  const id = useId()
  const isRange = mode === 'range'

  return (
    <div className={isRange ? 'ts-chart-date ts-chart-date-range' : 'ts-chart-date'}>
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      {isRange ? (
        <DateRangePicker id={id} value={value} onChange={onChange} min={min} max={max} maxDays={maxDays} />
      ) : (
        <DatePicker id={id} value={value} min={min} max={max} onChange={(iso) => iso && onChange(iso)} />
      )}
    </div>
  )
}

const isoDate = PropTypes.string

ChartDateFilter.propTypes = {
  mode: PropTypes.oneOf(['single', 'range']),
  value: PropTypes.oneOfType([isoDate, PropTypes.shape({ from: isoDate.isRequired, to: isoDate.isRequired })])
    .isRequired,
  onChange: PropTypes.func.isRequired,
  min: isoDate,
  max: isoDate,
  maxDays: PropTypes.number,
  label: PropTypes.string,
}

export default memo(ChartDateFilter)
