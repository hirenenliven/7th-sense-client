import apiClient, { sharedGet, unwrap, unwrapList, withQuery } from './apiClient'

// Operator tasks (server ADR 0015). Every response is { statusCode, success, message, data }; these
// functions return `data`. Everyone reads (operator tasks: their company's); only the superadmin writes.

// The master list of tasks: { id, description, status }, ordered by description
export const getMaintenanceTasks = async () => unwrapList(await sharedGet('/maintenance-tasks'))

// Adds a task to the master list (Task field → New task); rejects "This task already exists"
export const createMaintenanceTask = async (description) => unwrap(await apiClient.post('/maintenance-tasks', { description }))

const PATH = '/operator-tasks'

// { id, userId, customerName, companyName, modelId (null = every machine), modelName, controllerName,
// brandName, maintenanceTaskId, task }. userId narrows the superadmin's list to one customer.
export const getOperatorTasks = async (userId) => unwrapList(await sharedGet(withQuery(PATH, { userId })))

// Body { userId, modelId, maintenanceTaskId }
export const createOperatorTask = async (operatorTask) => unwrap(await apiClient.post(PATH, operatorTask))

export const updateOperatorTask = async (id, operatorTask) => unwrap(await apiClient.put(`${PATH}/${id}`, operatorTask))

export const deleteOperatorTask = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}

// Task List: changes a task's description and status ('active' / 'inactive'); returns it
export const updateMaintenanceTask = async (id, task) => unwrap(await apiClient.put(`/maintenance-tasks/${id}`, task))

// Task List: deletes a task; refused (400) while operator tasks use it
export const deleteMaintenanceTask = async (id) => {
  await apiClient.delete(`/maintenance-tasks/${id}`)
}
