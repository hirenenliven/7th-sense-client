import { z } from 'zod'

// Matches user_cell.name VARCHAR(100) (dto/user_cell_dto.go)
export const NAME_MAX_LENGTH = 100

export const INITIAL_VALUES = {
  userLineId: '',
  name: '',
}

export const cellSchema = z.object({
  userLineId: z.string().min(1, 'Line is required'),
  name: z.string().trim().min(1, 'Cell is required').max(NAME_MAX_LENGTH, 'Name is too long'),
})

// ---------------------------------------------------------------------------
// API mapping — form values ⇄ /user-cell body ({ userLineId, name })
// ---------------------------------------------------------------------------

export const toCellPayload = (values) => ({
  userLineId: Number(values.userLineId),
  name: values.name.trim(),
})

// GET /user-cell record → form values
export const toFormValues = (cell) => ({
  userLineId: cell.userLineId ? String(cell.userLineId) : '',
  name: cell.name ?? '',
})
