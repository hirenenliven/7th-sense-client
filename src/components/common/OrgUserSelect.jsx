import { useMemo } from 'react'
import { Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import useAuth from '@/hooks/useAuth'
import useOrgUser from '@/hooks/useOrgUser'
import { customerName } from '@/pages/Customers/customerFormat'

const userLabel = (user) => {
  const name = customerName(user)
  return name === '—' ? user.username : `${name} (${user.username})`
}

// Admin-only picker for whose organization a Masters screen shows and changes (see
// context/OrgUserProvider.jsx). Renders nothing for other roles. onChange runs after a new
// pick, so the screen can clear filters that belonged to the previous user.
function OrgUserSelect({ disabled = false, onChange }) {
  const { user } = useAuth()
  const { canPickUser, userId, setUserId, users, usersError } = useOrgUser()

  const options = useMemo(
    () => users.filter((option) => option.id !== user?.id).sort((a, b) => userLabel(a).localeCompare(userLabel(b))),
    [users, user],
  )

  if (!canPickUser) return null

  return (
    <Form.Select
      className="w-auto"
      value={userId}
      onChange={(event) => {
        setUserId(event.target.value)
        onChange?.()
      }}
      disabled={disabled}
      aria-label="Show and save for user"
      title={usersError ? `Could not load users: ${usersError}` : 'Show and save for user'}
    >
      <option value="">Me ({user?.username})</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {userLabel(option)}
        </option>
      ))}
    </Form.Select>
  )
}

OrgUserSelect.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
}

export default OrgUserSelect
