import apiClient, { sharedGet, withQuery, unwrap, unwrapList } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
// The superadmin sees every customer's idle reasons (userId narrows to one customer); everyone
// else their company's. Managers (superadmin, customer, admin) create, update and delete.
const PATH = '/idle-reasons'

export const getIdleReasons = async (userId) => unwrapList(await sharedGet(withQuery(PATH, { userId })))

export const createIdleReason = async (reason) => unwrap(await apiClient.post(PATH, reason))

export const updateIdleReason = async (id, reason) => unwrap(await apiClient.put(`${PATH}/${id}`, reason))

export const deleteIdleReason = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}
