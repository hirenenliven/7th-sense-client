import { Badge } from 'react-bootstrap'
import PropTypes from 'prop-types'
import StatusBadge from '@/components/common/StatusBadge'
import { MACHINE_STATUS, modeTypeOf } from '@/constants/machines'
import MachineMode from '@/pages/Machines/MachineMode'
import { MachineCycles, MachineOee } from './MachineMetrics'
import { summaryShape } from './monitorTable'

// One machine of the Monitoring table (columns: monitorColumns in monitorTable.js), today's OEE and
// cycles from `summary`
function MonitorMachineRow({ machine, showCustomer, summary, actions }) {
  const isActive = machine.status !== MACHINE_STATUS.INACTIVE
  const brand = [machine.brandName, machine.controllerName].filter(Boolean).join(' · ')

  return (
    <tr>
      <td>
        <div className="fw-semibold">{machine.name}</div>
        <div className="small text-body-secondary font-tabular">
          {[`# ${machine.id}`, machine.lineName].filter(Boolean).join(' · ')}
        </div>
      </td>
      {showCustomer && <td className="text-body-secondary">{machine.customerName || '—'}</td>}
      <td>
        <div>{machine.modelName || '—'}</div>
        {brand && <div className="small text-body-secondary">{brand}</div>}
      </td>
      <td className="text-nowrap">
        {modeTypeOf(machine.modeId) ? <MachineMode modeId={machine.modeId} /> : <span className="text-body-secondary">—</span>}
      </td>
      <td className="text-nowrap">
        <MachineOee summary={summary} />
      </td>
      <td className="text-nowrap">
        <MachineCycles summary={summary} />
      </td>
      <td>
        <div className="d-flex flex-column align-items-start gap-1">
          <Badge bg="" className={machine.onlineStatus ? 'badge-soft-success' : 'badge-outline-muted'}>
            {machine.onlineStatus ? 'Online' : 'Offline'}
          </Badge>
          {!isActive && <StatusBadge active={false} />}
        </div>
      </td>
      <td className="border-start">
        <div className="d-flex gap-1">{actions}</div>
      </td>
    </tr>
  )
}

MonitorMachineRow.propTypes = {
  machine: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    customerName: PropTypes.string,
    modelName: PropTypes.string,
    brandName: PropTypes.string,
    controllerName: PropTypes.string,
    lineName: PropTypes.string,
    onlineStatus: PropTypes.bool,
    status: PropTypes.string,
    modeId: PropTypes.number,
  }).isRequired,
  showCustomer: PropTypes.bool.isRequired,
  summary: summaryShape,
  actions: PropTypes.node,
}

export default MonitorMachineRow
