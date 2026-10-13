import { memo } from 'react'
import { Button, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { BRANCH_STATUS } from '@/constants/app'

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

function BranchRow({ branch, statusBusy, onToggleStatus, onEdit, onDelete }) {
  const isActive = branch.status !== BRANCH_STATUS.INACTIVE

  return (
    <tr>
      <td className="font-tabular">{branch.id}</td>
      <td className="font-tabular">{branch.code}</td>
      <td className="fw-semibold">{branch.name}</td>
      <td className="text-body-secondary">{branch.email || '—'}</td>
      <td className="text-body-secondary">{branch.city || '—'}</td>
      <td className="text-nowrap text-body-secondary">
        {branch.colorCode ? (
          <span className="d-inline-flex align-items-center gap-2">
            {/* SVG fill keeps the per-branch colour out of inline styles */}
            <svg className="ts-swatch" viewBox="0 0 10 10" aria-hidden="true">
              <circle cx="5" cy="5" r="5" fill={branch.colorCode} />
            </svg>
            <span className="font-tabular">{branch.colorCode}</span>
          </span>
        ) : (
          '—'
        )}
      </td>
      <td>
        <Form.Check
          type="switch"
          id={`branch-status-${branch.id}`}
          checked={isActive}
          disabled={statusBusy}
          onChange={() => onToggleStatus(branch)}
          aria-label={`${branch.name} is ${isActive ? 'active' : 'inactive'}`}
        />
      </td>
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
    code: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    city: PropTypes.string,
    colorCode: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  statusBusy: PropTypes.bool.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(BranchRow)
