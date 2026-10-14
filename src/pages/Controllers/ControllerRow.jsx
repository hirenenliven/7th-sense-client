import { memo } from 'react'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
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

function ControllerRow({ controller, onEdit, onDelete }) {
  return (
    <tr>
      <td className="font-tabular">{controller.id}</td>
      <td>
        <div className="fw-semibold">{controller.name}</div>
        {controller.description && <div className="small text-body-secondary text-truncate">{controller.description}</div>}
      </td>
      <td className="text-body-secondary">{controller.brandName || '—'}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(controller.updatedAt)}</td>
      <td className="border-start">
        <div className="d-flex gap-1">
          <IconAction icon="bi-pencil-square" label={`Edit ${controller.name}`} onClick={() => onEdit(controller)} />
          <IconAction icon="bi-trash3" label={`Delete ${controller.name}`} onClick={() => onDelete(controller)} />
        </div>
      </td>
    </tr>
  )
}

ControllerRow.propTypes = {
  controller: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    brandName: PropTypes.string,
    description: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(ControllerRow)
