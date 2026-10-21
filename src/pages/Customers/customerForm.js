import { CUSTOMER_ROLE_ID, DEFAULT_THEME, THEMES, USER_STATUS } from '@/constants/app'
import { DEFAULT_COUNTRY, DEFAULT_TIME_ZONE, INDIA, getCountryCode, getCountryName, getDialCode, getStateCode, getStateName } from '@/constants/locations'
import { normalizeTheme } from '@/utils/theme'
import { ACCOUNT_KIND } from './accountPages'
import { PASSWORD_MIN_LENGTH, PATTERNS } from '@/utils/validators'
import { z } from 'zod'
import { tk, tkv } from '@/i18n/tk'

// Filters the customer can use on their screens and reports (users API `filters`, user_filters table).
// `value` is the filter name the API stores; this order is also the order they are sent in.
// `icon` is the chip icon on the form.
export const FILTER_OPTIONS = [
  { value: 'country', label: tk('Country'), icon: 'bi-globe2' },
  { value: 'state', label: tk('State'), icon: 'bi-map' },
  { value: 'branch', label: tk('Branch'), icon: 'bi-diagram-3' },
  { value: 'city', label: tk('City'), icon: 'bi-buildings' },
  { value: 'location', label: tk('Location'), icon: 'bi-geo-alt' },
  { value: 'shop', label: tk('Shop'), icon: 'bi-shop' },
  { value: 'line', label: tk('Line'), icon: 'bi-distribute-vertical' },
  { value: 'cell', label: tk('Cell'), icon: 'bi-grid-3x3-gap' },
  { value: 'supervisor', label: tk('Supervisor'), icon: 'bi-person-badge' },
]

export const FILTER_NAMES = FILTER_OPTIONS.map((option) => option.value)

export const INITIAL_VALUES = {
  // Access (users only): role, company (superadmin picks it) and assigned machines
  roleId: '',
  companyId: '',
  machineIds: [],
  branchId: '',
  companyName: '',
  finixId: '',
  gstNo: '',
  panNo: '',
  website: '',
  logo: null,
  email: '',
  username: '',
  password: '',
  address1: '',
  address2: '',
  country: DEFAULT_COUNTRY,
  state: '',
  city: '',
  zipCode: '',
  contactPerson: '',
  primaryPhone: '',
  secondaryPhone: '',
  timeZone: DEFAULT_TIME_ZONE,
  dayStartFrom: '',
  theme: DEFAULT_THEME,
  filters: [],
}

// Fields that are always required (excluding conditional country-specific fields)
export const REQUIRED_FIELDS = new Set([
  'roleId', // users only
  'companyId', // users, when the superadmin adds them
  'branchId',
  'companyName',
  'email',
  'username',
  'password',
  'address1',
  'country',
  'state',
  'city',
  'zipCode',
  'contactPerson',
  'primaryPhone',
  'timeZone',
  'dayStartFrom',
  'theme',
])

// Check if a field is required (including conditional country-specific fields).
// The password is only asked for when adding (PUT /users/{id} does not take one).
export const isFieldRequired = (fieldName, country, isEdit = false) => {
  if (fieldName === 'password') return !isEdit
  if (REQUIRED_FIELDS.has(fieldName)) return true
  if (country === INDIA && (fieldName === 'gstNo' || fieldName === 'panNo')) return true
  return false
}

// Zod schema for customer form validation (isEdit → no password field).
// kind USER also needs a role, and the company when needsCompany (the superadmin adds the user).
export const getCustomerSchema = (isEdit = false, { kind = ACCOUNT_KIND.CUSTOMER, needsCompany = false } = {}) => z
  .object({
    roleId: z.string(),
    companyId: z.string(),
    machineIds: z.array(z.string()),
    branchId: z.string().min(1, tk('Branch is required')),
    companyName: z.string().min(1, tk('Company name is required')).max(150, tk('Company name is too long')),
    finixId: z.string().regex(/^\d*$/, tk('Finix ID must be a number')).optional().or(z.literal('')),
    gstNo: z.string().optional(),
    panNo: z.string().optional(),
    website: z.string().regex(PATTERNS.url, tk('Enter a valid website, e.g. www.example.com')).optional().or(z.literal('')),
    logo: z
      .any()
      .refine((file) => !file || file === '' || file instanceof File, tk('Invalid file'))
      .refine((file) => !file || file === '' || ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'].includes(file.type), tk('Unsupported file type'))
      .refine((file) => !file || file === '' || file.size <= 2 * 1024 * 1024, tk('File must be smaller than 2 MB'))
      .nullable()
      .optional(),
    email: z.string().min(1, tk('Email is required')).regex(PATTERNS.email, tk('Enter a valid email address')),
    username: z.string().min(1, tk('User name is required')).regex(PATTERNS.username, tk('Use 3–50 letters, numbers, dot or underscore')),
    password: z.string(),
    address1: z.string().min(1, tk('Address line 1 is required')),
    address2: z.string().optional(),
    country: z.string().min(1, tk('Country is required')),
    state: z.string().min(1, tk('State is required')),
    city: z.string().min(1, tk('City is required')),
    zipCode: z.string().min(1, tk('Zip code is required')),
    contactPerson: z.string().min(1, tk('Contact person is required')),
    primaryPhone: z.string().min(1, tk('Primary phone is required')).regex(PATTERNS.phone, tk('Enter a valid phone number')),
    secondaryPhone: z.string().regex(PATTERNS.phone, tk('Enter a valid phone number')).optional().or(z.literal('')),
    timeZone: z.string().min(1, tk('Time zone is required')),
    dayStartFrom: z.string().min(1, tk('Day start time is required')),
    theme: z.enum(THEMES.map((option) => option.value), { message: tk('Theme is required') }),
    filters: z.array(z.enum(FILTER_NAMES)),
  })
  .superRefine((data, ctx) => {
    if (kind === ACCOUNT_KIND.USER && !data.roleId) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: tk('Role is required'), path: ['roleId'] })
    }
    if (kind === ACCOUNT_KIND.USER && needsCompany && !data.companyId) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: tk('Customer is required'), path: ['companyId'] })
    }

    if (!isEdit && data.password.length < PASSWORD_MIN_LENGTH) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: tkv('Password must be at least {{n}} characters', { n: PASSWORD_MIN_LENGTH }),
        path: ['password'],
      })
    }

    // GST and PAN are mandatory for Indian customers only
    if (data.country === INDIA) {
      if (!data.gstNo || data.gstNo.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: tk('GST No. is required'),
          path: ['gstNo'],
        })
      } else if (!PATTERNS.gstin.test(data.gstNo)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: tk('Enter a valid 15-character GSTIN'),
          path: ['gstNo'],
        })
      }

      if (!data.panNo || data.panNo.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: tk('PAN No. is required'),
          path: ['panNo'],
        })
      } else if (!PATTERNS.pan.test(data.panNo)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: tk('Enter a valid PAN, e.g. ABCDE1234F'),
          path: ['panNo'],
        })
      }

      if (!PATTERNS.pinIndia.test(data.zipCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: tk('Enter a valid 6-digit PIN code'),
          path: ['zipCode'],
        })
      }
    } else {
      // Non-India: validate postal code pattern
      if (!PATTERNS.postalCode.test(data.zipCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: tk('Enter a valid postal code'),
          path: ['zipCode'],
        })
      }
    }
  })

// ---------------------------------------------------------------------------
// API mapping — form values ⇄ users API body (POST /users, PUT /users/{id})
// ---------------------------------------------------------------------------

const nullIfBlank = (value) => (value === '' || value === undefined ? null : value)
const toId = (value) => (value === '' || value === null || value === undefined ? null : Number(value))
// Phones are typed without the country code (shown as a prefix) and sent as +<code><number>,
// digits only. A number typed with its own leading + is sent as is.
const toApiPhone = (value, dialCode) => {
  const digits = value.replace(/[\s-]/g, '')
  if (!digits) return null
  return digits.startsWith('+') ? digits : `${dialCode}${digits.replace(/^0+/, '')}`
}

// Stored +<code><number> → the number part for the form (when it uses the country's code)
const toLocalPhone = (phone, dialCode) =>
  phone && dialCode && phone.startsWith(dialCode) ? phone.slice(dialCode.length) : phone ?? ''

// <input type="time"> needs HH:mm; the API returns a timestamp such as 0000-01-01T06:00:00Z
const toTimeInput = (value) => String(value ?? '').match(/\d{2}:\d{2}/)?.[0] ?? ''

// Filter names (GET /users/{id} returns e.g. ["country", "state", "shop"]) → known names only,
// in FILTER_OPTIONS order, so the checklist ticks match and the payload order is stable.
const toFilterNames = (filters) => {
  const chosen = new Set(filters ?? [])
  return FILTER_NAMES.filter((name) => chosen.has(name))
}

// The users API keeps a person's name; the contact person is split into first / last name.
const splitName = (fullName) => {
  const [firstName = '', ...rest] = fullName.trim().split(/\s+/)
  return { firstName, lastName: rest.join(' ') }
}

// `existing` = the loaded customer (GET /users/{id}) when editing: keeps status, company and logo.
// A newly picked logo file cannot travel in JSON, so the current logo path is kept.
// kind USER sends the chosen role, company and machines; the server checks the logged-in user may
// give them (a customer's or admin's own company is used whatever companyId says).
export const toUserPayload = (values, existing = null, kind = ACCOUNT_KIND.CUSTOMER) => {
  const isUser = kind === ACCOUNT_KIND.USER
  const payload = {
    username: values.username.trim(),
    email: values.email.trim(),
    ...splitName(values.contactPerson),
    roleId: isUser ? toId(values.roleId) : CUSTOMER_ROLE_ID,
    companyId: (isUser && toId(values.companyId)) || existing?.companyId || null,
    machineIds: isUser ? values.machineIds.map(Number) : [],
    branchId: toId(values.branchId),
    companyName: values.companyName.trim(),
    finixId: toId(values.finixId),
    gstNumber: nullIfBlank(values.gstNo),
    panNumber: nullIfBlank(values.panNo),
    website: nullIfBlank(values.website.trim()),
    companyLogo: savedLogoPath(existing),
    addressLine1: values.address1.trim(),
    addressLine2: nullIfBlank(values.address2.trim()),
    country: getCountryName(values.country), // Country name, e.g. 'India'
    state: getStateName(values.country, values.state), // State name, e.g. 'Gujarat'
    city: values.city.trim(),
    zipCode: values.zipCode.trim(),
    contactPerson: values.contactPerson.trim(),
    primaryPhone: toApiPhone(values.primaryPhone, getDialCode(values.country)),
    secondaryPhone: toApiPhone(values.secondaryPhone, getDialCode(values.country)),
    timeZone: values.timeZone,
    dayStartFrom: values.dayStartFrom,
    theme: values.theme,
    // Always sent (an empty list clears them) — the server replaces the customer's filters with this list
    filters: toFilterNames(values.filters),
  }

  // PUT takes no password (it cannot be changed here), so it is only sent when adding
  if (existing) payload.status = existing.status ?? USER_STATUS.ACTIVE
  else payload.password = values.password
  return payload
}

// GET /users/{id} → form values. The details are spread over the user (branch, mobile =
// primary phone) and its nested companyProfile, address and profile; any of those may be null.
export const toFormValues = (customer) => {
  const company = customer.companyProfile ?? {}
  const address = customer.address ?? {}
  const profile = customer.profile ?? {}
  const fullName = [customer.firstName, customer.lastName].filter(Boolean).join(' ')
  // The API returns country / state names (address.countryName, stateName); the form uses codes
  const country = getCountryCode(address.countryName) || DEFAULT_COUNTRY
  const state = address.stateName ? getStateCode(country, address.stateName) : ''
  const dialCode = getDialCode(country)

  return {
    ...INITIAL_VALUES,
    roleId: customer.roleId ? String(customer.roleId) : '',
    companyId: customer.companyId ? String(customer.companyId) : '',
    machineIds: (customer.machineIds ?? []).map(String),
    branchId: customer.branchId ? String(customer.branchId) : '',
    companyName: company.companyName ?? '',
    finixId: company.finixId != null ? String(company.finixId) : '',
    gstNo: company.gstNumber ?? '',
    panNo: company.panNumber ?? '',
    website: company.website ?? '',
    email: customer.email ?? '',
    username: customer.username ?? '',
    address1: address.addressLine1 ?? '',
    address2: address.addressLine2 ?? '',
    country,
    state,
    city: address.city ?? '',
    zipCode: address.pinCode ?? '',
    contactPerson: profile.contactPerson || fullName,
    primaryPhone: toLocalPhone(customer.mobile, dialCode),
    secondaryPhone: toLocalPhone(profile.contactPhone, dialCode),
    timeZone: profile.timezone || DEFAULT_TIME_ZONE,
    dayStartFrom: toTimeInput(profile.startDayTime),
    // Saved theme; none (older users) or unknown → the default
    theme: normalizeTheme(profile.theme),
    filters: toFilterNames(profile.filters),
  }
}

// Logo path saved for a loaded customer (kept on update)
export const savedLogoPath = (customer) => customer?.profile?.profilePicture || null
