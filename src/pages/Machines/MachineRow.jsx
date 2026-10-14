import { memo } from 'react'
import { Badge, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { MACHINE_STATUS } from '@/constants/machines'
import { formatDate } from '@/utils/helpers'

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

// `canManage` (admins): shows the customer column and the edit / delete actions
function MachineRow({ machine, canManage, onEdit, onDelete }) {
  const isActive = machine.status !== MACHINE_STATUS.INACTIVE

  return (
    <tr>
      <td className="font-tabular">{machine.id}</td>
      <td>
        <div className="fw-semibold">{machine.name}</div>
        <div className="small text-body-secondary font-tabular">{machine.serialNumber}</div>
      </td>
      {canManage && <td>{machine.customerName || '—'}</td>}
      <td className="text-body-secondary">{machine.modelName || '—'}</td>
      <td className="text-body-secondary">
        {machine.brandName || '—'}
        {machine.controllerName && <div className="small">{machine.controllerName}</div>}
      </td>
      <td className="text-body-secondary">{machine.lineName || '—'}</td>
      <td className="text-body-secondary text-nowrap">{machine.installationDate ? formatDate(machine.installationDate) : '—'}</td>
      <td>
        <Badge bg="" className={machine.onlineStatus ? 'badge-soft-success' : 'badge-outline-muted'}>
          {machine.onlineStatus ? 'Online' : 'Offline'}
        </Badge>
      </td>
      <td>
        <Badge bg="" className={isActive ? 'badge-outline-success' : 'badge-outline-muted'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      </td>
      {canManage && (
        <td className="border-start">
          <div className="d-flex gap-1">
            <IconAction icon="bi-pencil-square" label={`Edit ${machine.name}`} onClick={() => onEdit(machine)} />
            <IconAction icon="bi-trash3" label={`Delete ${machine.name}`} onClick={() => onDelete(machine)} />
          </div>
        </td>
      )}
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
  canManage: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(MachineRow)
