import { Fragment, useMemo, useState } from 'react'
import { Button, Dropdown, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'

const summary = (picked, options, placeholder, noun) => {
  if (!picked.length) return placeholder
  if (picked.length === 1) return options.find((option) => option.value === picked[0])?.label ?? `1 ${noun.one} selected`
  if (picked.length === options.length) return `All ${noun.many}`
  return `${picked.length} ${noun.many} selected`
}

// Searchable multi-select (the MachinePicker dropdown with a search box): pick any number of
// options at once. Options may carry a `group` (e.g. the country of a state): consecutive options
// of one group get a heading. value = picked option values, kept in option order. The picked
// options are listed below the field as chips, each removable.
function MultiSelectPicker({
  id,
  options,
  value,
  onChange,
  onBlur,
  noun,
  placeholder = 'Select',
  emptyText = 'Nothing to select',
  disabled = false,
  isInvalid = false,
}) {
  const [search, setSearch] = useState('')
  const picked = useMemo(() => new Set(value), [value])

  const term = search.trim().toLowerCase()
  const shown = useMemo(
    () =>
      term
        ? options.filter((option) => option.label.toLowerCase().includes(term) || option.group?.toLowerCase().includes(term))
        : options,
    [options, term],
  )
  const allShownPicked = shown.length > 0 && shown.every((option) => picked.has(option.value))

  // Always in option order, so the saved order does not depend on the click order
  const emit = (next) => onChange(options.filter((option) => next.has(option.value)).map((option) => option.value))

  const toggle = (optionValue) => {
    const next = new Set(picked)
    if (next.has(optionValue)) next.delete(optionValue)
    else next.add(optionValue)
    emit(next)
  }

  // Select / clear every option the search shows (all of them without a search)
  const toggleShown = () => {
    const next = new Set(picked)
    shown.forEach((option) => (allShownPicked ? next.delete(option.value) : next.add(option.value)))
    emit(next)
  }

  const pickedOptions = options.filter((option) => picked.has(option.value))

  return (
    <>
      <Dropdown
        autoClose="outside"
        onToggle={(open) => {
          if (open) return
          setSearch('')
          onBlur?.()
        }}
      >
        <Dropdown.Toggle
          id={id}
          variant=""
          disabled={disabled || !options.length}
          className={`form-select ts-select-toggle text-start text-truncate${isInvalid ? ' is-invalid' : ''}`}
        >
          <span className="ts-multi-toggle">
            <span className={`text-truncate${value.length ? '' : ' text-body-tertiary'}`}>
              {options.length ? summary(value, options, placeholder, noun) : emptyText}
            </span>
            {value.length > 1 && <span className="ts-filter-count">{value.length}</span>}
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="ts-check-menu ts-multi-menu w-100">
          <div className="ts-multi-menu-search">
            <Form.Control
              type="search"
              size="sm"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => event.key === ' ' && event.stopPropagation()}
              placeholder={`Search ${noun.many}…`}
              aria-label={`Search ${noun.many}`}
              autoComplete="off"
            />
          </div>
          {shown.length > 1 && (
            <div className="ts-check-menu-all">
              <Form.Check
                id={`${id}-all`}
                label={term ? `All ${shown.length} shown` : `All ${noun.many}`}
                checked={allShownPicked}
                onChange={toggleShown}
              />
            </div>
          )}
          {shown.length ? (
            <div>
              {shown.map((option, index) => (
                <Fragment key={option.value}>
                  {option.group && option.group !== shown[index - 1]?.group && (
                    <div className="ts-multi-menu-group">{option.group}</div>
                  )}
                  <Form.Check
                    className={picked.has(option.value) ? 'is-checked' : undefined}
                    id={`${id}-${index}-${option.label}`}
                    label={option.label}
                    checked={picked.has(option.value)}
                    onChange={() => toggle(option.value)}
                  />
                </Fragment>
              ))}
            </div>
          ) : (
            <div className="ts-multi-menu-empty">No {noun.many} match “{search.trim()}”.</div>
          )}
        </Dropdown.Menu>
      </Dropdown>

      {pickedOptions.length > 0 && (
        <div className="ts-multi-picked">
          <div className="ts-multi-picked-head">
            <span>
              {pickedOptions.length} {pickedOptions.length === 1 ? noun.one : noun.many} selected
            </span>
            {pickedOptions.length > 1 && (
              <Button variant="link" size="sm" className="p-0" onClick={() => onChange([])} disabled={disabled}>
                Clear all
              </Button>
            )}
          </div>
          <ul className="ts-multi-chips" aria-label={`Selected ${noun.many}`}>
          {pickedOptions.map((option) => (
            <li key={option.value} className="ts-multi-chip">
              <span className="text-truncate">
                {option.label}
                {option.group && <span className="text-body-tertiary"> · {option.group}</span>}
              </span>
              <Button
                variant=""
                className="ts-multi-chip-remove"
                onClick={() => toggle(option.value)}
                disabled={disabled}
                aria-label={`Remove ${option.label}`}
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
              </Button>
            </li>
          ))}
          </ul>
        </div>
      )}
    </>
  )
}

MultiSelectPicker.propTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string.isRequired, group: PropTypes.string }),
  ).isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  // Wording: { one: 'country', many: 'countries' }
  noun: PropTypes.shape({ one: PropTypes.string.isRequired, many: PropTypes.string.isRequired }).isRequired,
  placeholder: PropTypes.string,
  emptyText: PropTypes.string,
  disabled: PropTypes.bool,
  isInvalid: PropTypes.bool,
}

export default MultiSelectPicker
