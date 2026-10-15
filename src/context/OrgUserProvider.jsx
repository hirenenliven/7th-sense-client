import { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import OrgUserContext from './OrgUserContext'
import useAuth from '@/hooks/useAuth'
import { getUsers } from '@/services/customerService'
import { MANAGERS, SUPERADMIN_ONLY } from '@/constants/app'
import { customerName } from '@/pages/Customers/customerFormat'

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

  // Customer column of the Masters tables: a row's owner (userId / customerId) → company name.
  // The superadmin has every user; other users only see their own company's rows.
  const customerLabel = useCallback(
    (ownerId) => {
      const owner = users.find((option) => option.id === ownerId)
      if (owner) return customerName(owner) === '—' ? owner.username : customerName(owner)
      if (user && (ownerId === user.id || ownerId === user.companyId)) {
        return user.companyProfile?.companyName || user.companyName || user.username
      }
      return '—'
    },
    [users, user],
  )

  const value = useMemo(
    () => ({
      customerLabel,
      canPickUser: isAdmin,
      canEdit,
      // Countries and states are assigned customer-wise by the superadmin only (server: superAdminOnly)
      canAssign: isAdmin,
      userId,
      setUserId,
      users: isAdmin ? users : [],
      usersError: isAdmin ? usersError : '',
      // The picked user's record; null while working on the logged-in user's own organization
      selectedUser: (userId && users.find((option) => String(option.id) === userId)) || null,
    }),
    [customerLabel, isAdmin, canEdit, userId, setUserId, users, usersError],
  )

  return <OrgUserContext.Provider value={value}>{children}</OrgUserContext.Provider>
}

OrgUserProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default OrgUserProvider
