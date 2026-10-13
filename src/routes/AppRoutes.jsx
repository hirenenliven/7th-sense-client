import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import Loader from '@/components/common/Loader'
import { NAV_SECTIONS } from '@/constants/navigation'
import { ROUTES } from '@/constants/routes'
import { BUILT_PATHS, PAGES } from '@/routes/pages'
import { flattenNav } from '@/utils/navigation'

const ComingSoon = lazy(() => import('@/pages/ComingSoon/ComingSoon'))
const NotFound = lazy(() => import('@/pages/NotFound/NotFound'))

const PLACEHOLDERS = flattenNav(NAV_SECTIONS).filter((link) => !BUILT_PATHS.has(link.path))

function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<MainLayout />}>
          {PAGES.map((page) => (
            <Route key={page.path} path={page.path} element={page.element} />
          ))}
          {PLACEHOLDERS.map((link) => (
            <Route
              key={link.path}
              path={link.path}
              element={<ComingSoon title={link.label} section={link.parent ?? link.section} />}
            />
          ))}
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
