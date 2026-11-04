import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { ACTION_ICONS } from '@/constants/icons'
import { MACHINE_STATUS, modeTypeOf } from '@/constants/machines'
import { machineMonitorPath } from '@/constants/monitoring'
import { ROUTES } from '@/constants/routes'
import MachineMode from '@/pages/Machines/MachineMode'
import MachineSilhouette from './MachineSilhouette'

// Monitoring › Machines card: Active / Inactive strip, machine picture with its number (red dot
// when offline), then name, model, brand / controller, the mode it is in now and the Health /
// Productivity links. No set-up actions here (those are on All Machines).
function MonitorMachineCard({ machine, showCustomer }) {
  const isActive = machine.status !== MACHINE_STATUS.INACTIVE

  return (
    <Card className={`ts-monitor-card h-100${isActive ? '' : ' is-inactive'}`}>
      <div className={`ts-monitor-card-status ${isActive ? 'is-active' : 'is-inactive'}`}>
        <span className="ts-monitor-card-status-label">{isActive ? 'Active' : 'Inactive'}</span>
        <span className="ts-monitor-card-status-bar" aria-hidden="true" />
      </div>

      <div className="ts-monitor-card-media">
        {!machine.onlineStatus && (
          <span className="ts-monitor-card-offline" title="Offline">
            <span className="visually-hidden">Offline</span>
          </span>
        )}
        <MachineSilhouette className="ts-monitor-card-picture" />
        <span className="ts-monitor-card-tag font-tabular">Machine # {machine.id}</span>
      </div>

      <div className="ts-monitor-card-body">
        <h2 className="ts-monitor-card-name text-truncate" title={machine.name}>
          {machine.name}
        </h2>
        <div className="ts-monitor-card-meta text-truncate">{machine.modelName || '—'}</div>
        <div className="ts-monitor-card-meta text-truncate">
          {[machine.brandName, machine.controllerName].filter(Boolean).join(' ') || '—'}
        </div>
        {showCustomer && machine.customerName && (
          <div className="ts-monitor-card-meta small text-truncate">{machine.customerName}</div>
        )}

        <ul className="ts-monitor-card-links">
          {modeTypeOf(machine.modeId) && (
            <li>
              <MachineMode modeId={machine.modeId} />
            </li>
          )}
          <li>
            <Link to={machineMonitorPath(ROUTES.MACHINE_HEALTH, machine)}>
              <i className={`bi ${ACTION_ICONS.health}`} aria-hidden="true" />
              Health
            </Link>
          </li>
          <li>
            <Link to={machineMonitorPath(ROUTES.MACHINE_PRODUCTIVITY, machine)}>
              <i className={`bi ${ACTION_ICONS.productivity}`} aria-hidden="true" />
              Productivity
            </Link>
          </li>
        </ul>
      </div>
    </Card>
  )
}

MonitorMachineCard.propTypes = {
  machine: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    customerName: PropTypes.string,
    modelName: PropTypes.string,
    brandName: PropTypes.string,
    controllerName: PropTypes.string,
    onlineStatus: PropTypes.bool,
    status: PropTypes.string,
    modeId: PropTypes.number,
  }).isRequired,
  showCustomer: PropTypes.bool.isRequired,
}

export default MonitorMachineCard
