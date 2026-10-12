import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { CLOCK_TICK_MS } from '@/constants/app'
import { formatClockTime, formatLongDate } from '@/utils/helpers'

function LiveClock({ className = '' }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), CLOCK_TICK_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <time className={`ts-clock ${className}`} dateTime={now.toISOString()}>
      {formatClockTime(now)} <span className="text-primary">{formatLongDate(now)}</span>
    </time>
  )
}

LiveClock.propTypes = {
  className: PropTypes.string,
}

export default LiveClock
