import apiClient, { sharedGet, withQuery, unwrap, unwrapList } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
// The superadmin sees every customer's schedules (userId narrows to one customer); everyone else their
// company's. Managers (superadmin, customer, admin) create, update and delete.
const PATH = '/production-schedules'

// List rows carry no items (only itemCount / totalQuantity); GET /production-schedules/{id} has them
export const getProductionSchedules = async (userId) => unwrapList(await sharedGet(withQuery(PATH, { userId })))

export const getProductionScheduleById = async (id) => unwrap(await sharedGet(`${PATH}/${id}`))

export const createProductionSchedule = async (schedule) => unwrap(await apiClient.post(PATH, schedule))

// Items with an id are updated, without one added; saved items left out are deleted
export const updateProductionSchedule = async (id, schedule) => unwrap(await apiClient.put(`${PATH}/${id}`, schedule))

export const deleteProductionSchedule = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}

// Every job of the schedules the user may read, one row per job (Operator Wise Production Schedule):
// { itemId, scheduleId, userId, customerName, scheduleDate, operatorId, operatorName, shiftId, shiftName,
// jobId, quantity, machineId, machineName, modelName, startTime, endTime, partId, partNo, partName,
// processName, programName }. Filters (all optional): userId (customer, superadmin), machineId, partId,
// operatorId, shiftId, date (YYYY-MM-DD).
export const getOperatorJobs = async (filters = {}) => unwrapList(await sharedGet(withQuery(`${PATH}/operator-jobs`, filters)))
