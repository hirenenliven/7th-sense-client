import { z } from 'zod'

// Matches user_supervisor.name VARCHAR(100) (dto/user_supervisor_dto.go)
export const NAME_MAX_LENGTH = 100

export const INITIAL_VALUES = {
  userCellId: '',
  name: '',
}

export const supervisorSchema = z.object({
  userCellId: z.string().min(1, 'Cell is required'),
  name: z.string().trim().min(1, 'Supervisor is required').max(NAME_MAX_LENGTH, 'Name is too long'),
})

// ---------------------------------------------------------------------------
// API mapping — form values ⇄ /user-supervisor body ({ userCellId, name })
// ---------------------------------------------------------------------------

export const toSupervisorPayload = (values) => ({
  userCellId: Number(values.userCellId),
  name: values.name.trim(),
})

// GET /user-supervisor record → form values
export const toFormValues = (supervisor) => ({
  userCellId: supervisor.userCellId ? String(supervisor.userCellId) : '',
  name: supervisor.name ?? '',
})
