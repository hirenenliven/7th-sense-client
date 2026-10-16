import { memo } from 'react'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import StatusBadge from '@/components/common/StatusBadge'
import { ACTION_ICONS } from '@/constants/icons'
import { isoToDateText } from '@/utils/dateTime'
import { formatDate } from '@/utils/helpers'
import { SCHEDULE_STATUS, SCHEDULE_TYPE, scheduleDates } from './scheduleForm'

// showCustomer (superadmin): the customer column; canManage (managers): edit and delete
function ScheduleRow({ schedule, showCustomer, canManage, onEdit, onDelete }) {
  const label = `schedule of ${schedule.machineName} on ${isoToDateText(schedule.startDate)}`

  return (
    <tr>
      <td className="font-tabular">{schedule.id}</td>
      <td className="font-tabular text-nowrap">{scheduleDates(schedule)}</td>
      <td>{schedule.scheduleType === SCHEDULE_TYPE.MULTIPLE ? 'Multiple Day' : 'Single Day'}</td>
      <td className="fw-semibold">{schedule.machineName || '—'}</td>
      {showCustomer && <td>{schedule.customerName || '—'}</td>}
      <td className="font-tabular">{schedule.itemCount}</td>
      <td className="font-tabular">{schedule.totalQuantity}</td>
      <td>
        <StatusBadge active={schedule.status !== SCHEDULE_STATUS.INACTIVE} />
      </td>
      <td className="text-body-secondary text-nowrap">{formatDate(schedule.createdAt)}</td>
      {canManage && (
        <td className="border-start">
          <div className="d-flex gap-1">
            <IconAction icon={ACTION_ICONS.edit} label={`Edit ${label}`} onClick={() => onEdit(schedule)} />
            <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${label}`} onClick={() => onDelete(schedule)} />
          </div>
        </td>
      )}
    </tr>
  )
}

ScheduleRow.propTypes = {
  schedule: PropTypes.shape({
    id: PropTypes.number.isRequired,
    scheduleType: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    machineName: PropTypes.string,
    customerName: PropTypes.string,
    itemCount: PropTypes.number,
    totalQuantity: PropTypes.number,
    status: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  showCustomer: PropTypes.bool.isRequired,
  canManage: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(ScheduleRow)
