import { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { CloseButton } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const ICONS = {
  success: 'bi-check-circle-fill',
  error: 'bi-x-octagon-fill',
  warning: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle-fill',
}

// One toast: auto-dismisses after `duration` ms, pauses while hovered or focused.
function ToastItem({ toast, onDismiss }) {
  const { id, type, title, message, duration, leaving } = toast
  const [paused, setPaused] = useState(false)
  const { t } = useTranslation()
  const remaining = useRef(duration)
  const startedAt = useRef(0)
  const progressRef = useRef(null)
  const progressAnim = useRef(null)

  const close = useCallback(() => onDismiss(id), [id, onDismiss])

  useEffect(() => {
    if (!duration || paused || leaving) return undefined
    startedAt.current = Date.now()
    const timer = setTimeout(close, remaining.current)
    return () => {
      clearTimeout(timer)
      remaining.current -= Date.now() - startedAt.current
    }
  }, [duration, paused, leaving, close])

  // Progress bar shrinks over the toast's lifetime (Web Animations API — no inline styles)
  useEffect(() => {
    if (!duration || !progressRef.current) return undefined
    progressAnim.current = progressRef.current.animate(
      [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }],
      { duration, easing: 'linear', fill: 'forwards' },
    )
    return () => progressAnim.current?.cancel()
  }, [duration])

  useEffect(() => {
    if (paused) progressAnim.current?.pause()
    else progressAnim.current?.play()
  }, [paused])

  const pause = () => setPaused(true)
  const resume = () => setPaused(false)

  return (
    <div
      className={`toast show ts-toast ts-toast-${type}${leaving ? ' is-leaving' : ''}${paused ? ' is-paused' : ''}`}
      role={type === 'error' ? 'alert' : 'status'}
      aria-atomic="true"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <div className="toast-body">
        <i className={`bi ${ICONS[type]} ts-toast-icon`} aria-hidden="true" />
        <div className="ts-toast-content">
          {title && <div className="ts-toast-title">{title}</div>}
          <div className="ts-toast-message">{message}</div>
        </div>
        <CloseButton className="ts-toast-close" onClick={close} aria-label={t('Dismiss notification')} />
      </div>
      {duration > 0 && <div ref={progressRef} className="ts-toast-progress" />}
    </div>
  )
}

ToastItem.propTypes = {
  toast: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
    title: PropTypes.string,
    message: PropTypes.node.isRequired,
    duration: PropTypes.number.isRequired,
    leaving: PropTypes.bool,
  }).isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default ToastItem
