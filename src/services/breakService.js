import apiClient, { sharedGet, withQuery, unwrap, unwrapList } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
// A customer's breaks; each is taken by at most one of its shifts (shiftId / shiftName, null = none).
// The superadmin sees every customer's (userId narrows to one customer); everyone else their
// company's. Managers (superadmin, customer, admin) create, update and delete.
const PATH = '/breaks'

export const getBreaks = async (userId) => unwrapList(await sharedGet(withQuery(PATH, { userId })))

export const createBreak = async (shiftBreak) => unwrap(await apiClient.post(PATH, shiftBreak))

// Refused when the break no longer fits its shift (inside it, no overlap with its other breaks)
export const updateBreak = async (id, shiftBreak) => unwrap(await apiClient.put(`${PATH}/${id}`, shiftBreak))

export const deleteBreak = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}
