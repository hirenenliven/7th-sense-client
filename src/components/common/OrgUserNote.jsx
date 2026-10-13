import useOrgUser from '@/hooks/useOrgUser'
import { customerName } from '@/pages/Customers/customerFormat'

// Form-modal reminder that an admin is saving into another user's organization.
// Renders nothing while working on the logged-in user's own organization.
function OrgUserNote() {
  const { selectedUser } = useOrgUser()
  if (!selectedUser) return null

  const name = customerName(selectedUser)
  return (
    <p className="small text-body-secondary mb-3">
      <i className="bi bi-person-badge me-2" aria-hidden="true" />
      Saving for <strong>{name === '—' ? selectedUser.username : name}</strong> ({selectedUser.username})
    </p>
  )
}

export default OrgUserNote
