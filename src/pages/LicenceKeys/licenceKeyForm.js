import { z } from 'zod'
import { tk, tkv } from '@/i18n/tk'

// Licence key API limits (dto/licence_key_dto.go)
export const MAX_KEYS = 100

export const LICENCE_KEY_STATUS = { ACTIVE: 'active', INACTIVE: 'inactive' }

// Subscription plans (server dto.LicenceKeyDurations): the licence runs from the day the key is
// saved; the server stores the end date (`expiresOn`, null = Life Time). Trial = 30 days.
export const LICENCE_DURATIONS = [
  { value: 'TRIAL', label: tk('Considerable Trial') },
  { value: 'TRIAL_1Y', label: '1 Year Considerable Trial' },
  // Labels are keys: show them with translateText(t, label)
  ...Array.from({ length: 12 }, (_, index) => ({
    value: `M${index + 1}`,
    label: index ? tkv('{{n}} Months', { n: index + 1 }) : tk('1 Month'),
  })),
  ...Array.from({ length: 3 }, (_, index) => ({
    value: `Y${index + 1}`,
    label: index ? tkv('{{n}} Years', { n: index + 1 }) : tk('1 Year'),
  })),
  { value: 'LIFETIME', label: tk('Life Time') },
]
export const DEFAULT_DURATION = 'TRIAL'
const DURATION_VALUES = LICENCE_DURATIONS.map((duration) => duration.value)

export const durationLabel = (value) => LICENCE_DURATIONS.find((duration) => duration.value === value)?.label ?? value ?? '—'

// Generate Licence Key form: customer and number of keys (typed as text, checked here), then the
// generated keys, each with its subscription duration ({ licenceKey, duration })
export const GENERATE_INITIAL_VALUES = {
  userId: '',
  count: '',
  keys: [],
}

export const generateSchema = z.object({
  userId: z.string().min(1, tk('Customer is required')),
  count: z
    .string()
    .trim()
    .min(1, tk('No. of keys is required'))
    .regex(/^\d+$/, tk('Enter a whole number'))
    .refine((value) => Number(value) >= 1 && Number(value) <= MAX_KEYS, tkv('Enter 1 to {{n}} keys', { n: MAX_KEYS })),
  keys: z
    .array(z.object({ licenceKey: z.string(), duration: z.enum(DURATION_VALUES, tk('Select a subscription duration')) }))
    .min(1, tk('Click Generate Key first')),
})

// Edit Licence Key modal: the key itself never changes, only its customer and status
export const editSchema = z.object({
  userId: z.string().min(1, tk('Customer is required')),
  duration: z.enum(DURATION_VALUES, tk('Select a subscription duration')),
  status: z.enum([LICENCE_KEY_STATUS.ACTIVE, LICENCE_KEY_STATUS.INACTIVE]),
})

// A list row → edit form values
export const toEditValues = (licenceKey) => ({
  userId: String(licenceKey.userId ?? ''),
  duration: DURATION_VALUES.includes(licenceKey.duration) ? licenceKey.duration : DEFAULT_DURATION,
  status: licenceKey.status === LICENCE_KEY_STATUS.INACTIVE ? LICENCE_KEY_STATUS.INACTIVE : LICENCE_KEY_STATUS.ACTIVE,
})

export const toEditPayload = (values) => ({ userId: Number(values.userId), duration: values.duration, status: values.status })
