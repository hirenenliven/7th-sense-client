import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Col, Row, Spinner, Table } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import ChartCard from '@/components/charts/ChartCard'
import Loader from '@/components/common/Loader'
import { LIVE_CHANNELS } from '@/constants/live'
import { UNKNOWN_MODE_COLOR, modeTypeOf } from '@/constants/machines'
import { ROUTES } from '@/constants/routes'
import useLoad from '@/hooks/useLoad'
import useMachineLive from '@/hooks/useMachineLive'
import { checkMachineNetwork, getMachineDiagnostics } from '@/services/machineDiagnosticsService'
import { PICKER_LOCALE, formatModeDuration } from '@/utils/dateTime'
import DiagnosticsVariables from './DiagnosticsVariables'
import { CHECK_STATUS, DEFAULT_LIVE_INTERVAL, DIAGNOSTICS_REFRESH_MS, STATUS_LOOK, buildChecks, buildVerdict, trackChanges } from './diagnosticsSettings'

const dateTime = new Intl.DateTimeFormat(PICKER_LOCALE, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' })
const when = (value) => (value ? dateTime.format(new Date(value)) : '—')
const STATUS_FRESH_MS = 30_000
const NO_VALUES = {}

function Fact({ label, children }) {
  return (
    <>
      <dt>{label}</dt>
      <dd className="font-tabular">{children || '—'}</dd>
    </>
  )
}

// Machines › a machine › Diagnostics, for the superadmin: when a customer reports a problem, checks
// in order whether this machine's data reaches the server and the screen, and says what is wrong:
// set-up, collector, IP, port, controller, mode, variables and socket. GET /machines/{id}/diagnostics
// reloads every few seconds; the network test runs on opening and on Run checks again. See server ADR 0013.
function MachineDiagnostics() {
  const { id } = useParams()
  const machineId = Number(id)

  const state = useLoad(() => getMachineDiagnostics(machineId), `diagnostics|${machineId}`, { refreshMs: DIAGNOSTICS_REFRESH_MS })
  const diagnostics = state.data

  const [network, setNetwork] = useState({ data: null, error: '', running: true })
  const runNetwork = useCallback(async () => {
    setNetwork((current) => ({ ...current, error: '', running: true }))
    try {
      setNetwork({ data: await checkMachineNetwork(machineId), error: '', running: false })
    } catch (err) {
      setNetwork({ data: null, error: err.message, running: false })
    }
  }, [machineId])
  useEffect(() => {
    let active = true
    checkMachineNetwork(machineId)
      .then((data) => active && setNetwork({ data, error: '', running: false }))
      .catch((err) => active && setNetwork({ data: null, error: err.message, running: false }))
    return () => {
      active = false
    }
  }, [machineId])

  const [liveOn, setLiveOn] = useState(true)
  const [intervalMs, setIntervalMs] = useState(DEFAULT_LIVE_INTERVAL)
  // null = every readable variable, until the user picks
  const [picked, setPicked] = useState(null)
  const readableCodes = useMemo(() => (diagnostics?.variables ?? []).filter((row) => row.readable).map((row) => row.code), [diagnostics])
  const readableKey = readableCodes.join(',')
  const selected = useMemo(() => picked ?? new Set(readableKey ? readableKey.split(',') : []), [picked, readableKey])
  const codes = useMemo(() => [...selected].sort(), [selected])

  const watching = liveOn && Boolean(diagnostics?.liveEnabled)
  const live = useMachineLive(watching ? machineId : null, { codes, intervalMs, channels: [LIVE_CHANNELS.STATUS, LIVE_CHANNELS.EVENT], onEvent: state.reload })
  const liveValues = watching ? live.values : NO_VALUES

  // Changes seen by this page, kept in step with what the socket delivers
  const [tracked, setTracked] = useState({ source: null, rows: {} })
  if (liveValues !== tracked.source) setTracked(trackChanges(tracked, liveValues, live.at))

  const rows = useMemo(
    () =>
      (diagnostics?.variables ?? []).map((variable) => {
        const row = tracked.rows[variable.code]
        return {
          ...variable,
          shownValue: selected.has(variable.code) && variable.code in liveValues ? liveValues[variable.code] : variable.value,
          changes: row?.changes ?? 0,
          changedAt: row?.changedAt ?? null,
        }
      }),
    [diagnostics, tracked, selected, liveValues],
  )

  if (state.loading) return <Loader text="Loading diagnostics…" />
  if (!diagnostics) {
    return (
      <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2">
        <span className="me-auto">
          <b>Could not load diagnostics.</b> {state.error}
        </span>
        <Button variant="ghost" size="sm" onClick={state.reload}>
          Retry
        </Button>
      </Alert>
    )
  }

  const { machine, status, mode } = diagnostics
  const serverNow = Date.parse(diagnostics.serverTime)
  const controllerConnected = Boolean(status?.isConnected) && serverNow - Date.parse(status.updatedAt) <= STATUS_FRESH_MS
  const checks = buildChecks({
    diagnostics,
    network: network.running ? null : network.data,
    networkError: network.running ? '' : network.error,
    liveOn,
    selectedCount: selected.size,
    live: { ...live, connected: watching && live.connected },
  })
  const verdict = buildVerdict(checks)

  // The socket's status is newer than the last reload
  const liveStatus = watching ? live.status : null
  const modeId = liveStatus?.modeId ?? mode?.modeId ?? null
  const modeType = modeTypeOf(modeId)
  const modeSince = liveStatus?.modeSince ?? mode?.since
  const program = liveStatus?.programName ?? mode?.programName
  const online = liveStatus ? liveStatus.online : controllerConnected

  const rerun = () => {
    state.reload()
    runNetwork()
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Machines · Diagnostics</div>
          <h1>{machine.name}</h1>
          <p className="ts-page-subtitle">
            Machine # {machine.id} · {[machine.customerName, machine.modelName].filter(Boolean).join(' · ') || 'No customer'}
          </p>
        </div>
        <div className="ts-page-actions">
          <Button as={Link} to={ROUTES.MACHINES} variant="ghost">
            <i className="bi bi-arrow-left me-2" aria-hidden="true" />
            Machine list
          </Button>
          <Button onClick={rerun} disabled={network.running}>
            {network.running ? <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" /> : <i className="bi bi-arrow-repeat me-2" aria-hidden="true" />}
            Run checks again
          </Button>
        </div>
      </header>

      <Row xs={1} className="g-3">
        {state.error && (
          <Col>
            <Alert variant="warning" className="mb-0">
              Could not refresh: {state.error}. Showing what was read at {when(diagnostics.serverTime)}.
            </Alert>
          </Col>
        )}
        <Col>
          <Alert variant={verdict.variant} className="mb-0 d-flex gap-3" role="status">
            <i className={`bi ${verdict.icon} fs-4`} aria-hidden="true" />
            <div>
              <b>{verdict.title}</b>
              <div>{verdict.message}</div>
              {verdict.hint && <div className="small mt-1">{verdict.hint}</div>}
            </div>
          </Alert>
        </Col>

        <Col>
          <Row xs={1} className="g-3">
            <Col xl={7}>
              <ChartCard title="Checks" subtitle="In order: the first failed one is where to look" icon="bi-list-check">
                <ol className="list-unstyled mb-0">
                  {checks.map((check) => {
                    const look = STATUS_LOOK[check.status]
                    return (
                      <li key={check.key} className={`ts-diag-step ts-tone-${look.tone}`}>
                        <i className={`bi ${look.icon} ts-diag-step-icon`} aria-hidden="true" />
                        <div>
                          <div className="fw-semibold">{check.label}</div>
                          <div className="small">{check.message}</div>
                          {check.hint && <div className="small text-body-secondary">{check.hint}</div>}
                        </div>
                        <span className="ts-diag-state small">{look.label}</span>
                      </li>
                    )
                  })}
                </ol>
              </ChartCard>
            </Col>
            <Col xl={5}>
              <Row xs={1} className="g-3">
                <Col>
                  <ChartCard title="Machine mode" subtitle={liveStatus ? 'Live from the socket' : 'Last recorded by the collector'} icon="bi-activity">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                        <circle cx="7" cy="7" r="7" fill={modeType?.color ?? UNKNOWN_MODE_COLOR} />
                      </svg>
                      <span className="fs-4 fw-semibold">{modeType?.label ?? mode?.modeName ?? 'Unknown'}</span>
                      <span className={`ts-chip ${online ? 'text-success' : 'text-danger'}`}>
                        <i className="ts-dot" aria-hidden="true" />
                        {online ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <dl className="ts-diag-facts mb-0">
                      <Fact label="Since">
                        {modeSince && `${when(modeSince)} (${formatModeDuration((serverNow - Date.parse(modeSince)) / 1000)})`}
                      </Fact>
                      <Fact label="Program">{program}</Fact>
                      <Fact label="OP mode">{diagnostics.opMode}</Fact>
                    </dl>
                  </ChartCard>
                </Col>
                <Col>
                  <ChartCard title="Connection" subtitle="How the server reaches this machine" icon="bi-ethernet">
                    <dl className="ts-diag-facts mb-0">
                      <Fact label="Live IP : port">{machine.liveIp && `${machine.liveIp} : ${machine.port}`}</Fact>
                      <Fact label="Local IP">{machine.localIp}</Fact>
                      <Fact label="TCP connect">{network.data?.latencyMs != null && `${network.data.latencyMs} ms at ${when(network.data.checkedAt)}`}</Fact>
                      <Fact label="Controller">{[machine.engine, machine.controllerName, machine.controllerVersion].filter(Boolean).join(' · ')}</Fact>
                      <Fact label="Connected since">{status?.connectedSince && when(status.connectedSince)}</Fact>
                      <Fact label="Last reading">{status?.lastSeenAt && when(status.lastSeenAt)}</Fact>
                      <Fact label="Last value change">{status?.lastChangeAt && when(status.lastChangeAt)}</Fact>
                      <Fact label="DLL readings">{status && String(status.callbackCount)}</Fact>
                      <Fact label="Values stored">{status && `${status.storedCount}${status.droppedCount ? ` (${status.droppedCount} lost)` : ''}`}</Fact>
                      <Fact label="DLL errors">{status && `${status.errorCount}${status.lastError ? `: ${status.lastError}` : ''}`}</Fact>
                    </dl>
                  </ChartCard>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>

        <Col>
          <DiagnosticsVariables
            rows={rows}
            selected={selected}
            onSelectedChange={setPicked}
            liveOn={liveOn}
            onLiveChange={setLiveOn}
            intervalMs={intervalMs}
            onIntervalChange={setIntervalMs}
            socketConnected={watching && live.connected}
            liveEnabled={diagnostics.liveEnabled}
            controllerConnected={controllerConnected}
          />
        </Col>

        <Col>
          <ChartCard title="Recent machine events" subtitle="What the collector recorded for this machine, newest first" icon="bi-clock-history">
            {diagnostics.events.length ? (
              <div className="ts-table-panel ts-diag-events">
                <Table size="sm" className="mb-0">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Event</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diagnostics.events.map((event) => (
                      <tr key={event.id}>
                        <td className="font-tabular text-nowrap">{when(event.at)}</td>
                        <td className="font-monospace text-nowrap">{event.type}</td>
                        <td>{[event.code, event.message].filter((part) => part != null && part !== '').join(' · ') || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="ts-empty">
                <i className={`bi bi-clock-history ts-empty-icon`} aria-hidden="true" />
                <p className="mb-0">The collector has recorded nothing for this machine.</p>
              </div>
            )}
          </ChartCard>
        </Col>
      </Row>
    </>
  )
}

export default MachineDiagnostics
