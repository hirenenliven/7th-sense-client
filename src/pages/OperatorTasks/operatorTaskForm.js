import { z } from 'zod'

// Add / Edit Operator Task form (OperatorTaskEditor.jsx). Mirrors the server rules (dto/operator_task_dto.go):
// a customer and a task are required; the machine type (a catalog model) is optional — none means
// every machine of the customer.

export const INITIAL_VALUES = { userId: '', modelId: '', maintenanceTaskId: '' }

export const REQUIRED_FIELDS = new Set(['userId', 'maintenanceTaskId'])

// Same limit as maintenance_tasks.description
export const TASK_MAX_LENGTH = 100

// maintenance_tasks.status (dto.MaintenanceTaskStatus*)
export const TASK_STATUS = { ACTIVE: 'active', INACTIVE: 'inactive' }

export const operatorTaskSchema = z.object({
  userId: z.string().min(1, 'Customer is required'),
  modelId: z.string(),
  maintenanceTaskId: z.string().min(1, 'Task is required'),
})

const toId = (value) => (value === '' || value === null || value === undefined ? null : Number(value))

// form values → POST / PUT /operator-tasks body
export const toOperatorTaskPayload = (values) => ({
  userId: toId(values.userId),
  modelId: toId(values.modelId),
  maintenanceTaskId: toId(values.maintenanceTaskId),
})

// a saved operator task → form values
export const toFormValues = (operatorTask) => ({
  userId: String(operatorTask.userId ?? ''),
  modelId: operatorTask.modelId ? String(operatorTask.modelId) : '',
  maintenanceTaskId: String(operatorTask.maintenanceTaskId ?? ''),
})

// "VF-2", with its brand and controller for the list ("Haas · NGC")
export const machineTypeLabel = (row) => row.modelName || 'All machines'
export const machineTypeDetail = (row) => [row.brandName, row.controllerName].filter(Boolean).join(' · ')

// Machine Type options grouped by "Brand · Controller", models sorted by name within a group
export const groupModels = (models) => {
  const groups = new Map()
  models.forEach((machineModel) => {
    const group = [machineModel.brandName, machineModel.controllerName].filter(Boolean).join(' · ') || 'Other'
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group).push(machineModel)
  })
  return [...groups]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, items]) => ({ label, models: items.sort((a, b) => a.name.localeCompare(b.name)) }))
}

// The task with this description (ignoring case and extra spaces), so New task picks an existing one
// instead of asking the server to add a duplicate
const normalise = (text) => text.trim().replace(/\s+/g, ' ').toLowerCase()
export const findTask = (tasks, description) => tasks.find((task) => normalise(task.description) === normalise(description))
