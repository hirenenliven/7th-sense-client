import { z } from 'zod'
import { ORG_LEVEL } from '@/constants/organization'
import { ROUTES } from '@/constants/routes'
import { getBranches } from '@/services/branchService'
import { createUserCell, deleteUserCell, getUserCells, updateUserCell } from '@/services/userCellService'
import { createUserCity, deleteUserCity, getUserCities, updateUserCity } from '@/services/userCityService'
import { createUserLine, deleteUserLine, getUserLines, updateUserLine } from '@/services/userLineService'
import { createUserLocation, deleteUserLocation, getUserLocations, updateUserLocation } from '@/services/userLocationService'
import { createUserShop, deleteUserShop, getUserShops, updateUserShop } from '@/services/userShopService'
import { getUserStates } from '@/services/userStateService'
import { createUserSupervisor, deleteUserSupervisor, getUserSupervisors, updateUserSupervisor } from '@/services/userSupervisorService'

// Masters › Organization levels that are a name under one parent (OrgLevelList, OrgLevelRow,
// OrgLevelFormModal): each has the same list, row and form, and differs only by this config.
// Country and State pick from libraries, so they keep their own screens; Branch has its own pages.
// parent: `key` the form and API field, `nameField` the parent's name on a row, `hintField` what
// tells parent options apart in the form, `ownerKey` the field naming the customer who owns a parent.

// Matches the name columns VARCHAR(100) (dto/user_*_dto.go)
export const NAME_MAX_LENGTH = 100

const PARENTS = {
  state: { key: 'userStateId', one: 'state', many: 'states', title: 'State', route: ROUTES.ORG_STATES, nameField: 'stateName', hintField: 'countryName', ownerKey: 'userId', list: getUserStates },
  branch: { key: 'branchId', one: 'branch', many: 'branches', title: 'Branch', route: ROUTES.BRANCHES, nameField: 'branchName', hintField: 'city', ownerKey: 'customerId', list: getBranches },
  location: { key: 'userLocationId', one: 'location', many: 'locations', title: 'Location', route: ROUTES.ORG_LOCATIONS, nameField: 'locationName', hintField: 'branchName', ownerKey: 'userId', list: getUserLocations },
  shop: { key: 'userShopId', one: 'shop', many: 'shops', title: 'Shop', route: ROUTES.ORG_SHOPS, nameField: 'shopName', hintField: 'locationName', ownerKey: 'userId', list: getUserShops },
  line: { key: 'userLineId', one: 'line', many: 'lines', title: 'Line', route: ROUTES.ORG_LINES, nameField: 'lineName', hintField: 'shopName', ownerKey: 'userId', list: getUserLines },
  cell: { key: 'userCellId', one: 'cell', many: 'cells', title: 'Cell', route: ROUTES.ORG_CELLS, nameField: 'cellName', hintField: 'lineName', ownerKey: 'userId', list: getUserCells },
}

const childNote = (one, children) => `A ${one} that still has ${children} cannot be deleted — delete those first.`

const orgLevel = ({ parent, title, ...level }) => ({
  ...level,
  title,
  parent,
  emptyValues: { [parent.key]: '', name: '' },
  schema: z.object({
    [parent.key]: z.string().min(1, `${parent.title} is required`),
    name: z.string().trim().min(1, `${title} is required`).max(NAME_MAX_LENGTH, 'Name is too long'),
  }),
})

export const ORG_LEVELS = {
  [ORG_LEVEL.CITY]: orgLevel({
    one: 'city', many: 'cities', title: 'City', titlePlural: 'Cities', icon: 'bi-buildings', parent: PARENTS.state,
    deleteNote: childNote('city', 'branches'),
    list: getUserCities, create: createUserCity, update: updateUserCity, remove: deleteUserCity,
  }),
  [ORG_LEVEL.LOCATION]: orgLevel({
    one: 'location', many: 'locations', title: 'Location', titlePlural: 'Locations', icon: 'bi-geo-alt', parent: PARENTS.branch,
    deleteNote: childNote('location', 'shops'),
    list: getUserLocations, create: createUserLocation, update: updateUserLocation, remove: deleteUserLocation,
  }),
  [ORG_LEVEL.SHOP]: orgLevel({
    one: 'shop', many: 'shops', title: 'Shop', titlePlural: 'Shops', icon: 'bi-shop', parent: PARENTS.location,
    deleteNote: childNote('shop', 'lines'),
    list: getUserShops, create: createUserShop, update: updateUserShop, remove: deleteUserShop,
  }),
  [ORG_LEVEL.LINE]: orgLevel({
    one: 'line', many: 'lines', title: 'Line', titlePlural: 'Lines', icon: 'bi-distribute-horizontal', parent: PARENTS.shop,
    deleteNote: childNote('line', 'cells'),
    list: getUserLines, create: createUserLine, update: updateUserLine, remove: deleteUserLine,
  }),
  [ORG_LEVEL.CELL]: orgLevel({
    one: 'cell', many: 'cells', title: 'Cell', titlePlural: 'Cells', icon: 'bi-grid-3x3-gap', parent: PARENTS.line,
    deleteNote: childNote('cell', 'supervisors'),
    list: getUserCells, create: createUserCell, update: updateUserCell, remove: deleteUserCell,
  }),
  [ORG_LEVEL.SUPERVISOR]: orgLevel({
    one: 'supervisor', many: 'supervisors', title: 'Supervisor', titlePlural: 'Supervisors', icon: 'bi-person-badge', parent: PARENTS.cell,
    list: getUserSupervisors, create: createUserSupervisor, update: updateUserSupervisor, remove: deleteUserSupervisor,
  }),
}

// Form values → API body ({ <parent key>, name })
export const toLevelPayload = ({ parent }, values) => ({
  [parent.key]: Number(values[parent.key]),
  name: values.name.trim(),
})

// A level's record → form values
export const toLevelFormValues = ({ parent }, row) => ({
  [parent.key]: row[parent.key] ? String(row[parent.key]) : '',
  name: row.name ?? '',
})
