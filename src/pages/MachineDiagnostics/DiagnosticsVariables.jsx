import { memo, useCallback, useMemo, useState } from 'react'
import { Button, ButtonGroup, Form, InputGroup } from 'react-bootstrap'
import PropTypes from 'prop-types'
import ChartCard from '@/components/charts/ChartCard'
import { NoResults } from '@/components/common/TableNoResults'
import { PICKER_LOCALE } from '@/utils/dateTime'
import { LIVE_INTERVALS, VARIABLE_FILTERS, formatValue, variableState } from './diagnosticsSettings'

const clock = new Intl.DateTimeFormat(PICKER_LOCALE, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
const dayClock = new Intl.DateTimeFormat(PICKER_LOCALE, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' })

// One variable: its value large, in the colour of what its data is doing. The value restarts its
// highlight each time the socket changes it (a new `key`). Memoised: the page re-renders on every
// socket message, and only the cards whose value changed need to.
const VariableCard = memo(function VariableCard({ row, picked, onToggle, liveOn, controllerConnected }) {
  const state = variableState({ variable: row, value: row.shownValue, changes: row.changes, controllerConnected })
  const stored = row.storedValue != null ? formatValue(row.storedValue) : null

  return (
    <article className={`ts-diag-var ts-tone-${state.tone}${row.readable ? '' : ' is-unreadable'}`}>
      <header className="ts-diag-var-head">
        <div className="min-w-0">
          <div className="font-monospace fw-semibold text-truncate" title={row.code}>{row.code}</div>
          <div className="small text-body-secondary ts-diag-var-name">{row.name}</div>
        </div>
        <Form.Check
          id={`diagnostics-variable-${row.id}`}
          aria-label={`Receive ${row.code} live`}
          title={row.readable ? 'Receive over the live socket' : row.reason}
          disabled={!row.readable}
          checked={picked}
          onChange={() => onToggle(row.code)}
        />
      </header>

      {row.readable ? (
        <div className="ts-diag-var-value font-tabular">
          <span key={row.changes} className={row.changes ? 'ts-diag-var-flash' : undefined}>{formatValue(row.shownValue)}</span>
          {row.unit && row.shownValue != null && <small className="text-body-secondary"> {row.unit}</small>}
        </div>
      ) : (
        <p className="small mb-0">{row.reason}</p>
      )}

      <div className="d-flex flex-wrap align-items-center gap-2">
        <span className="ts-diag-state small" title={state.title}>
          <i className="ts-dot" aria-hidden="true" />
          {state.label}
        </span>
        {row.readable && liveOn && !picked && <span className="small text-body-secondary">Not on the socket</span>}
      </div>

      <dl className="ts-diag-var-facts small mb-0">
        <dt>Address</dt>
        <dd className="font-monospace">{row.address || '—'}</dd>
        {row.readable && (
          <>
            <dt>Last change</dt>
            <dd className="font-tabular">{row.changedAt ? `${clock.format(new Date(row.changedAt))} · ${row.changes} change${row.changes === 1 ? '' : 's'}` : 'None since opening'}</dd>
            <dt>Last stored</dt>
            <dd className="font-tabular">{stored != null ? `${stored}${row.unit ? ` ${row.unit}` : ''}${row.storedAt ? ` · ${dayClock.format(new Date(row.storedAt))}` : ''}` : 'Not stored'}</dd>
          </>
        )}
      </dl>
    </article>
  )
})

VariableCard.propTypes = {
  row: PropTypes.object.isRequired,
  picked: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  liveOn: PropTypes.bool.isRequired,
  controllerConnected: PropTypes.bool.isRequired,
}

// Every variable of the machine as a card: tick the ones to receive over the socket, and see for each
// whether data comes, its address, and why it cannot be read when it cannot. Cards keep their place,
// so a value can be watched while the others change.
function DiagnosticsVariables({ rows, selected, onSelectedChange, liveOn, onLiveChange, intervalMs, onIntervalChange, socketConnected, liveEnabled, controllerConnected }) {
  const [search, setSearch] = useState('')
  const [pickedFilter, setFilter] = useState('')
  const [category, setCategory] = useState('')

  const categories = useMemo(() => [...new Set(rows.map((row) => row.category))].sort(), [rows])
  const readableCodes = useMemo(() => rows.filter((row) => row.readable).map((row) => row.code), [rows])
  // With nothing readable the default would hide every card, and with it each reason
  const filter = pickedFilter || (readableCodes.length ? VARIABLE_FILTERS[0].value : 'all')
  const term = search.trim().toLowerCase()

  const matched = useMemo(
    () =>
      rows.filter((row) => {
        if (filter === 'readable' && !row.readable) return false
        if (filter === 'unreadable' && row.readable) return false
        if (category && row.category !== category) return false
        return !term || [row.code, row.name, row.address].some((text) => text?.toLowerCase().includes(term))
      }),
    [rows, filter, category, term],
  )

  const toggle = useCallback(
    (code) => {
      const next = new Set(selected)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      onSelectedChange(next)
    },
    [selected, onSelectedChange],
  )
  const clearFilters = () => {
    setSearch('')
    setFilter('all')
    setCategory('')
  }

  return (
    <ChartCard
      title="Snapshot variables"
      subtitle={`${readableCodes.length} of ${rows.length} can be read on this machine · ${selected.size} picked for the live socket`}
      icon="bi-list-columns-reverse"
      actions={
        <span className={`ts-chip ${liveOn && socketConnected ? 'text-success' : 'ts-chip-muted'}`}>
          <i className={`ts-dot${liveOn && socketConnected ? ' ts-dot-live' : ''}`} aria-hidden="true" />
          {liveOn && socketConnected ? 'Socket live' : liveOn ? 'Socket not connected' : 'Socket off'}
        </span>
      }
    >
      <div className="ts-toolbar">
        <Form.Check
          type="switch"
          id="diagnostics-live"
          className="mb-0 align-self-center"
          label="Live socket"
          checked={liveOn}
          disabled={!liveEnabled}
          onChange={(event) => onLiveChange(event.target.checked)}
        />
        <Form.Select className="w-auto" value={intervalMs} onChange={(event) => onIntervalChange(Number(event.target.value))} aria-label="Socket interval" disabled={!liveOn}>
          {LIVE_INTERVALS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
        <ButtonGroup aria-label="Pick variables">
          <Button variant="ghost" onClick={() => onSelectedChange(new Set(readableCodes))}>Pick all</Button>
          <Button variant="ghost" onClick={() => onSelectedChange(new Set())}>Pick none</Button>
        </ButtonGroup>
        <InputGroup className="flex-grow-1 w-auto">
          <Form.Control
            type="search"
            placeholder="Search code, name, address…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search variables"
          />
          <InputGroup.Text>
            <i className="bi bi-search" aria-hidden="true" />
          </InputGroup.Text>
        </InputGroup>
        <Form.Select className="w-auto" value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Readable">
          {VARIABLE_FILTERS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
        <Form.Select className="w-auto text-capitalize" value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Category">
          <option value="">All categories</option>
          {categories.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Form.Select>
      </div>

      {matched.length ? (
        <div className="ts-diag-vars">
          {matched.map((row) => (
            <VariableCard
              key={row.id}
              row={row}
              picked={selected.has(row.code)}
              onToggle={toggle}
              liveOn={liveOn}
              controllerConnected={controllerConnected}
            />
          ))}
        </div>
      ) : (
        <NoResults message="No variable matches these filters." onClear={clearFilters} />
      )}
    </ChartCard>
  )
}

DiagnosticsVariables.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  selected: PropTypes.instanceOf(Set).isRequired,
  onSelectedChange: PropTypes.func.isRequired,
  liveOn: PropTypes.bool.isRequired,
  onLiveChange: PropTypes.func.isRequired,
  intervalMs: PropTypes.number.isRequired,
  onIntervalChange: PropTypes.func.isRequired,
  socketConnected: PropTypes.bool.isRequired,
  liveEnabled: PropTypes.bool.isRequired,
  controllerConnected: PropTypes.bool.isRequired,
}

export default DiagnosticsVariables
