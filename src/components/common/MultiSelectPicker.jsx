import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Dropdown, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'

// Field text: the placeholder, "All …", or the picked labels (the field truncates them; the count pill
// beside them says how many there are)
const summary = (pickedOptions, options, placeholder, noun) => {
  if (!pickedOptions.length) return placeholder
  if (pickedOptions.length > 1 && pickedOptions.length === options.length) return `All ${noun.many}`
  return pickedOptions.map((option) => option.label).join(', ')
}

// Consecutive options of one group (options come in group order); one unnamed group without groups
const toGroups = (list) =>
  list.reduce((groups, option) => {
    const last = groups[groups.length - 1]
    if (last && last.name === option.group) last.options.push(option)
    else groups.push({ name: option.group, options: [option] })
    return groups
  }, [])

// Searchable multi-select (the MachinePicker dropdown with a search box): pick any number of
// options at once. Options may carry a `group` (e.g. the country of a state): consecutive options
// of one group get a heading. value = picked option values, kept in option order. The open list has
// a search, an "All" row and a footer with the count and Clear; the picked options are listed below
// the field as neutral chips (under the same group headings), each removable.
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
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const picked = useMemo(() => new Set(value), [value])

  // Closing resets the search and reports the blur (validation)
  const setMenuOpen = useCallback(
    (next) => {
      setOpen(next)
      if (next) return
      setSearch('')
      onBlur?.()
    },
    [onBlur],
  )

  // The open state is kept here, so the list closes on any press outside it (pointerdown always
  // fires, unlike Bootstrap's click-based outside check, which can miss a press that starts inside).
  useEffect(() => {
    if (!open) return undefined
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown, true)
    return () => document.removeEventListener('pointerdown', handlePointerDown, true)
  }, [open, setMenuOpen])

  const term = search.trim().toLowerCase()
  const shown = useMemo(
    () =>
      term
        ? options.filter((option) => option.label.toLowerCase().includes(term) || option.group?.toLowerCase().includes(term))
        : options,
    [options, term],
  )
  const shownPickedCount = shown.filter((option) => picked.has(option.value)).length
  const allShownPicked = shown.length > 0 && shownPickedCount === shown.length

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
  const pickedGroups = toGroups(pickedOptions)
  const countLabel = (count) => `${count} ${count === 1 ? noun.one : noun.many}`

  return (
    <>
      <Dropdown
        ref={rootRef}
        show={open}
        autoClose="outside"
        onToggle={(next) => next !== open && setMenuOpen(next)}
        // Tabbing to a control outside the picker closes it too (a press is handled above). Focus that
        // moves to an ancestor (a click on a list row focuses the modal dialog) is not leaving it.
        onBlur={(event) => {
          const next = event.relatedTarget
          if (open && next && !event.currentTarget.contains(next) && !next.contains(event.currentTarget)) setMenuOpen(false)
        }}
      >
        <Dropdown.Toggle
          id={id}
          variant=""
          disabled={disabled || !options.length}
          className={`form-select ts-select-toggle text-start${isInvalid ? ' is-invalid' : ''}`}
        >
          <span className="ts-multi-toggle">
            <span className={`text-truncate${value.length ? '' : ' text-body-tertiary'}`}>
              {options.length ? summary(pickedOptions, options, placeholder, noun) : emptyText}
            </span>
            {value.length > 1 && (
              <span className="ts-multi-count" aria-label={`${countLabel(value.length)} selected`}>
                {value.length}
              </span>
            )}
          </span>
        </Dropdown.Toggle>

        <Dropdown.Menu className="ts-multi-menu w-100">
          <div className="ts-multi-menu-search">
            <i className="bi bi-search" aria-hidden="true" />
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

          <div className="ts-multi-menu-list">
            {shown.length > 1 && (
              <Form.Check
                id={`${id}-all`}
                className="ts-multi-menu-all"
                label={
                  <>
                    <span>{term ? `All ${shown.length} shown` : `All ${noun.many}`}</span>
                    <span className="ts-multi-menu-meta">
                      {shownPickedCount}/{shown.length}
                    </span>
                  </>
                }
                checked={allShownPicked}
                // Some but not all picked: a dash instead of a tick
                ref={(input) => {
                  if (input) input.indeterminate = shownPickedCount > 0 && !allShownPicked
                }}
                onChange={toggleShown}
              />
            )}

            {shown.length ? (
              shown.map((option, index) => (
                <Fragment key={option.value}>
                  {option.group && option.group !== shown[index - 1]?.group && (
                    <div className="ts-multi-menu-group" role="presentation">
                      {option.group}
                    </div>
                  )}
                  <Form.Check
                    className={`ts-multi-option${picked.has(option.value) ? ' is-checked' : ''}`}
                    id={`${id}-${index}-${option.label}`}
                    label={option.label}
                    checked={picked.has(option.value)}
                    onChange={() => toggle(option.value)}
                  />
                </Fragment>
              ))
            ) : (
              <div className="ts-multi-menu-empty">
                <i className="bi bi-search" aria-hidden="true" />
                No {noun.many} match “{search.trim()}”.
              </div>
            )}
          </div>

          <div className="ts-multi-menu-foot">
            <span aria-live="polite">{value.length ? `${countLabel(value.length)} selected` : 'None selected'}</span>
            <Button variant="link" size="sm" className="ts-multi-clear" onClick={() => onChange([])} disabled={disabled || !value.length}>
              Clear
            </Button>
          </div>
        </Dropdown.Menu>
      </Dropdown>

      {pickedOptions.length > 0 && (
        <div className="ts-multi-picked">
          <div className="ts-multi-picked-head">
            <span className="ts-multi-picked-title">
              Selected
              <span className="ts-multi-count">{pickedOptions.length}</span>
            </span>
            {pickedOptions.length > 1 && (
              <Button variant="link" size="sm" className="ts-multi-clear" onClick={() => onChange([])} disabled={disabled}>
                <i className="bi bi-x-circle me-1" aria-hidden="true" />
                Clear all
              </Button>
            )}
          </div>
          <div className="ts-multi-picked-body">
            {pickedGroups.map((group) => (
              <div key={group.name ?? ''} className="ts-multi-picked-group">
                {group.name && (
                  <div className="ts-multi-picked-group-label">
                    <span className="text-truncate">{group.name}</span>
                    <span className="ts-multi-picked-group-count">{group.options.length}</span>
                  </div>
                )}
                <ul className="ts-multi-chips" aria-label={group.name ? `Selected ${noun.many} of ${group.name}` : `Selected ${noun.many}`}>
                  {group.options.map((option) => (
                    <li key={option.value} className="ts-multi-chip" title={option.label}>
                      <span className="text-truncate">{option.label}</span>
                      <Button
                        variant=""
                        className="ts-multi-chip-remove"
                        onClick={() => toggle(option.value)}
                        disabled={disabled}
                        aria-label={`Remove ${option.label}${option.group ? `, ${option.group}` : ''}`}
                      >
                        <i className="bi bi-x" aria-hidden="true" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
