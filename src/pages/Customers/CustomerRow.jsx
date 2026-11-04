import { memo } from 'react'
import { Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import { ACTION_ICONS } from '@/constants/icons'
import { ROLE_LABELS, USER_STATUS } from '@/constants/app'
import { ACCOUNT_KIND } from './accountPages'
import { customerMobile, customerName } from './customerFormat'

// One account of CustomerList. Users show their role; customers the customer-only settings
// action, and their View logs in as the customer in a new tab. `customerLabel`: the user's company, shown only in the superadmin's
// Users list.
function CustomerRow({ kind = ACCOUNT_KIND.CUSTOMER, customer, customerLabel, statusBusy, onToggleStatus, onView, onEdit, onDelete, onUnavailable }) {
  const isUser = kind === ACCOUNT_KIND.USER
  const name = customerName(customer)
  const isActive = customer.status !== USER_STATUS.INACTIVE

  return (
    <tr>
      <td className="font-tabular">{customer.id}</td>
      <td>{customer.username}</td>
      <td className="fw-semibold">{name}</td>
      {isUser && <td>{ROLE_LABELS[customer.role] ?? customer.role}</td>}
      {customerLabel !== undefined && <td>{customerLabel}</td>}
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
        <IconAction
          icon={ACTION_ICONS.view}
          label={isUser ? `View ${name}` : `Log in as ${name} (new tab)`}
          onClick={() => onView(customer)}
        />
      </td>
      <td className="border-start">
        <div className="d-flex gap-1">
          {!isUser && (
            <IconAction icon={ACTION_ICONS.settings} label={`Settings for ${name}`} onClick={() => onUnavailable('Customer settings')} />
          )}
          <IconAction icon={ACTION_ICONS.edit} label={`Edit ${name}`} onClick={() => onEdit(customer)} />
          <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${name}`} onClick={() => onDelete(customer)} />
        </div>
      </td>
    </tr>
  )
}

CustomerRow.propTypes = {
  kind: PropTypes.oneOf(Object.values(ACCOUNT_KIND)),
  customer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string,
    role: PropTypes.string,
    email: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  customerLabel: PropTypes.string,
  statusBusy: PropTypes.bool.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUnavailable: PropTypes.func.isRequired,
}

export default memo(CustomerRow)
