import apiClient, { sharedGet, withQuery, unwrap, unwrapList } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
// The superadmin sees every customer's downtime reasons (userId narrows to one customer); everyone
// else their company's. Managers (superadmin, customer, admin) create, update and delete.
const PATH = '/downtime-reasons'

export const getDowntimeReasons = async (userId) => unwrapList(await sharedGet(withQuery(PATH, { userId })))

export const createDowntimeReason = async (reason) => unwrap(await apiClient.post(PATH, reason))

export const updateDowntimeReason = async (id, reason) => unwrap(await apiClient.put(`${PATH}/${id}`, reason))

export const deleteDowntimeReason = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}
