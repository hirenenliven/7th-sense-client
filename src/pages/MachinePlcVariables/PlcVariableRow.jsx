import { memo } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import { ACTION_ICONS } from '@/constants/icons'
import { NODE_ID_EXAMPLE, NODE_STATUS, nodeIdError } from './plcVariableSettings'

// One PLC variable: its node id is edited in place. Enter saves, Esc undoes the typing; an updated
// node id shows the default under it and can be reset. `draft` = the typed value while it differs
// from the saved one. Memoised: the page re-renders on every key typed in any row.
function PlcVariableRow({ row, draft, saving, onDraftChange, onSave, onReset }) {
  const dirty = draft !== undefined
  const value = dirty ? draft : row.nodeId
  const error = dirty ? nodeIdError(draft) : ''
  const typedDefault = dirty && draft.trim() === row.defaultNodeId
  const updated = row.nodeStatus === NODE_STATUS.UPDATED

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

  const renderActions = () => {
    if (saving) return <Spinner animation="border" size="sm" role="status" aria-label={`Saving ${row.code}`} />
    if (dirty) {
      return (
        <>
          {!error && <IconAction icon={ACTION_ICONS.save} label={`Save node ID of ${row.code}`} onClick={save} />}
          <IconAction icon={ACTION_ICONS.undo} label={`Undo changes to ${row.code}`} onClick={() => onDraftChange(row.variableId, undefined)} />
        </>
      )
    }
    if (updated) {
      return <IconAction icon={ACTION_ICONS.resetDefault} label={`Reset ${row.code} to the default node ID`} onClick={() => onReset(row)} />
    }
    return null
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
        {!error && typedDefault && <div className="small text-body-secondary mt-1">Same as the default: saving resets it.</div>}
        {!error && !typedDefault && (dirty || updated) && (
          <div className="small text-body-secondary mt-1 text-break">
            Default: <span className="font-monospace">{row.defaultNodeId}</span>
          </div>
        )}
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
    category: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    nodeId: PropTypes.string.isRequired,
    defaultNodeId: PropTypes.string.isRequired,
    nodeStatus: PropTypes.string.isRequired,
  }).isRequired,
  draft: PropTypes.string,
  saving: PropTypes.bool.isRequired,
  onDraftChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
}

export default memo(PlcVariableRow)
