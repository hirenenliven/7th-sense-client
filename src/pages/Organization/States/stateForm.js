import { z } from 'zod'

// Matches user_state.name VARCHAR(100) (dto/user_state_dto.go)
export const NAME_MAX_LENGTH = 100

export const INITIAL_VALUES = {
  userCountryId: '',
  name: '',
}

export const stateSchema = z.object({
  userCountryId: z.string().min(1, 'Country is required'),
  name: z.string().trim().min(1, 'State is required').max(NAME_MAX_LENGTH, 'Name is too long'),
})

// ---------------------------------------------------------------------------
// API mapping — form values ⇄ /user-state body ({ userCountryId, name })
// ---------------------------------------------------------------------------

export const toStatePayload = (values) => ({
  userCountryId: Number(values.userCountryId),
  name: values.name.trim(),
})
