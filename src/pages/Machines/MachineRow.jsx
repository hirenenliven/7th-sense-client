import { Badge } from 'react-bootstrap'
import PropTypes from 'prop-types'
import StatusBadge from '@/components/common/StatusBadge'
import { MACHINE_STATUS, modeTypeOf } from '@/constants/machines'
import { formatDate } from '@/utils/helpers'
import MachineMode from './MachineMode'

// showCustomer (superadmin): the customer column. showMode: the mode it is in now. `actions`: the page's buttons for this machine (All
// Machines: Edit / Delete; Monitoring: Productivity / Health); none = no Actions cell.
function MachineRow({ machine, showCustomer, showMode = false, actions }) {
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
      {showMode && (
        <td className="text-nowrap">
          {modeTypeOf(machine.modeId) ? <MachineMode modeId={machine.modeId} /> : <span className="text-body-secondary">—</span>}
        </td>
      )}
      <td>
        <Badge bg="" className={machine.onlineStatus ? 'badge-soft-success' : 'badge-outline-muted'}>
          {machine.onlineStatus ? 'Online' : 'Offline'}
        </Badge>
      </td>
      <td>
        <StatusBadge active={isActive} />
      </td>
      {actions && (
        <td className="border-start">
          <div className="d-flex gap-1">{actions}</div>
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
    modeId: PropTypes.number,
  }).isRequired,
  showCustomer: PropTypes.bool.isRequired,
  showMode: PropTypes.bool,
  actions: PropTypes.node,
}

export default MachineRow
