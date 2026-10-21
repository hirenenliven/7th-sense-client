import { memo } from 'react'
import { Badge, Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import StatusBadge from '@/components/common/StatusBadge'
import { ACTION_ICONS } from '@/constants/icons'
import { MACHINE_STATUS } from '@/constants/machines'
import { formatDate } from '@/utils/helpers'
import { useTranslation } from 'react-i18next'

// Card view of a machine (same data and actions as MachineRow); the footer links to its Machine Health page.
function MachineCard({ machine, showCustomer, canEdit, canDelete, healthPath, onEdit, onDelete }) {
  const { t } = useTranslation()
  const isActive = machine.status !== MACHINE_STATUS.INACTIVE
  const details = [
    ...(showCustomer ? [{ label: t('Customer'), value: machine.customerName }] : []),
    { label: t('Model'), value: machine.modelName },
    { label: t('Brand / Controller'), value: [machine.brandName, machine.controllerName].filter(Boolean).join(' · ') },
    { label: t('Line'), value: machine.lineName },
    { label: t('Installed'), value: machine.installationDate && formatDate(machine.installationDate) },
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
          {canEdit && (
            <div className="d-flex gap-1 flex-shrink-0">
              <IconAction icon={ACTION_ICONS.edit} label={t('Edit {{name}}', { name: machine.name })} onClick={() => onEdit(machine)} />
              {canDelete && (
                <IconAction danger icon={ACTION_ICONS.delete} label={t('Delete {{name}}', { name: machine.name })} onClick={() => onDelete(machine)} />
              )}
            </div>
          )}
        </div>

        <div className="d-flex flex-wrap gap-2">
          <Badge bg="" className={machine.onlineStatus ? 'badge-soft-success' : 'badge-outline-muted'}>
            {machine.onlineStatus ? t('Online') : t('Offline')}
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

        <div className="mt-auto">
          <Button as={Link} to={healthPath} variant="ghost" size="sm">
            <i className={`bi ${ACTION_ICONS.health} me-2`} aria-hidden="true" />
            {t('Health')}
          </Button>
        </div>
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
  canEdit: PropTypes.bool.isRequired,
  canDelete: PropTypes.bool.isRequired,
  healthPath: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(MachineCard)
