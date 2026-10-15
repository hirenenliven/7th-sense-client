import { memo } from 'react'
import { Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import useOrgUser from '@/hooks/useOrgUser'
import { ACTION_ICONS } from '@/constants/icons'
import { BRANCH_STATUS } from '@/constants/app'

// canManage (superadmin): the status switch works and the edit / delete actions show
function BranchRow({ branch, canManage, statusBusy, onToggleStatus, onEdit, onDelete }) {
  const isActive = branch.status !== BRANCH_STATUS.INACTIVE
  const { customerLabel } = useOrgUser()

  return (
    <tr>
      <td className="font-tabular">{branch.id}</td>
      <td className="font-tabular">{branch.code}</td>
      <td className="fw-semibold">{branch.name}</td>
      <td className="text-body-secondary">{customerLabel(branch.customerId)}</td>
      <td className="text-body-secondary">{branch.email || '—'}</td>
      <td className="text-body-secondary">{branch.cityName || '—'}</td>
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
          disabled={!canManage || statusBusy}
          onChange={() => onToggleStatus(branch)}
          aria-label={`${branch.name} is ${isActive ? 'active' : 'inactive'}`}
        />
      </td>
      {canManage && (
        <td className="border-start">
          <div className="d-flex gap-1">
            <IconAction icon={ACTION_ICONS.edit} label={`Edit ${branch.name}`} onClick={() => onEdit(branch)} />
            <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${branch.name}`} onClick={() => onDelete(branch)} />
          </div>
        </td>
      )}
    </tr>
  )
}

BranchRow.propTypes = {
  branch: PropTypes.shape({
    id: PropTypes.number.isRequired,
    code: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    customerId: PropTypes.number,
    cityName: PropTypes.string,
    colorCode: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  canManage: PropTypes.bool.isRequired,
  statusBusy: PropTypes.bool.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(BranchRow)
