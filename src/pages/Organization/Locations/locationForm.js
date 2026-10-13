import { z } from 'zod'

// Matches user_location.name VARCHAR(100) (dto/user_location_dto.go)
export const NAME_MAX_LENGTH = 100

export const INITIAL_VALUES = {
  branchId: '',
  name: '',
}

export const locationSchema = z.object({
  branchId: z.string().min(1, 'Branch is required'),
  name: z.string().trim().min(1, 'Location is required').max(NAME_MAX_LENGTH, 'Name is too long'),
})

// ---------------------------------------------------------------------------
// API mapping — form values ⇄ /user-location body ({ branchId, name })
// ---------------------------------------------------------------------------

export const toLocationPayload = (values) => ({
  branchId: Number(values.branchId),
  name: values.name.trim(),
})

// GET /user-location record → form values
export const toFormValues = (location) => ({
  branchId: location.branchId ? String(location.branchId) : '',
  name: location.name ?? '',
})
