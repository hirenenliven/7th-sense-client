import { z } from 'zod'
import { tk } from '@/i18n/tk'

export const INITIAL_VALUES = {
  names: [],
}

// The names are picked from the country library (constants/countryLibrary.js), several at once
export const countrySchema = z.object({
  names: z.array(z.string()).min(1, tk('Select at least one country')),
})

// ---------------------------------------------------------------------------
// API mapping — form values → /user-country bodies ({ name }), one per country
// ---------------------------------------------------------------------------

export const toCountryPayloads = (values) => values.names.map((name) => ({ name: name.trim() }))
