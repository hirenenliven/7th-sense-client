import { useEffect, useState } from 'react'
import { Alert, Card, Col, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import ChartCard from '@/components/charts/ChartCard'
import Speedometer from '@/components/charts/Speedometer'
import Loader from '@/components/common/Loader'
import useLoad from '@/hooks/useLoad'
import { modeTypeOf } from '@/constants/machines'
import MachineMode from '@/pages/Machines/MachineMode'
import { SPINDLE_LOAD, statusOf } from '@/pages/MachineHealth/healthSensors'
import { getVirtualScreen } from '@/services/productivityService'
import { PICKER_LOCALE, formatClock12, formatModeDuration } from '@/utils/dateTime'
import { formatCount, formatCycle } from './productivitySettings'
import { AxisLoadBars, OverrideDial, ProgressMeter, Reading } from './VirtualScreenParts'
import {
  RUNNING_PROGRESS_CAP,
  STALE_AFTER_MS,
  VIRTUAL_SCREEN_REFRESH_MS,
  VIRTUAL_SCREEN_TICK_MS,
  batchRemainingSec,
  cycleElapsed,
  formatReading,
  shareOf,
} from './virtualScreenSettings'

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

// Messages & alarms: E-stop and an active alarm in red; otherwise the last alarm, cleared
function AlarmBanner({ alarm, emergency }) {
  const at = alarm ? timeLabel.format(new Date(alarm.at)) : ''
  const code = alarm?.code != null ? `Alarm ${alarm.code}` : 'Alarm'

  if (emergency || alarm?.active) {
    return (
      <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2" role="status">
        <i className="bi bi-exclamation-octagon-fill" aria-hidden="true" />
        {emergency && <b>Emergency stop pressed.</b>}
        {alarm?.active && (
          <span className="me-auto">
            <b>{code}</b> {alarm.message}
          </span>
        )}
        {alarm?.active && <span className="small font-tabular">{at}</span>}
      </Alert>
    )
  }

  return (
    <Card className="mb-3">
      <Card.Body className="d-flex flex-wrap align-items-center gap-2 py-2">
        <i className="bi bi-check-circle text-success" aria-hidden="true" />
        <span className="ts-vs-label me-2">Messages &amp; Alarms</span>
        <span className="me-auto text-body-secondary small">
          {alarm ? (
            <>
              No active alarm · last {code}
              {alarm.message ? `: ${alarm.message}` : ''}
            </>
          ) : (
            'No alarm recorded'
          )}
        </span>
        {alarm && <span className="small text-body-secondary font-tabular">{at}</span>}
      </Card.Body>
    </Card>
  )
}

AlarmBanner.propTypes = {
  alarm: PropTypes.shape({
    code: PropTypes.number,
    message: PropTypes.string,
    at: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
  }),
  emergency: PropTypes.bool.isRequired,
}

// Operations › Monitoring › a machine › Virtual Screen tab (MonitoringMachine passes the machine): the
// machine's controller screen, live. GET /productivity/virtual-screen every VIRTUAL_SCREEN_REFRESH_MS
// gives the spindle load (gauge), spindle / feed overrides (dials), axis loads, the last alarm, the
// running cycle and its job; the clock, mode time and cycle progress move every second in between.
function VirtualScreen({ machine }) {
  const { data, loading, error } = useLoad(
    () => getVirtualScreen(machine.id).then((screen) => ({ ...screen, readAt: Date.now() })),
    `virtual-screen|${machine.id}`,
    { refreshMs: VIRTUAL_SCREEN_REFRESH_MS },
  )
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
          {[controller, `live from the controller, refreshed every ${VIRTUAL_SCREEN_REFRESH_MS / 1000} s`].filter(Boolean).join(' · ')}
        </p>
      </div>
      {chip}
    </div>
  )

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
  const loadStatus = spindleLoad == null ? 'good' : statusOf(spindleLoad, SPINDLE_LOAD)

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

  return (
    <>
      {header(<LiveChip online={data.online} stale={stale} updatedAt={updatedAt} />)}
      {error && (
        <Alert variant="warning" className="py-2 small">
          Could not refresh: {error}. Showing the values read at {timeLabel.format(new Date(data.readAt))}.
        </Alert>
      )}

      <AlarmBanner alarm={data.alarm} emergency={live.emergency} />

      <Row className="g-3 mb-3">
        <Col xs={12} lg={5}>
          <ChartCard title="Spindle Load" subtitle="Load on the spindle motor · now" icon="bi-speedometer2">
            <Speedometer
              value={spindleLoad ?? 0}
              min={SPINDLE_LOAD.min}
              max={SPINDLE_LOAD.max}
              warning={SPINDLE_LOAD.warning}
              critical={SPINDLE_LOAD.critical}
              unit={SPINDLE_LOAD.unit}
              status={loadStatus}
              label={SPINDLE_LOAD.label}
            >
              <div className="ts-number ts-number-lg font-tabular mt-2">
                {formatReading(spindleLoad)}
                {spindleLoad != null && <small>%</small>}
              </div>
            </Speedometer>
            <Row xs={2} className="g-3 mt-auto pt-3">
              <Col>
                <Reading
                  label="Spindle Speed"
                  value={
                    <>
                      {formatReading(live.spindleSpeed == null ? null : Math.abs(live.spindleSpeed), 0)}
                      <small>rpm</small>
                    </>
                  }
                  emphasis
                />
              </Col>
              <Col>
                <Reading label="Active Tool" value={live.toolNumber == null ? '—' : `T${Math.round(live.toolNumber)}`} emphasis />
              </Col>
            </Row>
          </ChartCard>
        </Col>

        <Col xs={12} lg={7}>
          <ChartCard title="Speed, Feed & Axis Load" subtitle="Operator overrides of the program · axis motor load" icon="bi-sliders">
            <Row xs={1} sm={3} className="g-4 align-items-start my-auto">
              <Col>
                <OverrideDial label="Spindle Override" value={live.spindleOverride} />
              </Col>
              <Col>
                <OverrideDial label="Feed Override" value={live.feedOverride}>
                  <div className="ts-vs-dial-extra font-tabular">
                    {formatReading(live.feedRate, 2)} <small className="text-body-secondary">{live.feedUnit}</small>
                  </div>
                </OverrideDial>
              </Col>
              <Col>
                <AxisLoadBars live={live} />
              </Col>
            </Row>
          </ChartCard>
        </Col>
      </Row>

      <Row xs={1} lg={3} className="g-3 mb-3">
        <Col>
          <ChartCard
            title="Batch Progress"
            subtitle={job?.jobId ? `Job ${job.jobId}` : 'The job scheduled now'}
            icon="bi-boxes"
          >
            {job ? (
              <>
                <Row xs={2} className="g-3 mb-3">
                  <Col>
                    <Reading
                      label="Cycles"
                      value={
                        <>
                          <span className="text-success">{formatCount(job.completedCycles)}</span>
                          <small> / {formatCount(job.quantity)}</small>
                        </>
                      }
                      emphasis
                    />
                  </Col>
                  <Col>
                    <Reading label="Remaining Time" value={batchRemaining == null ? '—' : batchRemaining === 0 ? 'Done' : formatCycle(batchRemaining)} emphasis />
                  </Col>
                </Row>
                <ProgressMeter label="Batch done" share={batchShare} variant="success" />
                <div className="small text-body-secondary mt-auto pt-3">
                  Scheduled{' '}
                  <span className="text-body font-tabular">
                    {formatClock12(job.startTime)} – {formatClock12(job.endTime)}
                  </span>
                </div>
              </>
            ) : (
              <p className="ts-note my-auto">No job is scheduled on this machine now.</p>
            )}
          </ChartCard>
        </Col>

        <Col>
          <ChartCard
            title="Cycle Progress"
            subtitle={cycle ? `Started ${timeLabel.format(new Date(cycle.startedAt))}` : 'The running cycle'}
            icon="bi-arrow-repeat"
          >
            {cycle ? (
              <>
                <Row xs={2} className="g-3 mb-3">
                  <Col>
                    <Reading label="Elapsed" value={formatCycle(elapsed)} emphasis />
                  </Col>
                  <Col>
                    <Reading
                      label={overrun ? 'Over Plan By' : 'Remaining Time'}
                      value={overrun ? <span className="text-warning">{formatCycle(elapsed - planned)}</span> : cycleRemaining}
                      emphasis
                    />
                  </Col>
                </Row>
                <ProgressMeter
                  label={planned == null ? 'No planned cycle time' : `Of ${formatCycle(planned)} planned`}
                  share={cycleShare == null ? null : Math.min(cycleShare, RUNNING_PROGRESS_CAP)}
                  variant={overrun ? 'warning' : 'info'}
                />
              </>
            ) : (
              <p className="ts-note my-auto">No cycle is running.</p>
            )}
          </ChartCard>
        </Col>

        <Col>
          <ChartCard title="Job Details" subtitle="What the machine is making" icon="bi-clipboard-data">
            <div className="d-grid gap-3">
              <Reading label="Client Name" value={job?.clienteleName || '—'} />
              <Reading label="Job ID" value={job?.jobId || '—'} />
              <Reading label="Part Name" value={[job?.partName, job?.processName].filter(Boolean).join(' · ') || '—'} />
              <Reading label="Program Name" value={programName || '—'} />
            </div>
          </ChartCard>
        </Col>
      </Row>

      <Card>
        <Card.Body className="ts-vs-status">
          <div>
            <span className="ts-vs-label">Mode</span>
            <div className="d-flex flex-wrap align-items-center gap-2">
              {modeTypeOf(data.modeId) ? <MachineMode modeId={data.modeId} /> : <span>{data.modeName || '—'}</span>}
              {modeSeconds != null && <span className="small text-body-secondary font-tabular">for {formatModeDuration(modeSeconds)}</span>}
            </div>
          </div>
          <div>
            <span className="ts-vs-label">Operation Mode</span>
            <div>{data.opMode || '—'}</div>
          </div>
          <div className="ms-md-auto text-md-end">
            <span className="ts-vs-label">{dateLabel.format(serverNow)}</span>
            <div className="ts-number ts-number-sm font-tabular">{timeLabel.format(serverNow)}</div>
          </div>
        </Card.Body>
      </Card>
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
