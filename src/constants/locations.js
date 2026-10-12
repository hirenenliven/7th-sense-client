// Countries offered in address forms. `states` empty → the State field becomes free text.
export const INDIA = 'IN'

export const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
]

export const COUNTRIES = [
  { code: INDIA, name: 'India', states: INDIAN_STATES },
  { code: 'AE', name: 'United Arab Emirates', states: [] },
  { code: 'DE', name: 'Germany', states: [] },
  { code: 'JP', name: 'Japan', states: [] },
  { code: 'GB', name: 'United Kingdom', states: [] },
  { code: 'US', name: 'United States', states: [] },
]

export const DEFAULT_COUNTRY = INDIA
export const DEFAULT_TIME_ZONE = 'Asia/Kolkata'

// IANA time zones from the browser; small fallback for older browsers.
export const TIME_ZONES =
  typeof Intl.supportedValuesOf === 'function'
    ? Intl.supportedValuesOf('timeZone')
    : [DEFAULT_TIME_ZONE, 'Asia/Dubai', 'Europe/Berlin', 'Europe/London', 'America/New_York', 'Asia/Tokyo', 'UTC']

export const getStates = (countryCode) =>
  COUNTRIES.find((country) => country.code === countryCode)?.states ?? []
