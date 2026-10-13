import { lazy } from 'react'
import { ROUTES } from '@/constants/routes'

const Home = lazy(() => import('@/pages/Home/Home'))
const About = lazy(() => import('@/pages/About/About'))
const ThemeShowcase = lazy(() => import('@/pages/ThemeShowcase/ThemeShowcase'))
const AddCustomer = lazy(() => import('@/pages/Customers/AddCustomer'))
const UserGuide = lazy(() => import('@/pages/UserGuide/UserGuide'))

// Screens that exist. Every other sidebar link renders <ComingSoon /> until it is built.
// Also read by the User Guide to show which screens are available.
// eslint-disable-next-line react-refresh/only-export-components -- route table, not a component module
export const PAGES = [
  { path: ROUTES.HOME, element: <Home /> },
  { path: ROUTES.ABOUT, element: <About /> },
  { path: ROUTES.THEME, element: <ThemeShowcase /> },
  { path: ROUTES.CUSTOMER_ADD, element: <AddCustomer /> },
  { path: ROUTES.USER_GUIDE, element: <UserGuide /> },
]

export const BUILT_PATHS = new Set(PAGES.map((page) => page.path))
