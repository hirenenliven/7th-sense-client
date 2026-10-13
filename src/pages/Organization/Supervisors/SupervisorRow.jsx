import { memo } from 'react'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { formatDate } from '@/utils/helpers'

function IconAction({ icon, label, onClick }) {
  return (
    <Button variant="plain" size="sm" className="btn-icon text-primary" onClick={onClick} aria-label={label} title={label}>
      <i className={`bi ${icon}`} aria-hidden="true" />
    </Button>
  )
}

IconAction.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

function SupervisorRow({ supervisor, onEdit, onDelete }) {
  return (
    <tr>
      <td className="font-tabular">{supervisor.id}</td>
      <td className="fw-semibold">{supervisor.name}</td>
      <td className="text-body-secondary">{supervisor.cellName || '—'}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(supervisor.updatedAt)}</td>
      <td className="border-start">
        <div className="d-flex gap-1">
          <IconAction icon="bi-pencil-square" label={`Edit ${supervisor.name}`} onClick={() => onEdit(supervisor)} />
          <IconAction icon="bi-trash3" label={`Delete ${supervisor.name}`} onClick={() => onDelete(supervisor)} />
        </div>
      </td>
    </tr>
  )
}

SupervisorRow.propTypes = {
  supervisor: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    cellName: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(SupervisorRow)
