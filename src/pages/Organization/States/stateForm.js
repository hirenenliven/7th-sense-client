import { z } from 'zod'

export const INITIAL_VALUES = {
  userCountryId: '',
  names: [],
}

// One of the user's countries, then any number of its states (country library)
export const stateSchema = z.object({
  userCountryId: z.string().min(1, 'Country is required'),
  names: z.array(z.string()).min(1, 'Select at least one state'),
})

// ---------------------------------------------------------------------------
// API mapping — form values → /user-state bodies ({ userCountryId, name }), one per state
// ---------------------------------------------------------------------------

export const toStatePayloads = (values) =>
  values.names.map((name) => ({ userCountryId: Number(values.userCountryId), name: name.trim() }))
