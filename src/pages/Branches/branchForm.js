import { BRANCH_STATUS } from '@/constants/app'
import { PATTERNS } from '@/utils/validators'
import { z } from 'zod'

// Native <input type="color"> cannot be blank; shown in the picker until a colour is chosen
export const COLOR_PICKER_FALLBACK = '#000000'

export const INITIAL_VALUES = {
  code: '',
  name: '',
  email: '',
  customerId: '',
  address: '',
  userCityId: '',
  gstNumber: '',
  panNumber: '',
  colorCode: '',
  status: BRANCH_STATUS.ACTIVE,
}

export const REQUIRED_FIELDS = new Set(['code', 'name', 'status'])

// Fields typed in capitals (codes and tax IDs)
export const UPPERCASE_FIELDS = new Set(['code', 'gstNumber', 'panNumber'])

const optional = (pattern, message) => z.string().regex(pattern, message).optional().or(z.literal(''))

// Mirrors the branches API rules (dto/branch_dto.go)
export const branchSchema = z.object({
  code: z.string().min(1, 'Code is required').regex(PATTERNS.branchCode, 'Use 2–20 capital letters or digits'),
  name: z.string().trim().min(1, 'Name is required').max(200, 'Name is too long'),
  email: optional(PATTERNS.email, 'Enter a valid email address'),
  customerId: z.string().optional(),
  address: z.string().max(500, 'Address is too long').optional(),
  userCityId: z.string().optional(),
  gstNumber: optional(PATTERNS.gstin, 'Enter a valid 15-character GSTIN'),
  panNumber: optional(PATTERNS.pan, 'Enter a valid PAN, e.g. ABCDE1234F'),
  colorCode: optional(PATTERNS.hexColor, 'Enter a colour such as #F58220'),
  status: z.enum([BRANCH_STATUS.ACTIVE, BRANCH_STATUS.INACTIVE], { message: 'Status is required' }),
})

// ---------------------------------------------------------------------------
// API mapping — form values ⇄ branches API body (POST /branches, PUT /branches/{id})
// ---------------------------------------------------------------------------

const toId = (value) => (value === '' || value === null || value === undefined ? null : Number(value))
const trim = (value) => (value ?? '').trim()

// City text saved with the branch (shown in the Branch List): the picked city's name.
// When the city is unchanged and its name is not at hand (status toggle, or an older branch
// saved with a typed city and no userCityId), the saved text is kept.
const cityName = (userCityId, cities, existing) => {
  const picked = cities.find((city) => city.id === userCityId)
  if (picked) return picked.name
  return userCityId === (existing?.userCityId ?? null) ? existing?.city ?? '' : ''
}

// `existing` = the loaded branch when editing: keeps stateId, which the form does not edit.
// `cities` = GET /user-city records (the City dropdown options).
export const toBranchPayload = (values, existing = null, cities = []) => ({
  code: trim(values.code),
  name: trim(values.name),
  email: trim(values.email),
  address: trim(values.address),
  userCityId: toId(values.userCityId),
  city: cityName(toId(values.userCityId), cities, existing),
  stateId: existing?.stateId ?? null,
  customerId: toId(values.customerId),
  gstNumber: trim(values.gstNumber),
  panNumber: trim(values.panNumber),
  colorCode: trim(values.colorCode),
  status: values.status,
})

// GET /branches/{id} → form values
export const toFormValues = (branch) => ({
  ...INITIAL_VALUES,
  code: branch.code ?? '',
  name: branch.name ?? '',
  email: branch.email ?? '',
  customerId: branch.customerId ? String(branch.customerId) : '',
  address: branch.address ?? '',
  userCityId: branch.userCityId ? String(branch.userCityId) : '',
  gstNumber: branch.gstNumber ?? '',
  panNumber: branch.panNumber ?? '',
  colorCode: branch.colorCode ?? '',
  status: branch.status || BRANCH_STATUS.ACTIVE,
})
