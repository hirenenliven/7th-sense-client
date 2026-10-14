import { useId, useRef, useState } from 'react'
import { Form, Overlay } from 'react-bootstrap'
import PropTypes from 'prop-types'

// Gap between the field and its popup (matches $ts-picker-offset)
const POPPER_CONFIG = { modifiers: [{ name: 'offset', options: { offset: [0, 4] } }] }

const assignRef = (ref, node) => {
  if (typeof ref === 'function') ref(node)
  else if (ref) ref.current = node
}

// Text field + icon button that opens a themed popup — the base of DatePicker and TimePicker.
// Typing stays possible; the popup opens on a field click, the icon button or Alt+↓, and closes
// on Esc, an outside click or when focus leaves. `renderPanel({ close, autoFocus })` draws it.
function PickerField({
  inputRef,
  id,
  name,
  text,
  onTextChange,
  onBlur,
  isInvalid = false,
  disabled = false,
  placeholder,
  maxLength,
  inputMode,
  icon,
  toggleLabel,
  panelLabel,
  renderPanel,
}) {
  const [open, setOpen] = useState(false)
  const [autoFocus, setAutoFocus] = useState(false)
  const wrapperRef = useRef(null)
  const inputNode = useRef(null)
  const panelNode = useRef(null)
  const panelId = useId()

  const show = (focusPanel) => {
    if (disabled) return
    setAutoFocus(focusPanel)
    setOpen(true)
  }

  // returnFocus: back to the field after a pick or Esc, so Tab carries on from here
  const close = ({ returnFocus = false } = {}) => {
    setOpen(false)
    if (returnFocus) inputNode.current?.focus()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && open) {
      event.stopPropagation() // keep an enclosing Modal open
      close({ returnFocus: true })
    } else if (event.key === 'ArrowDown' && event.altKey && event.target === inputNode.current) {
      event.preventDefault()
      show(true)
    }
  }

  // Focus moved to something outside the field and its popup
  const handleBlur = (event) => {
    const next = event.relatedTarget
    if (!next || wrapperRef.current?.contains(next) || panelNode.current?.contains(next)) return
    setOpen(false)
  }

  // Outside click / Esc from the Overlay; clicks on the field itself are handled by the field
  const handleHide = (event) => {
    if (event?.type !== 'keyup' && wrapperRef.current?.contains(event?.target)) return
    setOpen(false)
  }

  return (
    <div
      ref={wrapperRef}
      className={`ts-picker${isInvalid ? ' is-invalid' : ''}${open ? ' is-open' : ''}`}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      <Form.Control
        ref={(node) => {
          inputNode.current = node
          assignRef(inputRef, node)
        }}
        id={id}
        name={name}
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        onBlur={onBlur}
        onClick={() => show(false)}
        isInvalid={isInvalid}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        autoComplete="off"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
      />
      <button
        type="button"
        className="ts-picker-toggle"
        onClick={() => (open ? close() : show(true))}
        disabled={disabled}
        aria-label={toggleLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <i className={`bi ${icon}`} aria-hidden="true" />
      </button>

      <Overlay
        target={wrapperRef}
        show={open}
        placement="bottom-start"
        flip
        rootClose
        onHide={handleHide}
        transition={false}
        popperConfig={POPPER_CONFIG}
      >
        {({ ref, style, hasDoneInitialMeasure }) => (
          <div
            ref={(node) => {
              panelNode.current = node
              assignRef(ref, node)
            }}
            style={style}
            id={panelId}
            role="dialog"
            aria-label={panelLabel}
            className={`ts-picker-pop${hasDoneInitialMeasure ? ' is-ready' : ''}`}
          >
            {renderPanel({ close, autoFocus })}
          </div>
        )}
      </Overlay>
    </div>
  )
}

PickerField.propTypes = {
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  id: PropTypes.string,
  name: PropTypes.string,
  text: PropTypes.string.isRequired,
  onTextChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  isInvalid: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  inputMode: PropTypes.string,
  icon: PropTypes.string.isRequired,
  toggleLabel: PropTypes.string.isRequired,
  panelLabel: PropTypes.string.isRequired,
  renderPanel: PropTypes.func.isRequired,
}

export default PickerField
