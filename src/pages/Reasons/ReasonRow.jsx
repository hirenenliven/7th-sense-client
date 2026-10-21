import { memo } from 'react'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import StatusBadge from '@/components/common/StatusBadge'
import { ACTION_ICONS } from '@/constants/icons'
import { REASON_STATUS } from './reasonForm'

// showCustomer (superadmin): the customer column; canManage (managers): edit and delete
function ReasonRow({ reason, showCustomer, canManage, onEdit, onDelete }) {
  return (
    <tr>
      <td className="font-tabular">{reason.id}</td>
      <td className="font-tabular">{reason.reasonCode || '—'}</td>
      <td className="fw-semibold">{reason.reason}</td>
      {showCustomer && <td>{reason.customerName || '—'}</td>}
      <td>
        <StatusBadge active={reason.status !== REASON_STATUS.INACTIVE} />
      </td>
      {canManage && (
        <td className="border-start">
          <div className="d-flex gap-1">
            <IconAction icon={ACTION_ICONS.edit} label={`Edit ${reason.reason}`} onClick={() => onEdit(reason)} />
            <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${reason.reason}`} onClick={() => onDelete(reason)} />
          </div>
        </td>
      )}
    </tr>
  )
}

ReasonRow.propTypes = {
  reason: PropTypes.shape({
    id: PropTypes.number.isRequired,
    reasonCode: PropTypes.string,
    reason: PropTypes.string.isRequired,
    customerName: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  showCustomer: PropTypes.bool.isRequired,
  canManage: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(ReasonRow)
