import { useId, useRef, useState } from 'react'
import { Overlay, Popover } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { translateText } from '@/i18n/tk'

// Field help: an (i) button that opens a popover with a title, description, example and rules.
// Opens on hover, keyboard focus and tap; closes on leave, blur or Escape.
// Pass a help entry straight through: <InfoTooltip {...FIELD_HELP.gstNo} />. Title, content and
// rules are English keys (tk() in the <page>Help.js files), shown translated; the example is not.
function InfoTooltip({ title, content, example, rules, placement = 'right' }) {
  const [show, setShow] = useState(false)
  const target = useRef(null)
  const popoverId = useId()
  const { t } = useTranslation()
  const text = (value) => translateText(t, value)

  const open = () => setShow(true)
  const close = () => setShow(false)

  return (
    <>
      <button
        ref={target}
        type="button"
        className="ts-help-trigger"
        aria-label={t('Help: {{topic}}', { topic: t(title) })}
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
            {t(title)}
          </Popover.Header>
          <Popover.Body>
            <div>{text(content)}</div>
            {example && (
              <div>
                <div className="ts-help-label">{t('Example')}</div>
                <code className="ts-help-example">{example}</code>
              </div>
            )}
            {rules?.length > 0 && (
              <div>
                <div className="ts-help-label">{t('Rules')}</div>
                <ul className="ts-help-rules">
                  {rules.map((rule) => (
                    <li key={rule}>
                      <i className="bi bi-check2" aria-hidden="true" />
                      <span>{text(rule)}</span>
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
