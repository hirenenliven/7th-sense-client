import { memo } from 'react'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import StatusBadge from '@/components/common/StatusBadge'
import { ACTION_ICONS } from '@/constants/icons'
import { SHIFT_STATUS } from '@/constants/shifts'
import { formatClock12, minutesBetween } from '@/utils/dateTime'

// showCustomer (superadmin): the customer column; canManage (managers): edit and delete
function BreakRow({ shiftBreak, showCustomer, canManage, isEditing, onEdit, onDelete }) {
  const isActive = shiftBreak.status !== SHIFT_STATUS.INACTIVE

  return (
    <tr className={isEditing ? 'table-active' : undefined}>
      <td className="font-tabular">{shiftBreak.id}</td>
      <td className="fw-semibold">{shiftBreak.name}</td>
      {showCustomer && <td>{shiftBreak.customerName || '—'}</td>}
      <td>{shiftBreak.shiftName || <span className="text-body-secondary">No shift</span>}</td>
      <td className="font-tabular text-nowrap">{formatClock12(shiftBreak.startTime)}</td>
      <td className="font-tabular text-nowrap">{formatClock12(shiftBreak.endTime)}</td>
      <td className="font-tabular text-nowrap text-body-secondary">{minutesBetween(shiftBreak.startTime, shiftBreak.endTime)} min</td>
      <td>
        <StatusBadge active={isActive} />
      </td>
      {canManage && (
        <td className="border-start">
          <div className="d-flex gap-1">
            <IconAction icon={ACTION_ICONS.edit} label={`Edit ${shiftBreak.name}`} onClick={() => onEdit(shiftBreak)} />
            <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${shiftBreak.name}`} onClick={() => onDelete(shiftBreak)} />
          </div>
        </td>
      )}
    </tr>
  )
}

BreakRow.propTypes = {
  shiftBreak: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    customerName: PropTypes.string,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    shiftName: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  showCustomer: PropTypes.bool.isRequired,
  canManage: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(BreakRow)
