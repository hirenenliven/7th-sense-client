import { getBranches } from '@/services/branchService'
import { getUserCities } from '@/services/userCityService'
import { getUserCountries } from '@/services/userCountryService'
import { getUserLines } from '@/services/userLineService'
import { getUserLocations } from '@/services/userLocationService'
import { getUserShops } from '@/services/userShopService'
import { getUserStates } from '@/services/userStateService'

// Machine filter of a user (user form › Access, users API `machineFilter`, user_machine_filters):
// the company's organization levels that narrow the machines, top-down. `key` is the API field
// and also the field a row of the level below names its parent with (state.userCountryId,
// city.userStateId, branch.userCityId, location.branchId, shop.userLocationId, line.userShopId).
// A machine sits on a line (machine.lineId), so the levels end at Line.
export const MACHINE_FILTER_LEVELS = [
  { key: 'userCountryId', label: 'Country', plural: 'countries' },
  { key: 'userStateId', label: 'State', plural: 'states' },
  { key: 'userCityId', label: 'City', plural: 'cities' },
  { key: 'branchId', label: 'Branch', plural: 'branches' },
  { key: 'userLocationId', label: 'Location', plural: 'locations' },
  { key: 'userShopId', label: 'Shop', plural: 'shops' },
  { key: 'userLineId', label: 'Line', plural: 'lines' },
]

const LEVEL_KEYS = MACHINE_FILTER_LEVELS.map((level) => level.key)

// Form value: '' = any; allMachines gives the user every machine under the levels chosen,
// machines added later included (the server works them out on every request).
export const EMPTY_MACHINE_FILTER = {
  ...Object.fromEntries(LEVEL_KEYS.map((key) => [key, ''])),
  allMachines: false,
}

export const hasFilterLevels = (filter) => LEVEL_KEYS.some((key) => filter?.[key])

// The company's organization as { [level key]: rows }. userId = the company for the superadmin,
// undefined for everyone else (the server uses their own company). Branches are shared master
// data, so only those under the company's cities are kept.
export const loadOrganization = async (userId) => {
  const [countries, states, cities, branches, locations, shops, lines] = await Promise.all([
    getUserCountries(userId),
    getUserStates(undefined, userId),
    getUserCities(undefined, userId),
    getBranches(),
    getUserLocations(undefined, userId),
    getUserShops(undefined, userId),
    getUserLines(undefined, userId),
  ])
  const cityIds = new Set(cities.map((city) => city.id))
  return {
    userCountryId: countries,
    userStateId: states,
    userCityId: cities,
    branchId: branches.filter((branch) => cityIds.has(branch.userCityId)),
    userLocationId: locations,
    userShopId: shops,
    userLineId: lines,
  }
}

// { [level key]: Map(id → path) }: the path of a row is its own id and its ancestors' ids by
// level key (strings, like the form values), e.g. a shop's path has userShopId … userCountryId.
export const buildOrganizationPaths = (organization) => {
  const paths = {}
  MACHINE_FILTER_LEVELS.forEach(({ key }, index) => {
    const parentKey = LEVEL_KEYS[index - 1]
    paths[key] = new Map(
      (organization[key] ?? []).map((row) => {
        const parentPath = parentKey ? paths[parentKey].get(String(row[parentKey])) ?? {} : {}
        return [String(row.id), { ...parentPath, [key]: String(row.id) }]
      }),
    )
  })
  return paths
}

const pathMatches = (path, filter, keys) => Boolean(path) && keys.every((key) => !filter[key] || path[key] === filter[key])

// Rows of level `key` that fit the levels chosen above it
export const levelOptions = (organization, paths, filter, key) => {
  const above = LEVEL_KEYS.slice(0, LEVEL_KEYS.indexOf(key))
  return (organization[key] ?? []).filter((row) => pathMatches(paths[key].get(String(row.id)), filter, above))
}

// The filter after picking id ('' = any) at level key: the levels above take the row's ancestors,
// so a line can be picked straight away, and the levels below are cleared.
export const pickFilterLevel = (filter, paths, key, id) => {
  const index = LEVEL_KEYS.indexOf(key)
  const next = { ...filter }
  LEVEL_KEYS.slice(index).forEach((levelKey) => {
    next[levelKey] = ''
  })
  if (id) Object.assign(next, paths[key].get(id) ?? { [key]: id })
  return next
}

// Whether the machine lies under every level chosen (no level = every machine). Matches the
// server's rule for allMachines (organization_paths in migration 032).
export const machineMatches = (machine, filter, paths) =>
  !hasFilterLevels(filter) || pathMatches(paths.userLineId.get(String(machine.lineId)), filter, LEVEL_KEYS)

// "India › Gujarat › Line 1" for the levels chosen ('' when none)
export const filterLabel = (filter, organization) =>
  MACHINE_FILTER_LEVELS.filter(({ key }) => filter?.[key])
    .map(({ key }) => organization[key]?.find((row) => String(row.id) === String(filter[key]))?.name ?? `#${filter[key]}`)
    .join(' › ')

// GET /users/{id} machineFilter → form value
export const toMachineFilterValues = (machineFilter) => ({
  ...EMPTY_MACHINE_FILTER,
  ...Object.fromEntries(LEVEL_KEYS.map((key) => [key, machineFilter?.[key] ? String(machineFilter[key]) : ''])),
  allMachines: Boolean(machineFilter?.allMachines),
})

// Form value → API body (null when there is nothing to keep)
export const toMachineFilterPayload = (filter) => {
  if (!hasFilterLevels(filter) && !filter?.allMachines) return null
  return {
    ...Object.fromEntries(LEVEL_KEYS.map((key) => [key, filter[key] ? Number(filter[key]) : null])),
    allMachines: Boolean(filter.allMachines),
  }
}
