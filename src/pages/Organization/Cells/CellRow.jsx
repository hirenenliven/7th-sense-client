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

function CellRow({ cell, onEdit, onDelete }) {
  return (
    <tr>
      <td className="font-tabular">{cell.id}</td>
      <td className="fw-semibold">{cell.name}</td>
      <td className="text-body-secondary">{cell.lineName || '—'}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(cell.updatedAt)}</td>
      <td className="border-start">
        <div className="d-flex gap-1">
          <IconAction icon="bi-pencil-square" label={`Edit ${cell.name}`} onClick={() => onEdit(cell)} />
          <IconAction icon="bi-trash3" label={`Delete ${cell.name}`} onClick={() => onDelete(cell)} />
        </div>
      </td>
    </tr>
  )
}

CellRow.propTypes = {
  cell: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    lineName: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(CellRow)
