import { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import OrgUserContext from './OrgUserContext'
import useAuth from '@/hooks/useAuth'
import { getUsers } from '@/services/customerService'
import { MANAGERS, SUPERADMIN_ONLY } from '@/constants/app'
import { customerName } from '@/pages/Customers/customerFormat'

// What the Masters (organization) screens need to know about the logged-in user: whether they may
// edit, and for the superadmin, who works across companies, every user (customer pickers and the
// Customer column).
function OrgUserProvider({ children }) {
  const { user, hasRole } = useAuth()
  const isAdmin = Boolean(user) && hasRole(SUPERADMIN_ONLY)
  // Members read their company's organization; only managers change it (server: managersOnly)
  const canEdit = Boolean(user) && hasRole(MANAGERS)

  const [users, setUsers] = useState([])
  const [usersError, setUsersError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // Called after a customer or user is saved or deleted, so pickers and labels show the change
  const reloadUsers = useCallback(() => setReloadKey((key) => key + 1), [])

  // Only the superadmin picks a customer, from every user (GET /users)
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
  }, [isAdmin, reloadKey])

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
      users: isAdmin ? users : [],
      usersError: isAdmin ? usersError : '',
      reloadUsers,
    }),
    [customerLabel, isAdmin, canEdit, users, usersError, reloadUsers],
  )

  return <OrgUserContext.Provider value={value}>{children}</OrgUserContext.Provider>
}

OrgUserProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default OrgUserProvider
