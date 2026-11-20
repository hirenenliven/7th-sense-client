import { memo } from 'react'
import { Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { PICKER_LOCALE } from '@/utils/dateTime'
import { formatValue } from './diagnosticsSettings'

const clock = new Intl.DateTimeFormat(PICKER_LOCALE, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
const dayClock = new Intl.DateTimeFormat(PICKER_LOCALE, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' })

// One variable of the diagnostics (snapshot or PLC): its value large, in the colour of what its data
// is doing. The value restarts its highlight each time the socket changes it (a new `key`).
// Memoised: the page re-renders on every socket message, and only the cards whose value changed
// need to. `stateOf(row, connected)` words the data state; `pickable` = may be put on the socket.
const DiagnosticsVariableCard = memo(function DiagnosticsVariableCard({ row, idPrefix, addressLabel, stateOf, connected, pickable, picked, onToggle, liveOn }) {
  const state = stateOf(row, connected)
  const stored = row.storedValue != null ? formatValue(row.storedValue) : null

  return (
    <article className={`ts-diag-var ts-tone-${state.tone}${row.readable ? '' : ' is-unreadable'}`}>
      <header className="ts-diag-var-head">
        <div className="min-w-0">
          <div className="font-monospace fw-semibold text-truncate" title={row.code}>{row.code}</div>
          <div className="small text-body-secondary ts-diag-var-name">{row.name}</div>
        </div>
        <Form.Check
          id={`${idPrefix}-${row.id}`}
          aria-label={`Receive ${row.code} live`}
          title={pickable ? 'Receive over the live socket' : row.reason}
          disabled={!pickable}
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
        {pickable && liveOn && !picked && <span className="small text-body-secondary">Not on the socket</span>}
      </div>

      <dl className="ts-diag-var-facts small mb-0">
        <dt>{addressLabel}</dt>
        <dd className="font-monospace text-break">{row.address || '—'}</dd>
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

DiagnosticsVariableCard.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number.isRequired,
    code: PropTypes.string.isRequired,
    name: PropTypes.string,
    unit: PropTypes.string,
    address: PropTypes.string,
    readable: PropTypes.bool.isRequired,
    reason: PropTypes.string,
    shownValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
    changes: PropTypes.number.isRequired,
    changedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    storedValue: PropTypes.number,
    storedAt: PropTypes.string,
  }).isRequired,
  idPrefix: PropTypes.string.isRequired,
  addressLabel: PropTypes.string.isRequired,
  stateOf: PropTypes.func.isRequired,
  connected: PropTypes.bool.isRequired,
  pickable: PropTypes.bool.isRequired,
  picked: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  liveOn: PropTypes.bool.isRequired,
}

export default DiagnosticsVariableCard
