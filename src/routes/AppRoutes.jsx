import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import Loader from '@/components/common/Loader'
import { NAV_SECTIONS } from '@/constants/navigation'
import { ROUTES } from '@/constants/routes'
import { BUILT_PATHS, PAGES } from '@/routes/pages'
import ProtectedRoute from '@/routes/ProtectedRoute'
import { flattenNav } from '@/utils/navigation'

const Login = lazy(() => import('@/pages/Login/Login'))
const ComingSoon = lazy(() => import('@/pages/ComingSoon/ComingSoon'))
const NotFound = lazy(() => import('@/pages/NotFound/NotFound'))

const PLACEHOLDERS = flattenNav(NAV_SECTIONS).filter((link) => !BUILT_PATHS.has(link.path))

// Role-restricted screens get their own guard; the outer guard already requires a login.
const guard = (element, roles) => (roles ? <ProtectedRoute roles={roles}>{element}</ProtectedRoute> : element)

function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />

        {/* Everything else needs a logged-in user */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {PAGES.map((page) => (
              <Route key={page.path} path={page.path} element={guard(page.element, page.roles)} />
            ))}
            {PLACEHOLDERS.map((link) => (
              <Route
                key={link.path}
                path={link.path}
                element={guard(<ComingSoon title={link.label} section={link.parent ?? link.section} />, link.roles)}
              />
            ))}
            <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
