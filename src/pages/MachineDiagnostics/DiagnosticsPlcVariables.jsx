import { useCallback, useMemo, useState } from 'react'
import { Button, ButtonGroup, Form, InputGroup } from 'react-bootstrap'
import PropTypes from 'prop-types'
import ChartCard from '@/components/charts/ChartCard'
import { NoResults } from '@/components/common/TableNoResults'
import useMachineLive from '@/hooks/useMachineLive'
import { PICKER_LOCALE } from '@/utils/dateTime'
import DiagnosticsVariableCard from './DiagnosticsVariableCard'
import {
  DEFAULT_LIVE_INTERVAL,
  LIVE_INTERVALS,
  PLC_FILTERS,
  PLC_STATE,
  PLC_STATE_LOOK,
  STATUS_LOOK,
  plcVariableState,
  trackChanges,
} from './diagnosticsSettings'

const dayClock = new Intl.DateTimeFormat(PICKER_LOCALE, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' })
const when = (value) => (value ? dayClock.format(new Date(value)) : '—')
const NO_VALUES = {}

// The policy URI's last part: "http://opcfoundation.org/UA/SecurityPolicy#Basic256Sha256" → "Basic256Sha256"
const policyName = (uri) => (uri ? uri.slice(uri.lastIndexOf('#') + 1) : '')

// Words a PLC variable's data state on its card
const plcState = (row, connected) => plcVariableState({ variable: row, value: row.shownValue, changes: row.changes, connected })

// Why a PLC variable shows no value, or cannot be put on the socket ('' when it can)
const plcReason = (variable, connected) => {
  if (!variable.enabled) return 'Turned off for this machine (machine_variables).'
  if (variable.nodeStatus) return `The controller answered ${variable.nodeStatus} for this node ID.`
  return connected ? '' : 'The PLC reader is not connected, so this variable cannot be received live.'
}

function Fact({ label, children }) {
  return (
    <>
      <dt>{label}</dt>
      <dd className="font-tabular">{children || '—'}</dd>
    </>
  )
}

Fact.propTypes = { label: PropTypes.string.isRequired, children: PropTypes.node }

// Machines › Diagnostics › PLC variables (server ADR 0021): what the OPC UA PLC reader does for this
// machine — its connection and verdict from GET /machines/{id}/diagnostics (`plc`) — and every PLC
// variable as a card, like the snapshot variables: tick the ones to receive over the live socket,
// with its own Live socket switch and interval. Its useMachineLive is merged with the snapshot
// variables' into one subscription per machine (services/liveSocket.js), at the shorter interval.
function DiagnosticsPlcVariables({ machineId, plc, liveEnabled }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [category, setCategory] = useState('')
  const [liveOn, setLiveOn] = useState(true)
  const [intervalMs, setIntervalMs] = useState(DEFAULT_LIVE_INTERVAL)
  // null = every subscribed PLC variable, until the user picks
  const [picked, setPicked] = useState(null)

  const connected = plc.state === PLC_STATE.CONNECTED
  // Only nodes the reader subscribed to can be received: the socket answers others as unknown
  const pickableCodes = useMemo(() => plc.variables.filter((row) => row.subscribed).map((row) => row.code), [plc.variables])
  const pickableKey = pickableCodes.join(',')
  const selected = useMemo(() => picked ?? new Set(pickableKey ? pickableKey.split(',') : []), [picked, pickableKey])
  const codes = useMemo(() => {
    const pickable = new Set(pickableKey ? pickableKey.split(',') : [])
    return [...selected].filter((code) => pickable.has(code)).sort()
  }, [selected, pickableKey])

  const watching = liveOn && liveEnabled && connected && codes.length > 0
  const live = useMachineLive(watching ? machineId : null, { codes, intervalMs })
  const liveValues = watching ? live.values : NO_VALUES

  // Changes seen by this page, kept in step with what the socket delivers
  const [tracked, setTracked] = useState({ source: null, rows: {} })
  if (liveValues !== tracked.source) setTracked(trackChanges(tracked, liveValues, live.at))

  const rows = useMemo(
    () =>
      plc.variables.map((variable) => {
        const change = tracked.rows[variable.code]
        return {
          ...variable,
          address: variable.nodeId,
          readable: variable.enabled && !variable.nodeStatus,
          reason: plcReason(variable, connected),
          shownValue: selected.has(variable.code) && variable.code in liveValues ? liveValues[variable.code] : variable.value,
          changes: change?.changes ?? 0,
          changedAt: change?.changedAt ?? null,
        }
      }),
    [plc.variables, tracked, selected, liveValues, connected],
  )

  const categories = useMemo(() => [...new Set(rows.map((row) => row.category).filter(Boolean))].sort(), [rows])
  const term = search.trim().toLowerCase()
  const matched = rows.filter((row) => {
    if (filter === 'subscribed' && !row.subscribed) return false
    if (filter === 'problems' && row.enabled && !row.nodeStatus) return false
    if (category && row.category !== category) return false
    return !term || [row.code, row.name, row.nodeId].some((text) => text?.toLowerCase().includes(term))
  })

  const toggle = useCallback(
    (code) => {
      const next = new Set(selected)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      setPicked(next)
    },
    [selected],
  )
  const clearFilters = () => {
    setSearch('')
    setFilter('')
    setCategory('')
  }

  const stateLook = PLC_STATE_LOOK[plc.state] ?? PLC_STATE_LOOK[PLC_STATE.NOT_REPORTED]
  const verdictLook = STATUS_LOOK[plc.status] ?? STATUS_LOOK.skipped
  const socketLive = watching && live.connected

  return (
    <ChartCard
      title="PLC variables (OPC UA)"
      subtitle={`${pickableCodes.length} of ${plc.variables.length} subscribed · ${codes.length} picked for the live socket · ${plc.endpoint}`}
      icon="bi-diagram-3"
      actions={
        <div className="d-flex flex-wrap gap-2">
          <span className={`ts-diag-state small ts-tone-${stateLook.tone}`}>
            <i className="ts-dot" aria-hidden="true" />
            {stateLook.label}
          </span>
          {connected && (
            <span className={`ts-chip ${socketLive ? 'text-success' : 'ts-chip-muted'}`}>
              <i className={`ts-dot${socketLive ? ' ts-dot-live' : ''}`} aria-hidden="true" />
              {socketLive ? 'Socket live' : liveOn ? 'Socket not connected' : 'Socket off'}
            </span>
          )}
        </div>
      }
    >
      <div className={`ts-diag-step ts-tone-${verdictLook.tone} mb-3`} role="status">
        <i className={`bi ${verdictLook.icon} ts-diag-step-icon`} aria-hidden="true" />
        <div>
          <div className="fw-semibold">{plc.message}</div>
          {plc.hint && <div className="small text-body-secondary">{plc.hint}</div>}
        </div>
        <span className="ts-diag-state small">{verdictLook.label}</span>
      </div>

      {plc.supported && plc.enabled && (
        <dl className="ts-diag-facts mb-3">
          <Fact label="Endpoint">{plc.endpoint}</Fact>
          <Fact label="Security">{[plc.securityMode, policyName(plc.securityPolicy)].filter(Boolean).join(' · ')}</Fact>
          <Fact label="Connected since">{plc.connectedSince && when(plc.connectedSince)}</Fact>
          <Fact label="Last value change">{plc.lastChangeAt && when(plc.lastChangeAt)}</Fact>
          <Fact label="Changes received">{plc.changeCount ? String(plc.changeCount) : ''}</Fact>
          <Fact label="Last error">{plc.lastError && `${plc.lastError} (${when(plc.lastErrorAt)})`}</Fact>
        </dl>
      )}

      {plc.variables.length > 0 && (
        <>
          <div className="ts-toolbar">
            <Form.Check
              type="switch"
              id="diagnostics-plc-live"
              className="mb-0 align-self-center"
              label="Live socket"
              checked={liveOn}
              disabled={!liveEnabled}
              onChange={(event) => setLiveOn(event.target.checked)}
            />
            <Form.Select className="w-auto" value={intervalMs} onChange={(event) => setIntervalMs(Number(event.target.value))} aria-label="PLC socket interval" disabled={!liveOn}>
              {LIVE_INTERVALS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
            <ButtonGroup aria-label="Pick PLC variables">
              <Button variant="ghost" onClick={() => setPicked(new Set(pickableCodes))}>Pick all</Button>
              <Button variant="ghost" onClick={() => setPicked(new Set())}>Pick none</Button>
            </ButtonGroup>
            <InputGroup className="flex-grow-1 w-auto">
              <Form.Control
                type="search"
                placeholder="Search code, name, node ID…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search PLC variables"
              />
              <InputGroup.Text>
                <i className="bi bi-search" aria-hidden="true" />
              </InputGroup.Text>
            </InputGroup>
            <Form.Select className="w-auto" value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="PLC variable status">
              {PLC_FILTERS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
            {categories.length > 0 && (
              <Form.Select className="w-auto text-capitalize" value={category} onChange={(event) => setCategory(event.target.value)} aria-label="PLC variable category">
                <option value="">All categories</option>
                {categories.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Form.Select>
            )}
          </div>

          {matched.length ? (
            <div className="ts-diag-vars">
              {matched.map((row) => (
                <DiagnosticsVariableCard
                  key={row.id}
                  row={row}
                  idPrefix="diagnostics-plc-variable"
                  addressLabel="Node ID"
                  stateOf={plcState}
                  connected={connected}
                  pickable={row.subscribed}
                  picked={selected.has(row.code)}
                  onToggle={toggle}
                  liveOn={liveOn}
                />
              ))}
            </div>
          ) : (
            <NoResults message="No PLC variable matches these filters." onClear={clearFilters} />
          )}
        </>
      )}
    </ChartCard>
  )
}

DiagnosticsPlcVariables.propTypes = {
  machineId: PropTypes.number.isRequired,
  plc: PropTypes.shape({
    enabled: PropTypes.bool.isRequired,
    supported: PropTypes.bool.isRequired,
    state: PropTypes.string,
    status: PropTypes.string,
    message: PropTypes.string,
    hint: PropTypes.string,
    endpoint: PropTypes.string,
    securityMode: PropTypes.string,
    securityPolicy: PropTypes.string,
    connectedSince: PropTypes.string,
    lastError: PropTypes.string,
    lastErrorAt: PropTypes.string,
    lastChangeAt: PropTypes.string,
    changeCount: PropTypes.number,
    variables: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  liveEnabled: PropTypes.bool.isRequired,
}

export default DiagnosticsPlcVariables
