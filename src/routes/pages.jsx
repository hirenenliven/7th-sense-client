import { lazy } from 'react'
import { ADMIN_ONLY } from '@/constants/app'
import { ROUTES } from '@/constants/routes'

const Home = lazy(() => import('@/pages/Home/Home'))
const About = lazy(() => import('@/pages/About/About'))
const ThemeShowcase = lazy(() => import('@/pages/ThemeShowcase/ThemeShowcase'))
const CustomerList = lazy(() => import('@/pages/Customers/CustomerList'))
const AddCustomer = lazy(() => import('@/pages/Customers/AddCustomer'))
const CustomerView = lazy(() => import('@/pages/Customers/CustomerView'))
const BranchList = lazy(() => import('@/pages/Branches/BranchList'))
const AddBranch = lazy(() => import('@/pages/Branches/AddBranch'))
const UserGuide = lazy(() => import('@/pages/UserGuide/UserGuide'))
// Masters › Country … Supervisor (Org prefix keeps them apart from Masters › Branches)
const OrgCountryList = lazy(() => import('@/pages/Organization/Countries/CountryList'))
const OrgStateList = lazy(() => import('@/pages/Organization/States/StateList'))
const OrgCityList = lazy(() => import('@/pages/Organization/Cities/CityList'))
const OrgLocationList = lazy(() => import('@/pages/Organization/Locations/LocationList'))
const OrgShopList = lazy(() => import('@/pages/Organization/Shops/ShopList'))
const OrgLineList = lazy(() => import('@/pages/Organization/Lines/LineList'))
const OrgCellList = lazy(() => import('@/pages/Organization/Cells/CellList'))
const OrgSupervisorList = lazy(() => import('@/pages/Organization/Supervisors/SupervisorList'))

// Screens that exist. Every other sidebar link renders <ComingSoon /> until it is built.
// Also read by the User Guide to show which screens are available.
// `roles`: only these roles may open the screen (omit = every logged-in user).
// eslint-disable-next-line react-refresh/only-export-components -- route table, not a component module
export const PAGES = [
  { path: ROUTES.HOME, element: <Home /> },
  { path: ROUTES.ABOUT, element: <About /> },
  { path: ROUTES.THEME, element: <ThemeShowcase /> },
  { path: ROUTES.CUSTOMERS, element: <CustomerList />, roles: ADMIN_ONLY },
  { path: ROUTES.CUSTOMER_ADD, element: <AddCustomer />, roles: ADMIN_ONLY },
  { path: ROUTES.CUSTOMER_EDIT, element: <AddCustomer />, roles: ADMIN_ONLY },
  { path: ROUTES.CUSTOMER_VIEW, element: <CustomerView />, roles: ADMIN_ONLY },
  { path: ROUTES.BRANCHES, element: <BranchList /> },
  { path: ROUTES.BRANCH_ADD, element: <AddBranch /> },
  { path: ROUTES.BRANCH_EDIT, element: <AddBranch /> },
  { path: ROUTES.USER_GUIDE, element: <UserGuide /> },
  { path: ROUTES.ORG_COUNTRIES, element: <OrgCountryList /> },
  { path: ROUTES.ORG_STATES, element: <OrgStateList /> },
  { path: ROUTES.ORG_CITIES, element: <OrgCityList /> },
  { path: ROUTES.ORG_LOCATIONS, element: <OrgLocationList /> },
  { path: ROUTES.ORG_SHOPS, element: <OrgShopList /> },
  { path: ROUTES.ORG_LINES, element: <OrgLineList /> },
  { path: ROUTES.ORG_CELLS, element: <OrgCellList /> },
  { path: ROUTES.ORG_SUPERVISORS, element: <OrgSupervisorList /> },
]

export const BUILT_PATHS = new Set(PAGES.map((page) => page.path))
