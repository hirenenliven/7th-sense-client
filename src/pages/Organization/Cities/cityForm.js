import { z } from 'zod'

// Matches user_city.name VARCHAR(100) (dto/user_city_dto.go)
export const NAME_MAX_LENGTH = 100

export const INITIAL_VALUES = {
  userStateId: '',
  name: '',
}

export const citySchema = z.object({
  userStateId: z.string().min(1, 'State is required'),
  name: z.string().trim().min(1, 'City is required').max(NAME_MAX_LENGTH, 'Name is too long'),
})

// ---------------------------------------------------------------------------
// API mapping — form values ⇄ /user-city body ({ userStateId, name })
// ---------------------------------------------------------------------------

export const toCityPayload = (values) => ({
  userStateId: Number(values.userStateId),
  name: values.name.trim(),
})

// GET /user-city record → form values
export const toFormValues = (city) => ({
  userStateId: city.userStateId ? String(city.userStateId) : '',
  name: city.name ?? '',
})
