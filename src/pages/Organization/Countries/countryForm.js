import { z } from 'zod'

export const INITIAL_VALUES = {
  name: '',
}

// The name is picked from the country library (constants/locations.js)
export const countrySchema = z.object({
  name: z.string().min(1, 'Country is required'),
})

// ---------------------------------------------------------------------------
// API mapping — form values → /user-country body ({ name })
// ---------------------------------------------------------------------------

export const toCountryPayload = (values) => ({
  name: values.name.trim(),
})
