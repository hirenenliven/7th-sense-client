import { z } from 'zod'

// Matches user_line.name VARCHAR(100) (dto/user_line_dto.go)
export const NAME_MAX_LENGTH = 100

export const INITIAL_VALUES = {
  userShopId: '',
  name: '',
}

export const lineSchema = z.object({
  userShopId: z.string().min(1, 'Shop is required'),
  name: z.string().trim().min(1, 'Line is required').max(NAME_MAX_LENGTH, 'Name is too long'),
})

// ---------------------------------------------------------------------------
// API mapping — form values ⇄ /user-line body ({ userShopId, name })
// ---------------------------------------------------------------------------

export const toLinePayload = (values) => ({
  userShopId: Number(values.userShopId),
  name: values.name.trim(),
})

// GET /user-line record → form values
export const toFormValues = (line) => ({
  userShopId: line.userShopId ? String(line.userShopId) : '',
  name: line.name ?? '',
})
