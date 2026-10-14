import { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import OrgUserContext from './OrgUserContext'
import useAuth from '@/hooks/useAuth'
import { getUsers } from '@/services/customerService'
import { MANAGERS, SUPERADMIN_ONLY } from '@/constants/app'

// Whose organization (Masters › Countries … Supervisors) the screens show and change.
// Every user works on their own; an admin can pick another user, and that choice stays
// while moving between the Masters screens. userId '' = the logged-in user.
// Only the superadmin may act for another user (server: targetUserID).
function OrgUserProvider({ children }) {
  const { user, hasRole } = useAuth()
  const isAdmin = Boolean(user) && hasRole(SUPERADMIN_ONLY)
  // Members read their company's organization; only managers change it (server: managersOnly)
  const canEdit = Boolean(user) && hasRole(MANAGERS)

  const [selection, setSelection] = useState({ ownerId: null, userId: '' })
  const [users, setUsers] = useState([])
  const [usersError, setUsersError] = useState('')

  // A pick belongs to the admin who made it: a new login starts on their own organization
  const userId = selection.ownerId === user?.id ? selection.userId : ''
  const setUserId = useCallback((nextUserId) => setSelection({ ownerId: user?.id ?? null, userId: nextUserId }), [user])

  // Only the superadmin picks another user, from every user (GET /users)
  useEffect(() => {
    if (!isAdmin) return undefined
    let active = true
    getUsers()
      .then((list) => {
        if (!active) return
        setUsers(list)
        setUsersError('')
      })
      .catch((err) => active && setUsersError(err.message))
    return () => {
      active = false
    }
  }, [isAdmin])

  const value = useMemo(
    () => ({
      canPickUser: isAdmin,
      canEdit,
      userId,
      setUserId,
      users: isAdmin ? users : [],
      usersError: isAdmin ? usersError : '',
      // The picked user's record; null while working on the logged-in user's own organization
      selectedUser: (userId && users.find((option) => String(option.id) === userId)) || null,
    }),
    [isAdmin, canEdit, userId, setUserId, users, usersError],
  )

  return <OrgUserContext.Provider value={value}>{children}</OrgUserContext.Provider>
}

OrgUserProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default OrgUserProvider
