import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import Loader from '@/components/common/Loader'
import { ROUTES } from '@/constants/routes'

const Home = lazy(() => import('@/pages/Home/Home'))
const About = lazy(() => import('@/pages/About/About'))
const ThemeShowcase = lazy(() => import('@/pages/ThemeShowcase/ThemeShowcase'))
const NotFound = lazy(() => import('@/pages/NotFound/NotFound'))

function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.THEME} element={<ThemeShowcase />} />
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
