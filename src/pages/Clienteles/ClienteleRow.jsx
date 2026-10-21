import { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import IconAction from '@/components/common/IconAction'
import StatusBadge from '@/components/common/StatusBadge'
import { ACTION_ICONS } from '@/constants/icons'
import { getCountryName, getStateName } from '@/constants/locations'
import { CLIENTELE_STATUS } from './clienteleForm'

// showCustomer (superadmin): the customer column; canManage (managers): edit and delete
function ClienteleRow({ clientele, showCustomer, canManage, onEdit, onDelete }) {
  const { t } = useTranslation()
  const isActive = clientele.status !== CLIENTELE_STATUS.INACTIVE
  // Names; rows saved before migration 018 hold ISO codes
  const country = getCountryName(clientele.countryName) || clientele.countryName
  const state = getStateName(clientele.countryName, clientele.stateName) || clientele.stateName

  return (
    <tr>
      <td className="font-tabular">{clientele.id}</td>
      <td className="font-tabular">{clientele.clientCode}</td>
      <td className="fw-semibold">{clientele.name}</td>
      {showCustomer && <td>{clientele.customerName || '—'}</td>}
      <td>
        <div className="font-tabular text-nowrap">{clientele.contactNumber}</div>
        {clientele.email && <div className="small text-body-secondary">{clientele.email}</div>}
      </td>
      <td className="text-body-secondary">
        {clientele.city}
        <div className="small">{[state, country].filter(Boolean).join(', ')}</div>
      </td>
      <td>
        <StatusBadge active={isActive} />
      </td>
      {canManage && (
        <td className="border-start">
          <div className="d-flex gap-1">
            <IconAction icon={ACTION_ICONS.edit} label={t('Edit {{name}}', { name: clientele.name })} onClick={() => onEdit(clientele)} />
            <IconAction danger icon={ACTION_ICONS.delete} label={t('Delete {{name}}', { name: clientele.name })} onClick={() => onDelete(clientele)} />
          </div>
        </td>
      )}
    </tr>
  )
}

ClienteleRow.propTypes = {
  clientele: PropTypes.shape({
    id: PropTypes.number.isRequired,
    clientCode: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    customerName: PropTypes.string,
    email: PropTypes.string,
    contactNumber: PropTypes.string,
    countryName: PropTypes.string,
    stateName: PropTypes.string,
    city: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  showCustomer: PropTypes.bool.isRequired,
  canManage: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(ClienteleRow)
