import { z } from 'zod'
import {
  DEFAULT_COUNTRY,
  getCountryCode,
  getCountryName,
  getDialCode,
  getStateCode,
  getStateName,
  getStates,
  isEnabledCountry,
} from '@/constants/locations'
import { tk } from '@/i18n/tk'
import { PATTERNS } from '@/utils/validators'

// Lengths of the clienteles columns (dto/clientele_dto.go, migrations 017–018)
export const MAX_LENGTH = {
  clientCode: 50,
  name: 250,
  email: 255,
  address: 250,
  city: 100,
}

export const CLIENTELE_STATUS = { ACTIVE: 'active', INACTIVE: 'inactive' }

export const INITIAL_VALUES = {
  userId: '',
  clientCode: '',
  name: '',
  email: '',
  contactNumber: '', // typed without the dialling code (shown as a prefix)
  address: '',
  // The selects pick by ISO code (state list, dial code); the API stores the names
  countryCode: DEFAULT_COUNTRY,
  stateCode: '',
  city: '',
  status: CLIENTELE_STATUS.ACTIVE,
}

// Mirrors the clienteles API rules (dto/clientele_dto.go)
export const clienteleSchema = z
  .object({
    userId: z.string().min(1, tk('Customer is required')),
    clientCode: z.string().trim().min(1, tk('Client ID is required')).max(MAX_LENGTH.clientCode, tk('Client ID is too long')),
    name: z.string().trim().min(1, tk('Client name is required')).max(MAX_LENGTH.name, tk('Client name is too long')),
    email: z
      .string()
      .trim()
      .max(MAX_LENGTH.email, tk('Email is too long'))
      .refine((value) => !value || PATTERNS.email.test(value), tk('Enter a valid email')),
    contactNumber: z.string().trim().min(1, tk('Contact number is required')).regex(PATTERNS.phone, tk('Enter a valid phone number')),
    address: z.string().trim().min(1, tk('Address is required')).max(MAX_LENGTH.address, tk('Address is too long')),
    countryCode: z.string().min(1, tk('Country is required')),
    stateCode: z.string().min(1, tk('State is required')),
    city: z.string().trim().min(1, tk('City is required')).max(MAX_LENGTH.city, tk('City is too long')),
    status: z.enum([CLIENTELE_STATUS.ACTIVE, CLIENTELE_STATUS.INACTIVE]),
  })
  .superRefine((values, ctx) => {
    // The state must be one of the country's (a country change clears it, this catches stale values)
    if (values.stateCode && !getStates(values.countryCode).some((state) => state.code === values.stateCode)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: tk('Select a state of this country'), path: ['stateCode'] })
    }
  })

// ---------------------------------------------------------------------------
// API mapping — form values ⇄ clienteles API body (POST /clienteles, PUT /clienteles/{id})
// ---------------------------------------------------------------------------

// Typed without the country code and sent as +<code><number>, digits only.
// A number typed with its own leading + is sent as is.
const toApiPhone = (value, dialCode) => {
  const digits = value.replace(/[\s-]/g, '')
  return digits.startsWith('+') ? digits : `${dialCode}${digits.replace(/^0+/, '')}`
}

// Stored +<code><number> → the number part for the form (when it uses the country's code)
const toLocalPhone = (phone, dialCode) =>
  phone && dialCode && phone.startsWith(dialCode) ? phone.slice(dialCode.length) : phone ?? ''

export const toClientelePayload = (values, isEdit) => ({
  userId: Number(values.userId),
  clientCode: values.clientCode.trim(),
  name: values.name.trim(),
  email: values.email.trim(),
  contactNumber: toApiPhone(values.contactNumber.trim(), getDialCode(values.countryCode)),
  address: values.address.trim(),
  countryName: getCountryName(values.countryCode),
  stateName: getStateName(values.countryCode, values.stateCode),
  city: values.city.trim(),
  ...(isEdit ? { status: values.status } : {}),
})

// Saved country name → its code. Rows saved before migration 018 hold the code itself.
const toCountryCode = (value) => getCountryCode(value) || (isEnabledCountry(value) ? value : DEFAULT_COUNTRY)

const toStateCode = (countryCode, value) =>
  getStateCode(countryCode, value) || (getStates(countryCode).some((state) => state.code === value) ? value : '')

// GET /clienteles/{id} → form values
export const toFormValues = (clientele) => {
  const countryCode = toCountryCode(clientele.countryName)
  return {
    userId: String(clientele.userId ?? ''),
    clientCode: clientele.clientCode ?? '',
    name: clientele.name ?? '',
    email: clientele.email ?? '',
    contactNumber: toLocalPhone(clientele.contactNumber, getDialCode(countryCode)),
    address: clientele.address ?? '',
    countryCode,
    stateCode: toStateCode(countryCode, clientele.stateName),
    city: clientele.city ?? '',
    status: clientele.status === CLIENTELE_STATUS.INACTIVE ? CLIENTELE_STATUS.INACTIVE : CLIENTELE_STATUS.ACTIVE,
  }
}
