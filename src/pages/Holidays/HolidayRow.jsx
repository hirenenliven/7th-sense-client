import { memo } from 'react'
import { Badge } from 'react-bootstrap'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import StatusBadge from '@/components/common/StatusBadge'
import { ACTION_ICONS } from '@/constants/icons'
import { HOLIDAY_TYPES, SHIFT_STATUS, WEEKDAYS } from '@/constants/shifts'
import { formatDate } from '@/utils/helpers'

const dayLabel = (weekDay) => WEEKDAYS.find((day) => day.id === weekDay)?.label ?? '—'

// number: Sr. No. in the filtered list. showCustomer (superadmin): the customer column;
// canManage (managers): edit and delete
function HolidayRow({ holiday, number, showCustomer, canManage, isEditing, onEdit, onDelete }) {
  const isWeekOff = holiday.holidayType === HOLIDAY_TYPES.WEEK_OFF
  const isActive = holiday.status !== SHIFT_STATUS.INACTIVE
  const label = holiday.name || (isWeekOff ? `${dayLabel(holiday.weekDay)} week off` : 'holiday')

  return (
    <tr className={isEditing ? 'table-active' : undefined}>
      <td className="font-tabular">{number}</td>
      <td>
        <Badge bg="" className={isWeekOff ? 'badge-soft-info' : 'badge-soft-primary'}>
          {isWeekOff ? 'Week Off' : 'Holiday'}
        </Badge>
      </td>
      {showCustomer && <td>{holiday.customerName || '—'}</td>}
      <td className="fw-semibold">{holiday.name || '—'}</td>
      <td className="text-nowrap">{holiday.startDate ? formatDate(`${holiday.startDate}T00:00`) : '—'}</td>
      <td className="text-nowrap">{holiday.endDate ? formatDate(`${holiday.endDate}T00:00`) : '—'}</td>
      <td>{isWeekOff ? dayLabel(holiday.weekDay) : '—'}</td>
      <td>
        <StatusBadge active={isActive} />
      </td>
      {canManage && (
        <td className="border-start">
          <div className="d-flex gap-1">
            <IconAction icon={ACTION_ICONS.edit} label={`Edit ${label}`} onClick={() => onEdit(holiday)} />
            <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${label}`} onClick={() => onDelete(holiday)} />
          </div>
        </td>
      )}
    </tr>
  )
}

HolidayRow.propTypes = {
  holiday: PropTypes.shape({
    id: PropTypes.number.isRequired,
    holidayType: PropTypes.string.isRequired,
    name: PropTypes.string,
    customerName: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    weekDay: PropTypes.number,
    status: PropTypes.string,
  }).isRequired,
  number: PropTypes.number.isRequired,
  showCustomer: PropTypes.bool.isRequired,
  canManage: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(HolidayRow)
