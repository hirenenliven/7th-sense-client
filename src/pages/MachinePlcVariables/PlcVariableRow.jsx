import { memo } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import { ACTION_ICONS } from '@/constants/icons'
import { formatValue } from '@/pages/MachineDiagnostics/diagnosticsSettings'
import { PICKER_LOCALE } from '@/utils/dateTime'
import { NODE_ID_EXAMPLE, NODE_STATUS, currentNodeId, liveState, nodeIdError, statusHint } from './plcVariableSettings'

const clock = new Intl.DateTimeFormat(PICKER_LOCALE, { hour: '2-digit', minute: '2-digit', second: '2-digit' })

// One PLC variable: its node id is edited in place. Enter saves, Esc undoes the typing; an updated
// node id shows the default under it and can be reset. Test reads the node id in the box (saved or
// typed) once from the machine; its result shows under the box while the box still holds that node
// id. `draft` = the typed value while it differs from the saved one; `liveValue` / `liveChanges` = the
// socket's value and how often it changed on this page, worded with the reader by liveState().
// Memoised (plain props): the page re-renders on every key typed in any row.
function PlcVariableRow({ row, draft, saving, test, reader, socketLive, liveValue, liveChanges, onDraftChange, onSave, onReset, onTest }) {
  const dirty = draft !== undefined
  const value = dirty ? draft : row.nodeId
  const nodeId = currentNodeId(row, draft)
  const error = dirty ? nodeIdError(draft) : ''
  const typedDefault = dirty && nodeId === row.defaultNodeId
  const updated = row.nodeStatus === NODE_STATUS.UPDATED
  const shownTest = test?.nodeId === nodeId ? test : null
  const live = liveState({ row, reader, socketLive, value: liveValue, changes: liveChanges })

  const save = () => {
    if (dirty && !error && !saving) onSave(row, draft)
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      save()
    } else if (event.key === 'Escape') {
      onDraftChange(row.variableId, undefined)
    }
  }

  const renderStatus = () => {
    if (dirty) return <span className="ts-chip text-info"><i className="ts-dot" aria-hidden="true" />Unsaved</span>
    if (row.nodeStatus === NODE_STATUS.DEFAULT) return <span className="ts-chip ts-chip-muted text-body-secondary">Default</span>
    return <span className="ts-chip text-warning"><i className="ts-dot" aria-hidden="true" />Updated</span>
  }

  const renderTest = () => {
    if (!shownTest) return null
    if (shownTest.testing) {
      return (
        <div className="small text-body-secondary mt-1">
          <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" />
          Reading from the machine…
        </div>
      )
    }
    if (shownTest.ok) {
      return (
        <div className="small text-success mt-1 text-break" role="status">
          <i className="bi bi-check-circle-fill me-1" aria-hidden="true" />
          Works: <span className="font-monospace fw-semibold">{formatValue(shownTest.value, row.unit)}</span>
          {shownTest.valueType && ` · ${shownTest.valueType}`} · tested {clock.format(new Date(shownTest.at))}
        </div>
      )
    }
    const hint = statusHint(shownTest.status)
    return (
      <div className="small text-danger mt-1 text-break" role="status">
        <i className="bi bi-x-circle-fill me-1" aria-hidden="true" />
        {shownTest.status}
        {hint && ` · ${hint}`}
      </div>
    )
  }

  const renderActions = () => {
    if (saving) return <Spinner animation="border" size="sm" role="status" aria-label={`Saving ${row.code}`} />
    const testAction = !error && !shownTest?.testing && (
      <IconAction icon={ACTION_ICONS.testNode} label={`Test node ID of ${row.code} on the machine`} onClick={() => onTest([{ row, nodeId }])} />
    )
    if (dirty) {
      return (
        <>
          {testAction}
          {!error && <IconAction icon={ACTION_ICONS.save} label={`Save node ID of ${row.code}`} onClick={save} />}
          <IconAction icon={ACTION_ICONS.undo} label={`Undo changes to ${row.code}`} onClick={() => onDraftChange(row.variableId, undefined)} />
        </>
      )
    }
    return (
      <>
        {testAction}
        {updated && <IconAction icon={ACTION_ICONS.resetDefault} label={`Reset ${row.code} to the default node ID`} onClick={() => onReset(row)} />}
      </>
    )
  }

  return (
    <tr className={dirty ? 'table-active' : undefined}>
      <td className="font-tabular text-body-secondary">{row.variableId}</td>
      <td>
        <div className="font-monospace fw-semibold">{row.code}</div>
        <div className="small text-body-secondary">
          {row.name}
          {row.status !== 'active' && <span className="ms-2 text-uppercase">· {row.status}</span>}
        </div>
      </td>
      <td className="text-capitalize text-body-secondary">{row.category}</td>
      <td className="w-50">
        <Form.Control
          size="sm"
          className="font-monospace"
          value={value}
          isInvalid={Boolean(error)}
          disabled={saving}
          spellCheck={false}
          placeholder={`Enter node ID, e.g. ${NODE_ID_EXAMPLE}`}
          aria-label={`Node ID of ${row.code}`}
          onChange={(event) => onDraftChange(row.variableId, event.target.value)}
          onKeyDown={handleKeyDown}
        />
        {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
        {renderTest()}
        {!error && typedDefault && <div className="small text-body-secondary mt-1">Same as the default: saving resets it.</div>}
        {!error && !typedDefault && (dirty || updated) && (
          <div className="small text-body-secondary mt-1 text-break">
            Default: <span className="font-monospace">{row.defaultNodeId}</span>
          </div>
        )}
      </td>
      <td className="text-nowrap">
        <div className="font-tabular fw-semibold">
          <span key={liveChanges} className={liveChanges ? 'ts-diag-var-flash' : undefined}>
            {formatValue(liveValue, liveValue != null ? row.unit : '')}
          </span>
        </div>
        <span className={`ts-diag-state small ts-tone-${live.tone}`} title={live.title}>
          <i className="ts-dot" aria-hidden="true" />
          {live.label}
        </span>
      </td>
      <td>{renderStatus()}</td>
      <td className="border-start">
        <div className="d-flex gap-1 align-items-center">{renderActions()}</div>
      </td>
    </tr>
  )
}

PlcVariableRow.propTypes = {
  row: PropTypes.shape({
    variableId: PropTypes.number.isRequired,
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    unit: PropTypes.string,
    category: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    nodeId: PropTypes.string.isRequired,
    defaultNodeId: PropTypes.string.isRequired,
    nodeStatus: PropTypes.string.isRequired,
    readerNodeId: PropTypes.string,
    readerStatus: PropTypes.string,
  }).isRequired,
  draft: PropTypes.string,
  saving: PropTypes.bool.isRequired,
  test: PropTypes.shape({
    nodeId: PropTypes.string.isRequired,
    testing: PropTypes.bool,
    ok: PropTypes.bool,
    status: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    valueType: PropTypes.string,
    at: PropTypes.number,
  }),
  reader: PropTypes.shape({
    enabled: PropTypes.bool.isRequired,
    supported: PropTypes.bool.isRequired,
    state: PropTypes.string,
    lastError: PropTypes.string,
  }).isRequired,
  socketLive: PropTypes.bool.isRequired,
  liveValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  liveChanges: PropTypes.number.isRequired,
  onDraftChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onTest: PropTypes.func.isRequired,
}

export default memo(PlcVariableRow)
