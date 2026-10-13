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

function BranchRow({ branch, onEdit, onDelete }) {
  return (
    <tr>
      <td className="font-tabular">{branch.id}</td>
      <td className="fw-semibold">{branch.name}</td>
      <td className="text-body-secondary">{branch.cityName || '—'}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(branch.updatedAt)}</td>
      <td className="border-start">
        <div className="d-flex gap-1">
          <IconAction icon="bi-pencil-square" label={`Edit ${branch.name}`} onClick={() => onEdit(branch)} />
          <IconAction icon="bi-trash3" label={`Delete ${branch.name}`} onClick={() => onDelete(branch)} />
        </div>
      </td>
    </tr>
  )
}

BranchRow.propTypes = {
  branch: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    cityName: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(BranchRow)
