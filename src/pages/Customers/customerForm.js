import { DEFAULT_COUNTRY, DEFAULT_TIME_ZONE, INDIA } from '@/constants/locations'
import { PASSWORD_MIN_LENGTH, PATTERNS } from '@/utils/validators'
import { z } from 'zod'

export const FIELD_ID_PREFIX = 'customer-'

export const LOGO_RULES = {
  accept: '.png,.jpg,.jpeg,.svg,.webp',
  types: ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'],
  maxBytes: 2 * 1024 * 1024,
}

export const INITIAL_VALUES = {
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
}

// Inputs typed in capitals (tax IDs)
export const UPPERCASE_FIELDS = new Set(['gstNo', 'panNo'])

// Fields that are always required (excluding conditional country-specific fields)
export const REQUIRED_FIELDS = new Set([
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
])

// Check if a field is required (including conditional country-specific fields)
export const isFieldRequired = (fieldName, country) => {
  if (REQUIRED_FIELDS.has(fieldName)) return true
  if (country === INDIA && (fieldName === 'gstNo' || fieldName === 'panNo')) return true
  return false
}

// Zod schema for customer form validation
export const customerSchema = z
  .object({
    branchId: z.string().min(1, 'Branch is required'),
    companyName: z.string().min(1, 'Company name is required').max(150, 'Company name is too long'),
    finixId: z.string().optional(),
    gstNo: z.string().optional(),
    panNo: z.string().optional(),
    website: z.string().regex(PATTERNS.url, 'Enter a valid website, e.g. www.example.com').optional().or(z.literal('')),
    logo: z
      .any()
      .refine((file) => !file || file instanceof File, 'Invalid file')
      .refine((file) => !file || LOGO_RULES.types.includes(file.type), 'Unsupported file type')
      .refine((file) => !file || file.size <= LOGO_RULES.maxBytes, `File must be smaller than ${Math.round(LOGO_RULES.maxBytes / (1024 * 1024))} MB`)
      .nullable()
      .optional(),
    email: z.string().min(1, 'Email is required').regex(PATTERNS.email, 'Enter a valid email address'),
    username: z.string().min(1, 'User name is required').regex(PATTERNS.username, 'Use 3–30 letters, numbers, dot, dash or underscore'),
    password: z.string().min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`),
    address1: z.string().min(1, 'Address line 1 is required'),
    address2: z.string().optional(),
    country: z.string().min(1, 'Country is required'),
    state: z.string().min(1, 'State is required'),
    city: z.string().min(1, 'City is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    contactPerson: z.string().min(1, 'Contact person is required'),
    primaryPhone: z.string().min(1, 'Primary phone is required').regex(PATTERNS.phone, 'Enter a valid phone number'),
    secondaryPhone: z.string().regex(PATTERNS.phone, 'Enter a valid phone number').optional().or(z.literal('')),
    timeZone: z.string().min(1, 'Time zone is required'),
    dayStartFrom: z.string().min(1, 'Day start time is required'),
  })
  .superRefine((data, ctx) => {
    // GST and PAN are mandatory for Indian customers only
    if (data.country === INDIA) {
      if (!data.gstNo || data.gstNo.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'GST No. is required',
          path: ['gstNo'],
        })
      } else if (!PATTERNS.gstin.test(data.gstNo)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Enter a valid 15-character GSTIN',
          path: ['gstNo'],
        })
      }

      if (!data.panNo || data.panNo.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'PAN No. is required',
          path: ['panNo'],
        })
      } else if (!PATTERNS.pan.test(data.panNo)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Enter a valid PAN, e.g. ABCDE1234F',
          path: ['panNo'],
        })
      }

      if (!PATTERNS.pinIndia.test(data.zipCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Enter a valid 6-digit PIN code',
          path: ['zipCode'],
        })
      }
    } else {
      // Non-India: validate postal code pattern
      if (!PATTERNS.postalCode.test(data.zipCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Enter a valid postal code',
          path: ['zipCode'],
        })
      }
    }
  })
