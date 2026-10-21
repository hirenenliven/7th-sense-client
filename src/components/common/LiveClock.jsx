import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { CLOCK_TICK_MS } from '@/constants/app'
import { formatClockTime, formatLongDate } from '@/utils/helpers'

function LiveClock({ className = '' }) {
  const [now, setNow] = useState(() => new Date())
  const { i18n } = useTranslation()
  // English keeps the default formats; other languages show weekday / month names in that language
  const locale = i18n.resolvedLanguage === 'en' ? undefined : i18n.resolvedLanguage

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), CLOCK_TICK_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <time className={`ts-clock ${className}`} dateTime={now.toISOString()}>
      {formatClockTime(now, locale)} <span className="text-primary">{formatLongDate(now, locale)}</span>
    </time>
  )
}

LiveClock.propTypes = {
  className: PropTypes.string,
}

export default LiveClock
