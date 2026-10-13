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

function LocationRow({ location, onEdit, onDelete }) {
  return (
    <tr>
      <td className="font-tabular">{location.id}</td>
      <td className="fw-semibold">{location.name}</td>
      <td className="text-body-secondary">{location.branchName || '—'}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(location.updatedAt)}</td>
      <td className="border-start">
        <div className="d-flex gap-1">
          <IconAction icon="bi-pencil-square" label={`Edit ${location.name}`} onClick={() => onEdit(location)} />
          <IconAction icon="bi-trash3" label={`Delete ${location.name}`} onClick={() => onDelete(location)} />
        </div>
      </td>
    </tr>
  )
}

LocationRow.propTypes = {
  location: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    branchName: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(LocationRow)
