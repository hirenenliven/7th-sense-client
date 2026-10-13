import { z } from 'zod'

// Matches user_location.name VARCHAR(100) (dto/user_location_dto.go)
export const NAME_MAX_LENGTH = 100

export const INITIAL_VALUES = {
  userBranchId: '',
  name: '',
}

export const locationSchema = z.object({
  userBranchId: z.string().min(1, 'Branch is required'),
  name: z.string().trim().min(1, 'Location is required').max(NAME_MAX_LENGTH, 'Name is too long'),
})

// ---------------------------------------------------------------------------
// API mapping — form values ⇄ /user-location body ({ userBranchId, name })
// ---------------------------------------------------------------------------

export const toLocationPayload = (values) => ({
  userBranchId: Number(values.userBranchId),
  name: values.name.trim(),
})

// GET /user-location record → form values
export const toFormValues = (location) => ({
  userBranchId: location.userBranchId ? String(location.userBranchId) : '',
  name: location.name ?? '',
})
