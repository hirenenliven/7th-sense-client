import { useMemo, useState } from 'react'
import { Form, InputGroup, Table } from 'react-bootstrap'
import PropTypes from 'prop-types'
import ChartCard from '@/components/charts/ChartCard'
import { NoResults } from '@/components/common/TableNoResults'
import useMachineLive from '@/hooks/useMachineLive'
import { PICKER_LOCALE } from '@/utils/dateTime'
import { PLC_FILTERS, PLC_STATE, PLC_STATE_LOOK, STATUS_LOOK, formatValue, plcVariableState, trackChanges } from './diagnosticsSettings'

const clock = new Intl.DateTimeFormat(PICKER_LOCALE, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
const dayClock = new Intl.DateTimeFormat(PICKER_LOCALE, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' })
const when = (value) => (value ? dayClock.format(new Date(value)) : '—')
const NO_VALUES = {}

// The policy URI's last part: "http://opcfoundation.org/UA/SecurityPolicy#Basic256Sha256" → "Basic256Sha256"
const policyName = (uri) => (uri ? uri.slice(uri.lastIndexOf('#') + 1) : '')

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
// machine — its connection and verdict from GET /machines/{id}/diagnostics (`plc`), and every PLC
// variable with its node ID, the controller's answer and its value live from the socket. It
// subscribes to the subscribed PLC codes itself (useMachineLive merges them with the snapshot
// variables' subscription of the page), following the page's Live socket switch and interval.
function DiagnosticsPlcVariables({ machineId, plc, liveOn, liveEnabled, intervalMs }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')

  const connected = plc.state === PLC_STATE.CONNECTED
  const codes = useMemo(() => plc.variables.filter((row) => row.subscribed).map((row) => row.code).sort(), [plc.variables])
  const watching = liveOn && liveEnabled && connected && codes.length > 0
  const live = useMachineLive(watching ? machineId : null, { codes, intervalMs })
  const liveValues = watching ? live.values : NO_VALUES

  // Changes seen by this page, kept in step with what the socket delivers
  const [tracked, setTracked] = useState({ source: null, rows: {} })
  if (liveValues !== tracked.source) setTracked(trackChanges(tracked, liveValues, live.at))

  const term = search.trim().toLowerCase()
  const rows = plc.variables.filter((row) => {
    if (filter === 'subscribed' && !row.subscribed) return false
    if (filter === 'problems' && row.enabled && !row.nodeStatus) return false
    return !term || [row.code, row.name, row.nodeId].some((text) => text?.toLowerCase().includes(term))
  })

  const stateLook = PLC_STATE_LOOK[plc.state] ?? PLC_STATE_LOOK[PLC_STATE.NOT_REPORTED]
  const verdictLook = STATUS_LOOK[plc.status] ?? STATUS_LOOK.skipped
  const subscribedCount = codes.length
  const socketLive = watching && live.connected

  return (
    <ChartCard
      title="PLC variables (OPC UA)"
      subtitle={`${subscribedCount} of ${plc.variables.length} subscribed · ${plc.endpoint}`}
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
          </div>

          {rows.length ? (
            <div className="ts-table-panel">
              <Table size="sm" responsive className="mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Variable</th>
                    <th>Node ID</th>
                    <th>Data</th>
                    <th className="text-end">Live value</th>
                    <th>Last change</th>
                    <th>Last stored</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const change = tracked.rows[row.code]
                    const value = row.code in liveValues ? liveValues[row.code] : row.value
                    const state = plcVariableState({ variable: row, value, changes: change?.changes ?? 0, connected })
                    return (
                      <tr key={row.id}>
                        <td>
                          <div className="font-monospace fw-semibold">{row.code}</div>
                          <div className="small text-body-secondary">{row.name}</div>
                        </td>
                        <td className="font-monospace small text-break">{row.nodeId}</td>
                        <td>
                          <span className={`ts-diag-state small ts-tone-${state.tone}`} title={state.title}>
                            <i className="ts-dot" aria-hidden="true" />
                            {state.label}
                          </span>
                        </td>
                        <td className="text-end font-tabular fw-semibold">
                          <span key={change?.changes ?? 0} className={change?.changes ? 'ts-diag-var-flash' : undefined}>
                            {formatValue(value, value != null ? row.unit : '')}
                          </span>
                        </td>
                        <td className="small font-tabular text-nowrap">
                          {change?.changedAt ? `${clock.format(new Date(change.changedAt))} · ${change.changes}` : '—'}
                        </td>
                        <td className="small font-tabular text-nowrap">
                          {row.storedValue != null ? `${formatValue(row.storedValue, row.unit)} · ${when(row.storedAt)}` : 'Not stored'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </div>
          ) : (
            <NoResults
              message="No PLC variable matches these filters."
              onClear={() => {
                setSearch('')
                setFilter('')
              }}
            />
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
  liveOn: PropTypes.bool.isRequired,
  liveEnabled: PropTypes.bool.isRequired,
  intervalMs: PropTypes.number.isRequired,
}

export default DiagnosticsPlcVariables
