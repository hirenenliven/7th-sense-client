import { useEffect, useState } from 'react'
import { Alert, Button, ButtonGroup, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import ChartCard from '@/components/charts/ChartCard'
import ChartDateFilter from '@/components/charts/ChartDateFilter'
import ModeGanttChart from '@/components/charts/ModeGanttChart'
import Loader from '@/components/common/Loader'
import { UNKNOWN_MODE_COLOR, modeTypeOf } from '@/constants/machines'
import useLoad from '@/hooks/useLoad'
import { getModeTimeline } from '@/services/productivityService'
import { formatModeDuration, todayIso } from '@/utils/dateTime'
import {
  DEFAULT_TIMELINE_RANGE,
  TIMELINE_HISTORY,
  TIMELINE_POLL_MS,
  TIMELINE_RANGES,
  TIMELINE_TICK_MS,
  TIMELINE_ZOOMS,
} from './productivitySettings'

const MINUTE = 60_000
const readoutTime = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' })
const readoutClock = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })

// Machine Mode Timeline: the machine's modes as a Gantt chart over the last N minutes (sliding with
// the clock) or, with History, over a whole day. Live windows reload every TIMELINE_POLL_MS (new
// mode changes) and the open period grows every second on the server's clock (offset kept from the
// response's serverTime). The readout shows the hovered period, else the current one.
function ModeTimelineCard({ machineId, min }) {
  const today = todayIso()
  const [range, setRange] = useState(DEFAULT_TIMELINE_RANGE)
  // Empty = today, so History on today moves to the new day by itself
  const [pickedDate, setPickedDate] = useState('')
  const date = pickedDate || today
  const [zoom, setZoom] = useState(TIMELINE_ZOOMS[0])
  const [hovered, setHovered] = useState(null)
  const [clientNow, setClientNow] = useState(() => Date.now())
  const history = range === TIMELINE_HISTORY
  const live = !history || !pickedDate
  const query = history ? { date } : { minutes: range }

  const { data, loading, error } = useLoad(
    async () => ({ ...(await getModeTimeline(machineId, query)), receivedAt: Date.now() }),
    `${machineId}|${history ? date : range}`,
    { refreshMs: live ? TIMELINE_POLL_MS : undefined },
  )

  useEffect(() => {
    if (!live) return undefined
    const timer = setInterval(() => setClientNow(Date.now()), TIMELINE_TICK_MS)
    return () => clearInterval(timer)
  }, [live])

  // Server time now: its clock at the response plus the time passed here since
  const now = data ? Date.parse(data.serverTime) + Math.max(0, clientNow - data.receivedAt) : clientNow
  // A "last N minutes" window slides with the clock; a day stays put
  const windowTo = history ? Date.parse(data?.to ?? 0) : now
  const windowFrom = history ? Date.parse(data?.from ?? 0) : now - range * MINUTE

  const current = live ? data?.periods.at(-1) : null
  const shown = hovered ?? current
  const shownEnd = shown && (shown.endedAt ? Date.parse(shown.endedAt) : now)
  const shownStart = shown && Date.parse(shown.startedAt)
  const zoomIndex = TIMELINE_ZOOMS.indexOf(zoom)

  const pickRange = (value) => {
    setRange(value === TIMELINE_HISTORY ? value : Number(value))
    setZoom(TIMELINE_ZOOMS[0])
    setHovered(null)
  }

  const renderBody = () => {
    if (loading) return <Loader text="Loading machine modes…" />
    if (error && !data) return <Alert variant="danger" className="mb-0">{error}</Alert>
    return (
      <ModeGanttChart
        periods={data?.periods ?? []}
        from={windowFrom}
        to={windowTo}
        now={now}
        zoom={zoom}
        live={live}
        onHover={setHovered}
      />
    )
  }

  return (
    <ChartCard
      title="Machine Mode Timeline"
      subtitle={live ? 'Gantt · live, the current mode grows every second' : 'Gantt · machine modes through the day'}
      icon="bi-bar-chart-steps"
      actions={
        live && (
          <span className="d-inline-flex align-items-center gap-2 small text-body-secondary">
            <i className="ts-dot ts-dot-live text-success" aria-hidden="true" />
            Live
          </span>
        )
      }
    >
      <div className="ts-gantt-toolbar">
        <Form.Select className="w-auto" value={range} onChange={(event) => pickRange(event.target.value)} aria-label="Time range">
          {TIMELINE_RANGES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          <option value={TIMELINE_HISTORY}>Whole day (history)</option>
        </Form.Select>
        {history && (
          <ChartDateFilter
            value={date}
            onChange={(value) => setPickedDate(value === today ? '' : value)}
            min={min}
            max={today}
            label="Mode timeline date"
          />
        )}
        <ButtonGroup aria-label="Zoom">
          <Button variant="ghost" disabled={zoomIndex <= 0} onClick={() => setZoom(TIMELINE_ZOOMS[zoomIndex - 1])} aria-label="Zoom out">
            <i className="bi bi-zoom-out" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            disabled={zoomIndex >= TIMELINE_ZOOMS.length - 1}
            onClick={() => setZoom(TIMELINE_ZOOMS[zoomIndex + 1])}
            aria-label="Zoom in"
          >
            <i className="bi bi-zoom-in" aria-hidden="true" />
          </Button>
        </ButtonGroup>
        <div className="ts-gantt-info">
          <span>
            Program Name : <b>{data?.programName || '—'}</b>
          </span>
          <span className="ts-gantt-info-sep">|</span>
          <span>
            OP Mode: <b>{data?.opMode || '—'}</b>
          </span>
          <Button
            variant="link"
            size="sm"
            className="p-0 text-uppercase fw-semibold text-decoration-none"
            onClick={() => pickRange(history ? DEFAULT_TIMELINE_RANGE : TIMELINE_HISTORY)}
          >
            <i className={`bi ${history ? 'bi-broadcast' : 'bi-clock-history'} me-1`} aria-hidden="true" />
            {history ? 'Live' : 'History'}
          </Button>
        </div>
        <div className="ts-gantt-readout" aria-live="polite">
          {shown ? (
            <>
              <svg className="ts-gantt-pill" viewBox="0 0 6 20" aria-hidden="true">
                <rect width="6" height="20" rx="3" fill={modeTypeOf(shown.modeId)?.color ?? UNKNOWN_MODE_COLOR} />
              </svg>
              <span>{shown.modeName || modeTypeOf(shown.modeId)?.label}</span>
              <b className="font-tabular">
                {readoutTime.format(shownStart)} {readoutClock.format(shownStart)} — {readoutClock.format(shownEnd)} -{' '}
                {formatModeDuration((shownEnd - shownStart) / 1000)}
              </b>
            </>
          ) : (
            <span>Hover a bar for its mode and time.</span>
          )}
        </div>
      </div>
      {renderBody()}
    </ChartCard>
  )
}

ModeTimelineCard.propTypes = {
  machineId: PropTypes.number.isRequired,
  min: PropTypes.string.isRequired,
}

export default ModeTimelineCard
