import { useId, useRef, useState } from 'react'
import { Overlay, Popover } from 'react-bootstrap'
import PropTypes from 'prop-types'

// Field help: an (i) button that opens a popover with a title, description, example and rules.
// Opens on hover, keyboard focus and tap; closes on leave, blur or Escape.
// Pass a help entry straight through: <InfoTooltip {...FIELD_HELP.gstNo} />
function InfoTooltip({ title, content, example, rules, placement = 'right' }) {
  const [show, setShow] = useState(false)
  const target = useRef(null)
  const popoverId = useId()

  const open = () => setShow(true)
  const close = () => setShow(false)

  return (
    <>
      <button
        ref={target}
        type="button"
        className="ts-help-trigger"
        aria-label={`Help: ${title}`}
        aria-expanded={show}
        aria-describedby={show ? popoverId : undefined}
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={close}
        onClick={open}
        onKeyDown={(event) => event.key === 'Escape' && close()}
      >
        <i className="bi bi-info-circle" aria-hidden="true" />
      </button>
      <Overlay target={target} show={show} placement={placement} flip>
        <Popover id={popoverId} className="ts-help" role="tooltip">
          <Popover.Header>
            <i className="bi bi-info-circle" aria-hidden="true" />
            {title}
          </Popover.Header>
          <Popover.Body>
            <div>{content}</div>
            {example && (
              <div>
                <div className="ts-help-label">Example</div>
                <code className="ts-help-example">{example}</code>
              </div>
            )}
            {rules?.length > 0 && (
              <div>
                <div className="ts-help-label">Rules</div>
                <ul className="ts-help-rules">
                  {rules.map((rule) => (
                    <li key={rule}>
                      <i className="bi bi-check2" aria-hidden="true" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Popover.Body>
        </Popover>
      </Overlay>
    </>
  )
}

InfoTooltip.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  example: PropTypes.string,
  rules: PropTypes.arrayOf(PropTypes.string),
  placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right', 'auto']),
}

export default InfoTooltip
