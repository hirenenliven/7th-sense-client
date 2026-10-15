import { useMemo } from 'react'
import { Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { CUSTOMER_ROLE_ID } from '@/constants/app'
import useOrgUser from '@/hooks/useOrgUser'
import { customerName } from '@/pages/Customers/customerFormat'

const customerLabel = (user) => {
  const name = customerName(user)
  return name === '—' ? user.username : `${name} (${user.username})`
}

// Customer select of the Masters › Country … Supervisor form modals: the superadmin picks whose
// organization the row is saved to (the customers from OrgUserProvider). Renders nothing for
// other roles, who always save to their own company. Locked when editing: a row stays with its
// customer (its parents belong to it).
function OrgCustomerField({ id, registration, locked = false, disabled = false, error }) {
  const { canPickUser, users, usersError } = useOrgUser()

  const customers = useMemo(
    () =>
      users
        .filter((user) => user.roleId === CUSTOMER_ROLE_ID)
        .sort((a, b) => customerLabel(a).localeCompare(customerLabel(b), undefined, { sensitivity: 'base' })),
    [users],
  )

  if (!canPickUser) return null

  return (
    <Form.Group controlId={id} className="mb-3">
      <Form.Label className="required">Customer</Form.Label>
      <Form.Select {...registration} disabled={disabled || locked} isInvalid={Boolean(error)}>
        <option value="">{usersError ? 'Customers unavailable' : 'Select customer'}</option>
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customerLabel(customer)}
          </option>
        ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      {!error && locked && <Form.Text>A saved row stays with its customer.</Form.Text>}
    </Form.Group>
  )
}

OrgCustomerField.propTypes = {
  id: PropTypes.string.isRequired,
  // register('customerId', …) of the form
  registration: PropTypes.object.isRequired,
  locked: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
}

export default OrgCustomerField
