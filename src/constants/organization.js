import { ROUTES } from './routes'

// Masters › Organization: one page, a tab per level (top-down). Each tab keeps its own route, so
// links, Back and reloads open that tab.
export const ORGANIZATION_TABS = [
  { key: 'countries', label: 'Country', icon: 'bi-globe2', path: ROUTES.ORG_COUNTRIES },
  { key: 'states', label: 'State', icon: 'bi-map', path: ROUTES.ORG_STATES },
  { key: 'cities', label: 'City', icon: 'bi-pin-map', path: ROUTES.ORG_CITIES },
  { key: 'branches', label: 'Branch', icon: 'bi-diagram-3', path: ROUTES.BRANCHES },
  { key: 'locations', label: 'Location', icon: 'bi-geo-alt', path: ROUTES.ORG_LOCATIONS },
  { key: 'shops', label: 'Shop', icon: 'bi-shop', path: ROUTES.ORG_SHOPS },
  { key: 'lines', label: 'Line', icon: 'bi-distribute-horizontal', path: ROUTES.ORG_LINES },
  { key: 'cells', label: 'Cell', icon: 'bi-grid-3x3-gap', path: ROUTES.ORG_CELLS },
  { key: 'supervisors', label: 'Supervisor', icon: 'bi-person-badge', path: ROUTES.ORG_SUPERVISORS },
]

// Levels that are a name under one parent: one list for all of them (pages/Organization/orgLevels.js)
export const ORG_LEVEL = {
  CITY: 'city',
  LOCATION: 'location',
  SHOP: 'shop',
  LINE: 'line',
  CELL: 'cell',
  SUPERVISOR: 'supervisor',
}

// Paths that light up the sidebar's Organization item (every tab, plus Add / Edit Branch)
export const ORGANIZATION_PATHS = [...ORGANIZATION_TABS.map((tab) => tab.path), ROUTES.BRANCH_ADD, ROUTES.BRANCH_EDIT]
