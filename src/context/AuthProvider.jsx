import { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import AuthContext from './AuthContext'
import { onUnauthorized } from '@/services/apiClient'
import * as authService from '@/services/authService'
import { refreshUserTheme } from '@/utils/theme'
import { toast } from '@/utils/toast'

const SESSION_EXPIRED_TOAST = 'session-expired'

// Holds the logged-in user. On load it asks the server for the current session (the cookie is
// HttpOnly, so the server is the only source of truth); until that answers, `isChecking` is true
// and protected routes show a loader instead of redirecting.
function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isChecking, setIsChecking] = useState(true)

  // Restore the session after a reload
  useEffect(() => {
    let active = true
    authService
      .getSession()
      .then((sessionUser) => {
        if (!active) return
        setUser(sessionUser)
        refreshUserTheme(sessionUser?.id)
      })
      .catch(() => active && setUser(null))
      .finally(() => active && setIsChecking(false))
    return () => {
      active = false
    }
  }, [])

  // Any 401 from the API means the session is gone: drop the user (routes redirect to login)
  useEffect(
    () =>
      onUnauthorized(() => {
        if (user) {
          toast.warning('Your session has ended. Please log in again.', {
            id: SESSION_EXPIRED_TOAST,
            title: 'Signed out',
          })
        }
        setUser(null)
      }),
    [user],
  )

  const login = useCallback(async (credentials) => {
    const loggedIn = await authService.login(credentials)
    setUser(loggedIn)
    refreshUserTheme(loggedIn?.id)
    return loggedIn
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
    }
  }, [])

  // true when no roles are required, or the user has one of them
  const hasRole = useCallback((roles) => !roles?.length || roles.includes(user?.role), [user])

  const value = useMemo(
    () => ({ user, isChecking, login, logout, hasRole }),
    [user, isChecking, login, logout, hasRole],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AuthProvider
