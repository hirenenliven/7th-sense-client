import { z } from 'zod'

// Matches user_branch.name VARCHAR(100) (dto/user_branch_dto.go)
export const NAME_MAX_LENGTH = 100

export const INITIAL_VALUES = {
  userCityId: '',
  name: '',
}

export const branchSchema = z.object({
  userCityId: z.string().min(1, 'City is required'),
  name: z.string().trim().min(1, 'Branch is required').max(NAME_MAX_LENGTH, 'Name is too long'),
})

// ---------------------------------------------------------------------------
// API mapping — form values ⇄ /user-branch body ({ userCityId, name })
// ---------------------------------------------------------------------------

export const toBranchPayload = (values) => ({
  userCityId: Number(values.userCityId),
  name: values.name.trim(),
})

// GET /user-branch record → form values
export const toFormValues = (branch) => ({
  userCityId: branch.userCityId ? String(branch.userCityId) : '',
  name: branch.name ?? '',
})
