import { lazy } from 'react'
import { SUPERADMIN_ONLY, MANAGERS } from '@/constants/app'
import { ORG_LEVEL } from '@/constants/organization'
import { ROUTES } from '@/constants/routes'
import { ACCOUNT_KIND } from '@/pages/Customers/accountPages'
import { REASON_KIND } from '@/pages/Reasons/reasonPages'

const Home = lazy(() => import('@/pages/Home/Home'))
const OperationsCenter = lazy(() => import('@/pages/OperationsCenter/OperationsCenter'))
const PlantIntelligence = lazy(() => import('@/pages/PlantIntelligence/PlantIntelligence'))
const MachineDiagnostics = lazy(() => import('@/pages/MachineDiagnostics/MachineDiagnostics'))
const About = lazy(() => import('@/pages/About/About'))
const ThemeShowcase = lazy(() => import('@/pages/ThemeShowcase/ThemeShowcase'))
const CustomerList = lazy(() => import('@/pages/Customers/CustomerList'))
const AddCustomer = lazy(() => import('@/pages/Customers/AddCustomer'))
const CustomerView = lazy(() => import('@/pages/Customers/CustomerView'))
const BranchList = lazy(() => import('@/pages/Branches/BranchList'))
const AddBranch = lazy(() => import('@/pages/Branches/AddBranch'))
const MachineList = lazy(() => import('@/pages/Machines/MachineList'))
const AddMachine = lazy(() => import('@/pages/Machines/AddMachine'))
// Operations › Monitoring: one page (machine list, then a machine's Productivity / Machine Health)
const MonitoringPage = lazy(() => import('@/pages/Monitoring/MonitoringPage'))
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
const BrandList = lazy(() => import('@/pages/Brands/BrandList'))
const ControllerList = lazy(() => import('@/pages/Controllers/ControllerList'))
const ModelList = lazy(() => import('@/pages/Models/ModelList'))
const UserGuide = lazy(() => import('@/pages/UserGuide/UserGuide'))
// System › Account Center: one tabbed page (Customer, Licence Key, Machine Catalog)
const AccountCenterPage = lazy(() => import('@/pages/AccountCenter/AccountCenterPage'))
// Masters › Country … Supervisor (Org prefix keeps them apart from Masters › Branches)
// Masters › Organization: one tabbed page; each tab is its own route and lazily loaded list
const OrganizationPage = lazy(() => import('@/pages/Organization/OrganizationPage'))
const OrgCountryList = lazy(() => import('@/pages/Organization/Countries/CountryList'))
const OrgStateList = lazy(() => import('@/pages/Organization/States/StateList'))
// City, Location, Shop, Line, Cell and Supervisor are one list (orgLevels.js); `key` gives each its own state
const OrgLevelList = lazy(() => import('@/pages/Organization/OrgLevelList'))

// Screens that exist. Every other sidebar link renders <ComingSoon /> until it is built.
// Also read by the User Guide to show which screens are available.
// `roles`: only these roles may open the screen (omit = every logged-in user).
// eslint-disable-next-line react-refresh/only-export-components -- route table, not a component module
export const PAGES = [
  { path: ROUTES.HOME, element: <Home /> },
  { path: ROUTES.OPERATIONS_CENTER, element: <OperationsCenter /> },
  { path: ROUTES.PLANT_INTELLIGENCE, element: <PlantIntelligence /> },
  { path: ROUTES.ABOUT, element: <About /> },
  { path: ROUTES.THEME, element: <ThemeShowcase />, roles: SUPERADMIN_ONLY },
  // System › Account Center: `/account-center` opens the first tab the role may see (managers and up)
  { path: ROUTES.ACCOUNT_CENTER, element: <AccountCenterPage />, roles: SUPERADMIN_ONLY },
  { path: ROUTES.CUSTOMERS, element: <AccountCenterPage><CustomerList /></AccountCenterPage>, roles: SUPERADMIN_ONLY },
  { path: ROUTES.CUSTOMER_ADD, element: <AddCustomer />, roles: SUPERADMIN_ONLY },
  { path: ROUTES.CUSTOMER_EDIT, element: <AddCustomer />, roles: SUPERADMIN_ONLY },
  { path: ROUTES.CUSTOMER_VIEW, element: <CustomerView />, roles: SUPERADMIN_ONLY },
  // Users reuse the Customer pages (`kind`); the server limits each manager to their company
  { path: ROUTES.USERS, element: <CustomerList kind={ACCOUNT_KIND.USER} />, roles: MANAGERS },
  { path: ROUTES.USER_ADD, element: <AddCustomer kind={ACCOUNT_KIND.USER} />, roles: MANAGERS },
  { path: ROUTES.USER_EDIT, element: <AddCustomer kind={ACCOUNT_KIND.USER} />, roles: MANAGERS },
  { path: ROUTES.USER_VIEW, element: <CustomerView kind={ACCOUNT_KIND.USER} />, roles: MANAGERS },
  { path: ROUTES.BRANCHES, element: <OrganizationPage><BranchList /></OrganizationPage> },
  { path: ROUTES.BRANCH_ADD, element: <AddBranch />, roles: SUPERADMIN_ONLY },
  { path: ROUTES.BRANCH_EDIT, element: <AddBranch />, roles: SUPERADMIN_ONLY },
  { path: ROUTES.MACHINES, element: <MachineList /> },
  { path: ROUTES.MACHINE_ADD, element: <AddMachine />, roles: MANAGERS },
  { path: ROUTES.MACHINE_EDIT, element: <AddMachine />, roles: MANAGERS },
  { path: ROUTES.MACHINE_DIAGNOSTICS, element: <MachineDiagnostics />, roles: SUPERADMIN_ONLY },
  // Operations › Monitoring: one page (machine list, then a machine's Productivity / Health tabs);
  // every user, for the machines the server returns them
  { path: ROUTES.MONITORING, element: <MonitoringPage /> },
  { path: ROUTES.MACHINE_PRODUCTIVITY, element: <MonitoringPage /> },
  { path: ROUTES.MACHINE_HEALTH, element: <MonitoringPage /> },
  { path: ROUTES.MACHINE_TOOLS, element: <MonitoringPage /> },
  { path: ROUTES.MACHINE_TOOL_LIFE, element: <MonitoringPage /> },
  { path: ROUTES.MACHINE_VIRTUAL_SCREEN, element: <MonitoringPage /> },
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
  { path: ROUTES.LICENCE_KEYS, element: <AccountCenterPage><LicenceKeySetup /></AccountCenterPage>, roles: SUPERADMIN_ONLY },
  { path: ROUTES.BRANDS, element: <AccountCenterPage><BrandList /></AccountCenterPage>, roles: SUPERADMIN_ONLY },
  { path: ROUTES.CONTROLLERS, element: <AccountCenterPage><ControllerList /></AccountCenterPage>, roles: SUPERADMIN_ONLY },
  { path: ROUTES.MODELS, element: <AccountCenterPage><ModelList /></AccountCenterPage>, roles: SUPERADMIN_ONLY },
  { path: ROUTES.USER_GUIDE, element: <UserGuide /> },
  { path: ROUTES.ORG_COUNTRIES, element: <OrganizationPage><OrgCountryList /></OrganizationPage> },
  { path: ROUTES.ORG_STATES, element: <OrganizationPage><OrgStateList /></OrganizationPage> },
  { path: ROUTES.ORG_CITIES, element: <OrganizationPage><OrgLevelList key={ORG_LEVEL.CITY} level={ORG_LEVEL.CITY} /></OrganizationPage> },
  { path: ROUTES.ORG_LOCATIONS, element: <OrganizationPage><OrgLevelList key={ORG_LEVEL.LOCATION} level={ORG_LEVEL.LOCATION} /></OrganizationPage> },
  { path: ROUTES.ORG_SHOPS, element: <OrganizationPage><OrgLevelList key={ORG_LEVEL.SHOP} level={ORG_LEVEL.SHOP} /></OrganizationPage> },
  { path: ROUTES.ORG_LINES, element: <OrganizationPage><OrgLevelList key={ORG_LEVEL.LINE} level={ORG_LEVEL.LINE} /></OrganizationPage> },
  { path: ROUTES.ORG_CELLS, element: <OrganizationPage><OrgLevelList key={ORG_LEVEL.CELL} level={ORG_LEVEL.CELL} /></OrganizationPage> },
  { path: ROUTES.ORG_SUPERVISORS, element: <OrganizationPage><OrgLevelList key={ORG_LEVEL.SUPERVISOR} level={ORG_LEVEL.SUPERVISOR} /></OrganizationPage> },
]

export const BUILT_PATHS = new Set(PAGES.map((page) => page.path))
