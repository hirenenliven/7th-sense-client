import { z } from 'zod'
import { TASK_MAX_LENGTH, TASK_STATUS } from './operatorTaskForm'

// Add / Edit Task form of the Task List (TaskListEditor.jsx). Mirrors dto.CreateMaintenanceTaskRequest /
// UpdateMaintenanceTaskRequest: a description of at most 100 characters; status only on edit.

export const INITIAL_VALUES = { description: '', status: TASK_STATUS.ACTIVE }

export const taskSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, 'Task is required')
    .max(TASK_MAX_LENGTH, `Task must be at most ${TASK_MAX_LENGTH} characters`),
  status: z.enum([TASK_STATUS.ACTIVE, TASK_STATUS.INACTIVE]),
})

// The server trims the text and joins runs of spaces; the form sends it the same way
export const toTaskPayload = (values) => ({
  description: values.description.trim().replace(/\s+/g, ' '),
  status: values.status,
})

export const toFormValues = (task) => ({ description: task.description ?? '', status: task.status || TASK_STATUS.ACTIVE })

// "Not used" / "1 operator task" / "3 operator tasks"
export const usageLabel = (count) => {
  if (!count) return 'Not used'
  return `${count} operator task${count === 1 ? '' : 's'}`
}
