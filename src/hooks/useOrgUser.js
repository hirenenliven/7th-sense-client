import { useContext } from 'react'
import OrgUserContext from '@/context/OrgUserContext'

// { customerLabel, canPickUser, canEdit, canAssign, users, usersError, reloadUsers } — see context/OrgUserProvider.jsx
export default function useOrgUser() {
  const context = useContext(OrgUserContext)
  if (!context) throw new Error('useOrgUser must be used inside <OrgUserProvider>')
  return context
}
