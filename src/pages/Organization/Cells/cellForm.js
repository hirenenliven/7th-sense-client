import { z } from 'zod'
import { tk } from '@/i18n/tk'

// Matches user_cell.name VARCHAR(100) (dto/user_cell_dto.go)
export const NAME_MAX_LENGTH = 100

export const INITIAL_VALUES = {
  userLineId: '',
  name: '',
}

export const cellSchema = z.object({
  userLineId: z.string().min(1, tk('Line is required')),
  name: z.string().trim().min(1, tk('Cell is required')).max(NAME_MAX_LENGTH, tk('Name is too long')),
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
