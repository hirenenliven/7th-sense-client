import { useEffect, useState } from 'react'
import { CLOCK_TICK_MS } from '@/constants/app'
import { formatOrdinalDate, formatTime12, formatWeekday } from '@/utils/helpers'

// "9:34:30 AM \ 13th, October, 2026" over the weekday, top-left of the login screen
function LoginClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), CLOCK_TICK_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <time className="ts-login-clock" dateTime={now.toISOString()}>
      <span className="ts-login-clock-line">
        {formatTime12(now)}
        <span className="ts-login-clock-sep" aria-hidden="true">
          \
        </span>
        {formatOrdinalDate(now)}
      </span>
      <span className="ts-login-clock-day">{formatWeekday(now)}</span>
    </time>
  )
}

export default LoginClock
