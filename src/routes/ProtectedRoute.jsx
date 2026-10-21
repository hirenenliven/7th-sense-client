import PropTypes from 'prop-types'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Loader from '@/components/common/Loader'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'
import Forbidden from '@/pages/Forbidden/Forbidden'
import { useTranslation } from 'react-i18next'

// Renders its children (or the nested routes) only for a logged-in user with one of `roles`
// (any role when omitted). Logged-out users go to the login screen, which returns them here
// afterwards. This only hides screens; the API enforces the same rules on every request.
function ProtectedRoute({ roles, children }) {
  const { t } = useTranslation()
  const { user, isChecking, hasRole } = useAuth()
  const location = useLocation()

  if (isChecking) return <Loader text={t('Checking your session…')} />
  if (!user) return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
  if (!hasRole(roles)) return <Forbidden />
  return children ?? <Outlet />
}

ProtectedRoute.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
}

export default ProtectedRoute
