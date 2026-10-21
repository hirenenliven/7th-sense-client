import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

// Active / Inactive segmented control for forms. Two radios, so it takes a React Hook Form
// registration as is: <StatusToggle id="shift-status" {...register('status')} />
function StatusToggle({
  ref,
  id,
  name,
  onChange,
  onBlur,
  activeValue = 'active',
  inactiveValue = 'inactive',
  isInvalid = false,
  disabled = false,
  label,
}) {
  const { t } = useTranslation()
  const options = [
    { value: activeValue, label: t('Active'), tone: 'is-active' },
    { value: inactiveValue, label: t('Inactive'), tone: 'is-inactive' },
  ]

  return (
    <div className={`ts-status-toggle${isInvalid ? ' is-invalid' : ''}`} role="radiogroup" aria-label={label ?? t('Status')}>
      {options.map((option) => (
        <label key={option.value} className={`ts-status-option ${option.tone}`} htmlFor={`${id}-${option.value}`}>
          <input
            ref={ref}
            type="radio"
            className="ts-status-input"
            id={`${id}-${option.value}`}
            name={name}
            value={option.value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
          />
          <span className="ts-status-dot" aria-hidden="true" />
          {option.label}
        </label>
      ))}
    </div>
  )
}

StatusToggle.propTypes = {
  ref: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  activeValue: PropTypes.string,
  inactiveValue: PropTypes.string,
  isInvalid: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.string,
}

export default StatusToggle
