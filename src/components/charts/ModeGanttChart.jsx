import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { MACHINE_MODE_TYPES, UNKNOWN_MODE_COLOR, modeTypeOf } from '@/constants/machines'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
// Tick steps tried in order; the first leaving MIN_TICK_GAP pixels between ticks is used
const TICK_STEPS = [10 * SECOND, 30 * SECOND, MINUTE, 2 * MINUTE, 5 * MINUTE, 10 * MINUTE, 15 * MINUTE, 30 * MINUTE, HOUR, 2 * HOUR, 3 * HOUR, 6 * HOUR]
const MIN_TICK_GAP = 110
const MIN_BAR_WIDTH = 2
const BAR_RADIUS = 3
const FOLLOW_SLACK = 40 // px from the right edge that still counts as "following now"

const clockWithSeconds = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
const clockMinutes = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

// Tick times from … to every `step`, on whole local minutes / hours (the time zone offset kept)
const ticksFor = (from, to, step) => {
  const offset = new Date(from).getTimezoneOffset() * MINUTE
  const ticks = []
  for (let time = Math.ceil((from - offset) / step) * step + offset; time <= to; time += step) ticks.push(time)
  return ticks
}

// Gantt chart of a machine's modes between `from` and `to` (ms): a time axis on top, an "all
// modes" row, then one row per machine_modes id (MACHINE_MODE_TYPES). An open period (endedAt null)
// runs up to `now`, so re-rendering with a later `now` grows it live. `zoom` widens the plot,
// which then scrolls sideways; while `live` it keeps following now unless scrolled back.
function ModeGanttChart({ periods, from, to, now, zoom = 1, live = false, onHover }) {
  const scrollRef = useRef(null)
  const followRef = useRef(true)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const element = scrollRef.current
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const plotWidth = width * zoom
  useEffect(() => {
    const element = scrollRef.current
    if (live && followRef.current && element) element.scrollLeft = element.scrollWidth
  }, [live, plotWidth, now])

  const span = Math.max(to - from, 1)
  const xOf = (time) => ((Math.min(Math.max(time, from), to) - from) / span) * plotWidth
  const bars = periods
    .map((period) => {
      const start = Math.max(Date.parse(period.startedAt), from)
      const end = Math.min(period.endedAt ? Date.parse(period.endedAt) : Math.max(now, start), to)
      return { ...period, start, end, open: !period.endedAt, color: modeTypeOf(period.modeId)?.color ?? UNKNOWN_MODE_COLOR }
    })
    .filter((bar) => bar.end > bar.start)
  const rows = MACHINE_MODE_TYPES.filter((mode) => !mode.optional || bars.some((bar) => bar.modeId === mode.id))
  const step = TICK_STEPS.find((candidate) => (candidate / span) * plotWidth >= MIN_TICK_GAP) ?? TICK_STEPS.at(-1)
  const clock = step < HOUR ? clockWithSeconds : clockMinutes
  const ticks = plotWidth ? ticksFor(from, to, step) : []
  const nowX = now > from && now < to ? xOf(now) : null

  const renderBars = (list) =>
    list.map((bar) => (
      <rect
        key={`${bar.id}-${bar.start}`}
        x={xOf(bar.start)}
        y="30%"
        width={Math.max(xOf(bar.end) - xOf(bar.start), MIN_BAR_WIDTH)}
        height="40%"
        rx={BAR_RADIUS}
        fill={bar.color}
        onMouseEnter={() => onHover?.(bar)}
        onMouseLeave={() => onHover?.(null)}
      />
    ))

  const renderTrack = (key, list, label) => (
    <svg key={key} className="ts-gantt-track" width={plotWidth} role="img" aria-label={label}>
      {renderBars(list)}
      {nowX != null && <line className="ts-gantt-now" x1={nowX} x2={nowX} y1="0" y2="100%" />}
    </svg>
  )

  return (
    <div className="ts-gantt">
      <div className="ts-gantt-labels">
        <div className="ts-gantt-axis-cell" />
        <div className="ts-gantt-label" />
        {rows.map((row) => (
          <div key={row.id} className="ts-gantt-label">
            <span>{row.label}</span>
            <svg className="ts-gantt-pill" viewBox="0 0 6 20" aria-hidden="true">
              <rect width="6" height="20" rx="3" fill={row.color} />
            </svg>
          </div>
        ))}
      </div>
      <div
        ref={scrollRef}
        className="ts-gantt-scroll"
        onScroll={(event) => {
          const element = event.currentTarget
          followRef.current = element.scrollLeft + element.clientWidth >= element.scrollWidth - FOLLOW_SLACK
        }}
      >
        {plotWidth > 0 && (
          <>
            <svg className="ts-gantt-axis" width={plotWidth} aria-hidden="true">
              {ticks.map((tick) => (
                <g key={tick}>
                  <line x1={xOf(tick)} x2={xOf(tick)} y1="72%" y2="100%" />
                  <text x={xOf(tick) + 4} y="62%">
                    {clock.format(tick)}
                  </text>
                </g>
              ))}
            </svg>
            {renderTrack('all', bars, 'All modes')}
            {rows.map((row) =>
              renderTrack(
                row.id,
                bars.filter((bar) => bar.modeId === row.id),
                row.label,
              ),
            )}
          </>
        )}
      </div>
    </div>
  )
}

ModeGanttChart.propTypes = {
  periods: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      modeId: PropTypes.number.isRequired,
      modeName: PropTypes.string,
      startedAt: PropTypes.string.isRequired,
      endedAt: PropTypes.string,
    }),
  ).isRequired,
  from: PropTypes.number.isRequired,
  to: PropTypes.number.isRequired,
  now: PropTypes.number.isRequired,
  zoom: PropTypes.number,
  live: PropTypes.bool,
  onHover: PropTypes.func,
}

export default memo(ModeGanttChart)
