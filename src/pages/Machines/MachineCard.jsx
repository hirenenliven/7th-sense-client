import { Badge, Card } from 'react-bootstrap'
import PropTypes from 'prop-types'
import StatusBadge from '@/components/common/StatusBadge'
import { MACHINE_STATUS } from '@/constants/machines'
import { formatDate } from '@/utils/helpers'

// Card view of a machine (same data as MachineRow). The page passes `actions` (header icons, e.g. Edit /
// Delete on All Machines) and `footer` (e.g. Productivity / Health links on Monitoring).
function MachineCard({ machine, showCustomer, actions, footer }) {
  const isActive = machine.status !== MACHINE_STATUS.INACTIVE
  const details = [
    ...(showCustomer ? [{ label: 'Customer', value: machine.customerName }] : []),
    { label: 'Model', value: machine.modelName },
    { label: 'Brand / Controller', value: [machine.brandName, machine.controllerName].filter(Boolean).join(' · ') },
    { label: 'Line', value: machine.lineName },
    { label: 'Installed', value: machine.installationDate && formatDate(machine.installationDate) },
  ]

  return (
    <Card className={`ts-machine-card h-100${isActive ? '' : ' is-inactive'}`}>
      <Card.Body className="d-flex flex-column gap-3">
        <div className="d-flex align-items-start gap-3">
          <span className="ts-machine-card-icon" aria-hidden="true">
            <i className="bi bi-cpu" />
          </span>
          <div className="flex-grow-1 ts-machine-card-heading">
            <h2 className="ts-machine-card-name text-truncate">{machine.name}</h2>
            <div className="small text-body-secondary font-tabular">
              #{machine.id}
              {machine.serialNumber && ` · ${machine.serialNumber}`}
            </div>
          </div>
          {actions && <div className="d-flex gap-1 flex-shrink-0">{actions}</div>}
        </div>

        <div className="d-flex flex-wrap gap-2">
          <Badge bg="" className={machine.onlineStatus ? 'badge-soft-success' : 'badge-outline-muted'}>
            {machine.onlineStatus ? 'Online' : 'Offline'}
          </Badge>
          <StatusBadge active={isActive} />
        </div>

        <dl className="ts-machine-card-details">
          {details.map((detail) => (
            <div key={detail.label}>
              <dt>{detail.label}</dt>
              <dd className="text-truncate">{detail.value || '—'}</dd>
            </div>
          ))}
        </dl>

        {footer && <div className="mt-auto d-flex flex-wrap gap-2">{footer}</div>}
      </Card.Body>
    </Card>
  )
}

MachineCard.propTypes = {
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
  actions: PropTypes.node,
  footer: PropTypes.node,
}

export default MachineCard
