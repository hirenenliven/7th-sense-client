// Countries and their states / regions come from `country-region-data` (ISO 3166 codes);
// each entry is [countryName, countryCode, [[stateName, stateCode], …]].
// Dialling codes come from `libphonenumber-js` (Google's phone metadata).
//
// Only the countries in ENABLED_COUNTRIES are offered in forms. To enable another country,
// import it by its ISO code below and add it to the list — only imported countries are bundled.
import { AE, DE, GB, IN, JP, US } from 'country-region-data'
import { getCountryCallingCode } from 'libphonenumber-js/min'

const ENABLED_COUNTRIES = [IN, AE, DE, JP, GB, US]

export const INDIA = 'IN'
export const DEFAULT_COUNTRY = INDIA
export const DEFAULT_TIME_ZONE = 'Asia/Kolkata'

// { code, name, dialCode: '+91', states: [{ code, name }] } — `states` empty → State becomes free text
export const COUNTRIES = ENABLED_COUNTRIES.map(([name, code, regions]) => ({
  code,
  name,
  dialCode: `+${getCountryCallingCode(code)}`,
  states: regions.map(([stateName, stateCode]) => ({ code: stateCode, name: stateName })),
}))

// IANA time zones from the browser; small fallback for older browsers.
export const TIME_ZONES =
  typeof Intl.supportedValuesOf === 'function'
    ? Intl.supportedValuesOf('timeZone')
    : [DEFAULT_TIME_ZONE, 'Asia/Dubai', 'Europe/Berlin', 'Europe/London', 'America/New_York', 'Asia/Tokyo', 'UTC']

export const isEnabledCountry = (countryCode) => COUNTRIES.some((country) => country.code === countryCode)

export const getStates = (countryCode) =>
  COUNTRIES.find((country) => country.code === countryCode)?.states ?? []

export const getDialCode = (countryCode) =>
  COUNTRIES.find((country) => country.code === countryCode)?.dialCode ?? ''

export const getCountryName = (countryCode) =>
  COUNTRIES.find((country) => country.code === countryCode)?.name ?? ''

export const getStateName = (countryCode, stateCode) => {
  const country = COUNTRIES.find((c) => c.code === countryCode)
  if (!country) return ''
  return country.states.find((state) => state.code === stateCode)?.name ?? ''
}

// Reverse lookup: get country code from name
export const getCountryCode = (countryName) =>
  COUNTRIES.find((country) => country.name === countryName)?.code ?? ''

// Reverse lookup: get state code from country code and state name
export const getStateCode = (countryCode, stateName) => {
  const country = COUNTRIES.find((c) => c.code === countryCode)
  if (!country) return ''
  return country.states.find((state) => state.name === stateName)?.code ?? ''
}
