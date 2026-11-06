import { useEffect, useState } from 'react'
import { Alert, Card } from 'react-bootstrap'
import PropTypes from 'prop-types'
import logo from '@/assets/images/seven-logo.svg'
import Loader from '@/components/common/Loader'
import useLoad from '@/hooks/useLoad'
import useMachineLive from '@/hooks/useMachineLive'
import { LIVE_CHANNELS, LIVE_CODES, LIVE_INTERVAL_MS, LIVE_RELOAD_EVENTS } from '@/constants/live'
import { modeTypeOf } from '@/constants/machines'
import { getVirtualScreen } from '@/services/productivityService'
import { PICKER_LOCALE, formatClock12, formatModeDuration } from '@/utils/dateTime'
import { formatCount, formatCycle } from './productivitySettings'
import { AxisLoadPanel, OverrideGauge, ScreenProgress, SpindleLoadGauge } from './VirtualScreenParts'
import {
  RUNNING_PROGRESS_CAP,
  STALE_AFTER_MS,
  VIRTUAL_SCREEN_REFRESH_MS,
  VIRTUAL_SCREEN_SAFETY_REFRESH_MS,
  VIRTUAL_SCREEN_TICK_MS,
  batchRemainingSec,
  cycleElapsed,
  formatReading,
  shareOf,
  withLiveValues,
} from './virtualScreenSettings'

const LIVE_OPTIONS = {
  codes: LIVE_CODES.VIRTUAL_SCREEN,
  intervalMs: LIVE_INTERVAL_MS.VIRTUAL_SCREEN,
  channels: [LIVE_CHANNELS.STATUS, LIVE_CHANNELS.EVENT],
}

const timeLabel = new Intl.DateTimeFormat(PICKER_LOCALE, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
const dateLabel = new Intl.DateTimeFormat(PICKER_LOCALE, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })

// Connection chip: Live (fresh values), Stale (online but nothing read for STALE_AFTER_MS) or Offline
function LiveChip({ online, stale, updatedAt }) {
  if (!online) {
    return (
      <span className="ts-chip ts-chip-muted">
        <i className="ts-dot text-body-secondary" aria-hidden="true" />
        Offline
      </span>
    )
  }
  if (stale) {
    return (
      <span className="ts-chip text-warning" title={updatedAt ? `Last read ${timeLabel.format(updatedAt)}` : undefined}>
        <i className="ts-dot" aria-hidden="true" />
        Stale{updatedAt ? ` · ${timeLabel.format(updatedAt)}` : ''}
      </span>
    )
  }
  return (
    <span className="ts-chip text-success">
      <i className="ts-dot ts-dot-live" aria-hidden="true" />
      Live
    </span>
  )
}

LiveChip.propTypes = {
  online: PropTypes.bool.isRequired,
  stale: PropTypes.bool.isRequired,
  updatedAt: PropTypes.instanceOf(Date),
}

// Message & Alarms: the last alarm (time, code, message), red while it or the E-stop is active,
// marked cleared once it went off
function AlarmList({ alarm, emergency }) {
  return (
    <div className="ts-vs-alarms">
      <h4 className="ts-vs-title">Message &amp; Alarms</h4>
      <ul className="list-unstyled mb-0">
        {emergency && (
          <li className="ts-vs-alarm is-active">
            <i className="bi bi-exclamation-octagon-fill" aria-hidden="true" />
            <span>Emergency stop pressed</span>
          </li>
        )}
        {alarm ? (
          <li className={`ts-vs-alarm${alarm.active ? ' is-active' : ''}`}>
            <span className="ts-vs-alarm-time font-tabular">{timeLabel.format(new Date(alarm.at))}</span>
            <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
            {alarm.code != null && <span className="font-tabular">{alarm.code}</span>}
            <span className="ts-vs-alarm-message">{alarm.message || 'Alarm'}</span>
            {!alarm.active && <span className="ts-vs-alarm-state">Cleared</span>}
          </li>
        ) : (
          !emergency && <li className="ts-vs-alarm">No alarm recorded</li>
        )}
      </ul>
    </div>
  )
}

AlarmList.propTypes = {
  alarm: PropTypes.shape({
    code: PropTypes.number,
    message: PropTypes.string,
    at: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
  }),
  emergency: PropTypes.bool.isRequired,
}

// "Label: value" row of the job box
function JobRow({ label, value }) {
  return (
    <div className="ts-vs-job-row">
      <span>{label}:</span>
      <span className="text-truncate">{value || '—'}</span>
    </div>
  )
}

JobRow.propTypes = { label: PropTypes.string.isRequired, value: PropTypes.node }

// One figure of the batch / cycle box: its label, then the value large in the box's colour
function BoxFigure({ label, value, rest }) {
  return (
    <div>
      {label}
      <span className="ts-vs-figure">
        <span className="ts-vs-figure-main font-tabular">{value}</span>
        {rest}
      </span>
    </div>
  )
}

BoxFigure.propTypes = { label: PropTypes.string.isRequired, value: PropTypes.node.isRequired, rest: PropTypes.node }

// Operations › Monitoring › a machine › Virtual Screen tab (MonitoringMachine passes the machine): the
// machine's controller screen, live. GET /productivity/virtual-screen gives the spindle load (gauge),
// spindle / feed overrides (dials), axis loads, the last alarm, the running cycle and its job; the
// live socket (ADR 0021) pushes the values, mode and program the moment they change, and an alarm /
// cycle event reloads the REST data. Without the socket the REST call is polled every
// VIRTUAL_SCREEN_REFRESH_MS. The clock, mode time and cycle progress move every second in between.
function VirtualScreen({ machine }) {
  // Called on a live event, after the first render: `reload` is set by then
  const liveFeed = useMachineLive(machine.id, {
    ...LIVE_OPTIONS,
    onEvent: (event) => LIVE_RELOAD_EVENTS.includes(event.type) && reload(),
  })
  const {
    data: screen,
    loading,
    error,
    reload,
  } = useLoad(
    () => getVirtualScreen(machine.id).then((result) => ({ ...result, readAt: Date.now() })),
    `virtual-screen|${machine.id}`,
    { refreshMs: liveFeed.connected ? VIRTUAL_SCREEN_SAFETY_REFRESH_MS : VIRTUAL_SCREEN_REFRESH_MS },
  )
  const data = withLiveValues(screen, liveFeed)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), VIRTUAL_SCREEN_TICK_MS)
    return () => clearInterval(timer)
  }, [])

  const controller = [machine.brandName, machine.controllerName, machine.controllerVersion].filter(Boolean).join(' ')

  const header = (chip) => (
    <div className="ts-tab-header">
      <div className="me-auto">
        <h2 className="ts-section-title">Virtual Screen</h2>
        <p className="ts-note mb-0">
          {[
            controller,
            liveFeed.connected
              ? 'live from the controller, as it changes'
              : `live from the controller, refreshed every ${VIRTUAL_SCREEN_REFRESH_MS / 1000} s`,
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>
      {chip}
    </div>
  )

  // The server refused the machine on the socket (no access), or took it away while watching
  if (liveFeed.denied) {
    return (
      <>
        {header(null)}
        <Alert variant="warning" className="mb-0">
          <b>You no longer have access to this machine.</b> Ask your administrator to assign it to you.
        </Alert>
      </>
    )
  }

  if (loading) {
    return (
      <>
        {header(null)}
        <Card>
          <Card.Body>
            <Loader text="Connecting to the machine…" />
          </Card.Body>
        </Card>
      </>
    )
  }

  if (!data) {
    return (
      <>
        {header(null)}
        <Alert variant="danger" className="mb-0">
          <b>Could not load the virtual screen.</b> {error}
        </Alert>
      </>
    )
  }

  const { live, cycle, job } = data
  // Server clock now: its time when read plus the time since (the machine's day, not the browser's)
  const serverNow = new Date(new Date(data.serverTime).getTime() + (now - data.readAt))
  const updatedAt = live.updatedAt ? new Date(live.updatedAt) : null
  const stale = !updatedAt || serverNow - updatedAt > STALE_AFTER_MS
  const programName = data.programName || cycle?.programName || ''

  const spindleLoad = live.spindleLoad == null ? null : Math.abs(live.spindleLoad)

  // Cycle: elapsed against the planned time; past the plan the bar holds and the overrun shows
  const elapsed = cycleElapsed(cycle, data.readAt, now)
  const planned = cycle?.standardCycleSec ?? null
  const cycleShare = cycle ? shareOf(elapsed, planned) : null
  const overrun = planned != null && elapsed > planned
  const cycleRemaining = planned == null ? '—' : formatCycle(Math.max(0, planned - elapsed))

  // Batch: completed cycles of the job against its quantity
  const batchShare = job ? shareOf(job.completedCycles, job.quantity) : null
  const batchRemaining = batchRemainingSec(job)
  const modeSeconds = data.modeSince ? (serverNow - new Date(data.modeSince)) / 1000 : null

  const toolLabel = live.toolNumber == null ? '—' : `T${Math.round(live.toolNumber)}`
  const modeMeta = [modeSeconds != null && `for ${formatModeDuration(modeSeconds)}`, data.opMode && `Op mode ${data.opMode}`]
    .filter(Boolean)
    .join(' · ')

  return (
    <>
      {header(<LiveChip online={data.online} stale={stale} updatedAt={updatedAt} />)}
      {error && (
        <Alert variant="warning" className="py-2 small">
          Could not refresh: {error}. Showing the values read at {timeLabel.format(new Date(data.readAt))}.
        </Alert>
      )}

      <section className="ts-vs-screen" aria-label="Virtual screen">
        <div className="ts-vs-top">
          <div className="ts-vs-top-left">
            <h2 className="ts-vs-machine text-truncate">{machine.name || `Machine #${machine.id}`}</h2>
            {controller && <span className="ts-vs-controller">{controller}</span>}
            <SpindleLoadGauge value={spindleLoad} />
          </div>

          <div className="ts-vs-top-right">
            <AlarmList alarm={data.alarm} emergency={live.emergency} />
            <div className="ts-vs-meters">
              <OverrideGauge title="Spindle" value={live.spindleOverride} tone="spindle">
                <span className="ts-vs-cap-label">RPM</span>
                <span className="ts-vs-cap-value font-tabular">
                  {formatReading(live.spindleSpeed == null ? null : Math.abs(live.spindleSpeed), 2)}
                </span>
              </OverrideGauge>
              <OverrideGauge title="Feed" value={live.feedOverride} tone="feed">
                <span className="ts-vs-cap-value font-tabular">{formatReading(live.feedRate, 2)}</span>
                <span className="ts-vs-cap-label">{live.feedUnit}</span>
              </OverrideGauge>
              <AxisLoadPanel live={live} />
            </div>
          </div>
        </div>

        <div className="ts-vs-boxes">
          <div className="ts-vs-box ts-vs-box-batch">
            <h4 className="ts-vs-title">Batch Progress</h4>
            <div className="ts-vs-box-figures">
              <BoxFigure
                label="Cycles"
                value={job ? formatCount(job.completedCycles) : '—'}
                rest={
                  job && (
                    <>
                      {' '}
                      <span className="ts-vs-sep">/</span> {formatCount(job.quantity)}
                    </>
                  )
                }
              />
              <BoxFigure
                label="Remaining Time"
                value={batchRemaining == null ? '—' : batchRemaining === 0 ? 'Done' : formatCycle(batchRemaining)}
              />
            </div>
            <ScreenProgress share={batchShare} tone="batch" label="Batch done" />
            <div className="ts-vs-box-foot">
              Batch Schedule Time:{' '}
              {job ? (
                <>
                  <span className="font-tabular">{formatClock12(job.startTime)}</span> to{' '}
                  <span className="font-tabular">{formatClock12(job.endTime)}</span>
                </>
              ) : (
                <span>Not Scheduled</span>
              )}
            </div>
          </div>

          <div className={`ts-vs-box ts-vs-box-cycle${overrun ? ' is-overrun' : ''}`}>
            <h4 className="ts-vs-title">Cycle Progress</h4>
            <div className="ts-vs-box-figures">
              <BoxFigure
                label={overrun ? 'Over Plan By' : 'Remaining Time'}
                value={!cycle ? '—' : overrun ? formatCycle(elapsed - planned) : cycleRemaining}
              />
              <BoxFigure label="Elapsed" value={cycle ? formatCycle(elapsed) : '—'} />
            </div>
            <ScreenProgress
              share={cycleShare == null ? null : Math.min(cycleShare, RUNNING_PROGRESS_CAP)}
              tone={overrun ? 'overrun' : 'cycle'}
              label={planned == null ? 'Cycle progress, no planned time' : `Of ${formatCycle(planned)} planned`}
            />
            <div className="ts-vs-box-foot">
              Active Tool: <span>{toolLabel}</span>
              {cycle && (
                <>
                  {' · '}Started <span className="font-tabular">{timeLabel.format(new Date(cycle.startedAt))}</span>
                </>
              )}
            </div>
          </div>

          <div className="ts-vs-box">
            <JobRow label="Client Name" value={job?.clienteleName} />
            <JobRow label="Job ID" value={job?.jobId} />
            <JobRow label="Part Name" value={[job?.partName, job?.processName].filter(Boolean).join(' · ')} />
            <JobRow label="Program Name" value={programName} />
          </div>
        </div>

        <div className="ts-vs-footer">
          <div className="ts-vs-mode">
            <span className={`ts-vs-mode-dot ts-tone-mode-${data.modeId}`} aria-hidden="true" />
            <div className="ts-vs-mode-text">
              <b>{modeTypeOf(data.modeId)?.label || data.modeName || 'No mode yet'}</b>
              {modeMeta && <div className="ts-vs-mode-meta">{modeMeta}</div>}
            </div>
          </div>
          <img className="ts-vs-logo" src={logo} alt="7th Sense" />
          <div className="ts-vs-date">
            <span>{dateLabel.format(serverNow)}</span>
            <span className="ts-vs-clock font-tabular">{timeLabel.format(serverNow)}</span>
          </div>
        </div>
      </section>
    </>
  )
}

VirtualScreen.propTypes = {
  machine: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    brandName: PropTypes.string,
    controllerName: PropTypes.string,
    controllerVersion: PropTypes.string,
  }).isRequired,
}

export default VirtualScreen
