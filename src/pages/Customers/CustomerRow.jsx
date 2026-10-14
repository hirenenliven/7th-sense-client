import { memo } from 'react'
import { Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import { ACTION_ICONS } from '@/constants/icons'
import { USER_STATUS } from '@/constants/app'
import { customerMobile, customerName } from './customerFormat'

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
        <IconAction icon={ACTION_ICONS.statement} label={`Statement of ${name}`} onClick={() => onUnavailable('Statement')} />
      </td>
      <td>
        <IconAction icon={ACTION_ICONS.view} label={`View ${name}`} onClick={() => onView(customer)} />
      </td>
      <td className="border-start">
        <div className="d-flex gap-1">
          <IconAction icon={ACTION_ICONS.settings} label={`Settings for ${name}`} onClick={() => onUnavailable('Customer settings')} />
          <IconAction icon={ACTION_ICONS.loginAs} label={`Log in as ${name}`} onClick={() => onUnavailable('Log in as customer')} />
          <IconAction icon={ACTION_ICONS.edit} label={`Edit ${name}`} onClick={() => onEdit(customer)} />
          <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${name}`} onClick={() => onDelete(customer)} />
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
