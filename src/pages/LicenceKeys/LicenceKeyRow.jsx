import { memo } from 'react'
import { Badge } from 'react-bootstrap'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import StatusBadge from '@/components/common/StatusBadge'
import { ACTION_ICONS } from '@/constants/icons'
import { formatDate } from '@/utils/helpers'
import { LICENCE_KEY_STATUS, durationLabel } from './licenceKeyForm'

// number: Sr. No. in the filtered list. showCustomer (superadmin): the customer column;
// canManage (superadmin): edit and delete
function LicenceKeyRow({ licenceKey, number, showCustomer, canManage, onCopy, onEdit, onDelete }) {
  return (
    <tr>
      <td className="font-tabular">{number}</td>
      {showCustomer && <td>{licenceKey.customerName || '—'}</td>}
      <td>
        <div className="d-flex align-items-center gap-1">
          <span className="font-monospace fw-semibold text-nowrap">{licenceKey.licenceKey}</span>
          <IconAction icon="bi-clipboard" label={`Copy ${licenceKey.licenceKey}`} onClick={() => onCopy(licenceKey)} />
        </div>
      </td>
      <td className="text-nowrap">{durationLabel(licenceKey.duration)}</td>
      <td className="text-nowrap">{formatDate(licenceKey.createdAt)}</td>
      <td className="text-nowrap">
        {licenceKey.expiresOn ? formatDate(`${licenceKey.expiresOn}T00:00`) : 'Never'}
        {licenceKey.isExpired && (
          <Badge bg="" className="badge-soft-danger ms-2">
            Expired
          </Badge>
        )}
      </td>
      <td>
        <StatusBadge active={licenceKey.status !== LICENCE_KEY_STATUS.INACTIVE} />
      </td>
      {canManage && (
        <td className="border-start">
          <div className="d-flex gap-1">
            <IconAction icon={ACTION_ICONS.edit} label={`Edit ${licenceKey.licenceKey}`} onClick={() => onEdit(licenceKey)} />
            <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${licenceKey.licenceKey}`} onClick={() => onDelete(licenceKey)} />
          </div>
        </td>
      )}
    </tr>
  )
}

LicenceKeyRow.propTypes = {
  licenceKey: PropTypes.shape({
    id: PropTypes.number.isRequired,
    licenceKey: PropTypes.string.isRequired,
    customerName: PropTypes.string,
    duration: PropTypes.string,
    createdAt: PropTypes.string,
    expiresOn: PropTypes.string,
    isExpired: PropTypes.bool,
    status: PropTypes.string,
  }).isRequired,
  number: PropTypes.number.isRequired,
  showCustomer: PropTypes.bool.isRequired,
  canManage: PropTypes.bool.isRequired,
  onCopy: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(LicenceKeyRow)
