import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import Loader from '@/components/common/Loader'
import { NAV_SECTIONS } from '@/constants/navigation'
import { ROUTES } from '@/constants/routes'
import { flattenNav } from '@/utils/navigation'

const Home = lazy(() => import('@/pages/Home/Home'))
const About = lazy(() => import('@/pages/About/About'))
const ThemeShowcase = lazy(() => import('@/pages/ThemeShowcase/ThemeShowcase'))
const ComingSoon = lazy(() => import('@/pages/ComingSoon/ComingSoon'))
const NotFound = lazy(() => import('@/pages/NotFound/NotFound'))

// Screens that exist. Every other sidebar link renders <ComingSoon /> until it is built.
const PAGES = [
  { path: ROUTES.HOME, element: <Home /> },
  { path: ROUTES.ABOUT, element: <About /> },
  { path: ROUTES.THEME, element: <ThemeShowcase /> },
]

const BUILT_PATHS = new Set(PAGES.map((page) => page.path))
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
