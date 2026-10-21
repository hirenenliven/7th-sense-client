import { memo } from 'react'
import { Badge } from 'react-bootstrap'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import StatusBadge from '@/components/common/StatusBadge'
import { ACTION_ICONS } from '@/constants/icons'
import { MACHINE_STATUS } from '@/constants/machines'
import { formatDate } from '@/utils/helpers'
import { useTranslation } from 'react-i18next'

// showCustomer (superadmin): the customer column. Health is open to everyone; canEdit (managers) /
// canDelete (superadmin) add the Edit / Delete actions.
function MachineRow({ machine, showCustomer, canEdit, canDelete, onHealth, onEdit, onDelete }) {
  const { t } = useTranslation()
  const isActive = machine.status !== MACHINE_STATUS.INACTIVE

  return (
    <tr>
      <td className="font-tabular">{machine.id}</td>
      <td>
        <div className="fw-semibold">{machine.name}</div>
        <div className="small text-body-secondary font-tabular">{machine.serialNumber}</div>
      </td>
      {showCustomer && <td>{machine.customerName || '—'}</td>}
      <td className="text-body-secondary">{machine.modelName || '—'}</td>
      <td className="text-body-secondary">
        {machine.brandName || '—'}
        {machine.controllerName && <div className="small">{machine.controllerName}</div>}
      </td>
      <td className="text-body-secondary">{machine.lineName || '—'}</td>
      <td className="text-body-secondary text-nowrap">{machine.installationDate ? formatDate(machine.installationDate) : '—'}</td>
      <td>
        <Badge bg="" className={machine.onlineStatus ? 'badge-soft-success' : 'badge-outline-muted'}>
          {machine.onlineStatus ? t('Online') : t('Offline')}
        </Badge>
      </td>
      <td>
        <StatusBadge active={isActive} />
      </td>
      <td className="border-start">
        <div className="d-flex gap-1">
          <IconAction icon={ACTION_ICONS.health} label={t('{{name}} health', { name: machine.name })} onClick={() => onHealth(machine)} />
          {canEdit && <IconAction icon={ACTION_ICONS.edit} label={t('Edit {{name}}', { name: machine.name })} onClick={() => onEdit(machine)} />}
          {canEdit && canDelete && (
            <IconAction danger icon={ACTION_ICONS.delete} label={t('Delete {{name}}', { name: machine.name })} onClick={() => onDelete(machine)} />
          )}
        </div>
      </td>
    </tr>
  )
}

MachineRow.propTypes = {
  machine: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    serialNumber: PropTypes.string,
    customerName: PropTypes.string,
    modelName: PropTypes.string,
    brandName: PropTypes.string,
    controllerName: PropTypes.string,
    lineName: PropTypes.string,
    installationDate: PropTypes.string,
    onlineStatus: PropTypes.bool,
    status: PropTypes.string,
  }).isRequired,
  showCustomer: PropTypes.bool.isRequired,
  canEdit: PropTypes.bool.isRequired,
  canDelete: PropTypes.bool.isRequired,
  onHealth: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(MachineRow)
