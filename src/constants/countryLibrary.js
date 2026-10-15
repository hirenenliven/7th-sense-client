// Every country with its states / regions, from `country-region-data` (the same library as
// constants/locations.js, which offers only ENABLED_COUNTRIES for address forms).
// Used where the superadmin assigns countries and states to a customer (Masters › Countries /
// States, Add / Edit Customer). Kept apart from locations.js so the full list is only bundled
// with the screens that need it. The API stores the names ("India", "Gujarat").
import { allCountries } from 'country-region-data'

// [{ name, code, states: [{ name, code }] }], in the library's (alphabetical) order
export const ALL_COUNTRIES = allCountries.map(([name, code, regions]) => ({
  code,
  name,
  states: regions.map(([stateName, stateCode]) => ({ code: stateCode, name: stateName })),
}))

const byName = new Map(ALL_COUNTRIES.map((country) => [country.name.toLowerCase(), country]))

// Library country by name (case-insensitive), or undefined
export const findLibraryCountry = (name) => byName.get(String(name ?? '').trim().toLowerCase())

// State names of a library country; [] for a name the library does not know
export const getLibraryStateNames = (countryName) => findLibraryCountry(countryName)?.states.map((state) => state.name) ?? []
