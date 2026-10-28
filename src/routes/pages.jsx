import { lazy } from 'react'
import { SUPERADMIN_ONLY, MANAGERS } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { ACCOUNT_KIND } from '@/pages/Customers/accountPages'
import { REASON_KIND } from '@/pages/Reasons/reasonPages'

const Home = lazy(() => import('@/pages/Home/Home'))
const About = lazy(() => import('@/pages/About/About'))
const ThemeShowcase = lazy(() => import('@/pages/ThemeShowcase/ThemeShowcase'))
const CustomerList = lazy(() => import('@/pages/Customers/CustomerList'))
const AddCustomer = lazy(() => import('@/pages/Customers/AddCustomer'))
const CustomerView = lazy(() => import('@/pages/Customers/CustomerView'))
const BranchList = lazy(() => import('@/pages/Branches/BranchList'))
const AddBranch = lazy(() => import('@/pages/Branches/AddBranch'))
const MachineList = lazy(() => import('@/pages/Machines/MachineList'))
const AddMachine = lazy(() => import('@/pages/Machines/AddMachine'))
const MachineHealth = lazy(() => import('@/pages/MachineHealth/MachineHealth'))
const Productivity = lazy(() => import('@/pages/Productivity/Productivity'))
const ClienteleList = lazy(() => import('@/pages/Clienteles/ClienteleList'))
const ShiftSetup = lazy(() => import('@/pages/Shifts/ShiftSetup'))
const BreakSetup = lazy(() => import('@/pages/Breaks/BreakSetup'))
const HolidaySetup = lazy(() => import('@/pages/Holidays/HolidaySetup'))
const ReasonList = lazy(() => import('@/pages/Reasons/ReasonList'))
const LicenceKeySetup = lazy(() => import('@/pages/LicenceKeys/LicenceKeySetup'))
const PartList = lazy(() => import('@/pages/Parts/PartList'))
const AddPart = lazy(() => import('@/pages/Parts/AddPart'))
const ProductionScheduleList = lazy(() => import('@/pages/ProductionSchedules/ProductionScheduleList'))
const AddProductionSchedule = lazy(() => import('@/pages/ProductionSchedules/AddProductionSchedule'))
const ControllerList = lazy(() => import('@/pages/Controllers/ControllerList'))
const ModelList = lazy(() => import('@/pages/Models/ModelList'))
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
  { path: ROUTES.CUSTOMERS, element: <CustomerList />, roles: SUPERADMIN_ONLY },
  { path: ROUTES.CUSTOMER_ADD, element: <AddCustomer />, roles: SUPERADMIN_ONLY },
  { path: ROUTES.CUSTOMER_EDIT, element: <AddCustomer />, roles: SUPERADMIN_ONLY },
  { path: ROUTES.CUSTOMER_VIEW, element: <CustomerView />, roles: SUPERADMIN_ONLY },
  // Users reuse the Customer pages (`kind`); the server limits each manager to their company
  { path: ROUTES.USERS, element: <CustomerList kind={ACCOUNT_KIND.USER} />, roles: MANAGERS },
  { path: ROUTES.USER_ADD, element: <AddCustomer kind={ACCOUNT_KIND.USER} />, roles: MANAGERS },
  { path: ROUTES.USER_EDIT, element: <AddCustomer kind={ACCOUNT_KIND.USER} />, roles: MANAGERS },
  { path: ROUTES.USER_VIEW, element: <CustomerView kind={ACCOUNT_KIND.USER} />, roles: MANAGERS },
  { path: ROUTES.BRANCHES, element: <BranchList /> },
  { path: ROUTES.BRANCH_ADD, element: <AddBranch />, roles: SUPERADMIN_ONLY },
  { path: ROUTES.BRANCH_EDIT, element: <AddBranch />, roles: SUPERADMIN_ONLY },
  { path: ROUTES.MACHINES, element: <MachineList /> },
  { path: ROUTES.MACHINE_ADD, element: <AddMachine />, roles: MANAGERS },
  { path: ROUTES.MACHINE_EDIT, element: <AddMachine />, roles: MANAGERS },
  // Machine Health: every user, for the machines the server returns them
  { path: ROUTES.MACHINE_HEALTH, element: <MachineHealth /> },
  // Productivity (OEE, finished cycles): every user, for the machines the server returns them
  { path: ROUTES.MACHINE_PRODUCTIVITY, element: <Productivity /> },
  // Clientele and parts: everyone reads their company's; managers add, edit and delete
  { path: ROUTES.CLIENTELES, element: <ClienteleList /> },
  { path: ROUTES.PARTS, element: <PartList /> },
  { path: ROUTES.PART_ADD, element: <AddPart />, roles: MANAGERS },
  { path: ROUTES.PART_EDIT, element: <AddPart />, roles: MANAGERS },
  // Production schedules: everyone reads their company's; managers add, edit and delete
  { path: ROUTES.PRODUCTION_SCHEDULE, element: <ProductionScheduleList /> },
  { path: ROUTES.PRODUCTION_SCHEDULE_ADD, element: <AddProductionSchedule />, roles: MANAGERS },
  { path: ROUTES.PRODUCTION_SCHEDULE_EDIT, element: <AddProductionSchedule />, roles: MANAGERS },
  // Shift › Add / Manage Shift, Breaks, Holiday / Week Off: everyone reads their company's;
  // managers add, edit and delete (the pages hide the form)
  { path: ROUTES.SHIFTS, element: <ShiftSetup /> },
  { path: ROUTES.BREAKS, element: <BreakSetup /> },
  { path: ROUTES.HOLIDAYS, element: <HolidaySetup /> },
  // Downtime › Downtime List / Idle List: everyone reads their company's; managers add, edit and delete
  // (`key` gives each kind its own list state)
  { path: ROUTES.DOWNTIME_REASONS, element: <ReasonList key={REASON_KIND.DOWNTIME} kind={REASON_KIND.DOWNTIME} /> },
  { path: ROUTES.IDLE_REASONS, element: <ReasonList key={REASON_KIND.IDLE} kind={REASON_KIND.IDLE} /> },
  // Licence keys: the superadmin generates, edits and deletes; customers and admins read their company's
  { path: ROUTES.LICENCE_KEYS, element: <LicenceKeySetup />, roles: MANAGERS },
  { path: ROUTES.CONTROLLERS, element: <ControllerList />, roles: SUPERADMIN_ONLY },
  { path: ROUTES.MODELS, element: <ModelList />, roles: SUPERADMIN_ONLY },
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
