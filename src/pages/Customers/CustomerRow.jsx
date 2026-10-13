import { memo } from 'react'
import { Button, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { USER_STATUS } from '@/constants/app'
import { customerMobile, customerName } from './customerFormat'

// Square orange icon button used in the Statement / View / Actions cells
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

function CustomerRow({ customer, statusBusy, onToggleStatus, onView, onEdit, onDelete, onUnavailable }) {
  const name = customerName(customer)
  const isActive = customer.status !== USER_STATUS.INACTIVE

  return (
    <tr>
      <td className="font-tabular">{customer.id}</td>
      <td>{customer.username}</td>
      <td className="fw-semibold">{name}</td>
      <td className="text-body-secondary">{customer.email}</td>
      <td className="text-nowrap text-body-secondary">{customerMobile(customer)}</td>
      <td>
        <Form.Check
          type="switch"
          id={`customer-status-${customer.id}`}
          checked={isActive}
          disabled={statusBusy}
          onChange={() => onToggleStatus(customer)}
          aria-label={`${name} is ${isActive ? 'active' : 'inactive'}`}
        />
      </td>
      <td>
        <IconAction icon="bi-eye" label={`Statement of ${name}`} onClick={() => onUnavailable('Statement')} />
      </td>
      <td>
        <IconAction icon="bi-eye" label={`View ${name}`} onClick={() => onView(customer)} />
      </td>
      <td className="border-start">
        <div className="d-flex gap-1">
          <IconAction icon="bi-gear" label={`Settings for ${name}`} onClick={() => onUnavailable('Customer settings')} />
          <IconAction icon="bi-box-arrow-right" label={`Log in as ${name}`} onClick={() => onUnavailable('Log in as customer')} />
          <IconAction icon="bi-pencil-square" label={`Edit ${name}`} onClick={() => onEdit(customer)} />
          <IconAction icon="bi-trash3" label={`Delete ${name}`} onClick={() => onDelete(customer)} />
        </div>
      </td>
    </tr>
  )
}

CustomerRow.propTypes = {
  customer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string,
    email: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  statusBusy: PropTypes.bool.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUnavailable: PropTypes.func.isRequired,
}

export default memo(CustomerRow)
