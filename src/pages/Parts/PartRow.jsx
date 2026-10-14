import { memo } from 'react'
import { Badge } from 'react-bootstrap'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import { ACTION_ICONS } from '@/constants/icons'
import { formatDate } from '@/utils/helpers'
import { secondsToDuration } from '@/utils/dateTime'
import { PART_STATUS } from './partForm'

// showCustomer (superadmin): the customer column; canManage (managers): edit and delete
function PartRow({ part, showCustomer, canManage, onEdit, onDelete }) {
  const isActive = part.status !== PART_STATUS.INACTIVE

  return (
    <tr>
      <td className="font-tabular">{part.id}</td>
      <td className="font-tabular">{part.partNo}</td>
      <td className="fw-semibold">{part.partName}</td>
      {showCustomer && <td>{part.customerName || '—'}</td>}
      <td className="font-tabular">{part.processCount}</td>
      <td className="font-tabular">{part.partCount}</td>
      <td className="font-tabular text-nowrap">
        {secondsToDuration(part.productionTime)}
        <div className="small text-body-secondary">{part.productionTime} sec.</div>
      </td>
      <td>
        <Badge bg="" className={isActive ? 'badge-outline-success' : 'badge-outline-muted'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      </td>
      <td className="text-body-secondary text-nowrap">{formatDate(part.createdAt)}</td>
      {canManage && (
        <td className="border-start">
          <div className="d-flex gap-1">
            <IconAction icon={ACTION_ICONS.edit} label={`Edit ${part.partName}`} onClick={() => onEdit(part)} />
            <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${part.partName}`} onClick={() => onDelete(part)} />
          </div>
        </td>
      )}
    </tr>
  )
}

PartRow.propTypes = {
  part: PropTypes.shape({
    id: PropTypes.number.isRequired,
    partNo: PropTypes.string.isRequired,
    partName: PropTypes.string.isRequired,
    customerName: PropTypes.string,
    processCount: PropTypes.number,
    partCount: PropTypes.number,
    productionTime: PropTypes.number,
    status: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  showCustomer: PropTypes.bool.isRequired,
  canManage: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(PartRow)
