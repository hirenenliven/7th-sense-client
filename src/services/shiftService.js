import apiClient, { sharedGet, withQuery, unwrap, unwrapList } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
// The superadmin sees every customer's shifts (userId narrows to one customer); everyone else their
// company's. Managers (superadmin, customer, admin) create, update and delete. Each shift comes with
// its breaks and its durationMinutes / breakMinutes; breaks are saved with the shift.
const PATH = '/shifts'

export const getShifts = async (userId) => unwrapList(await sharedGet(withQuery(PATH, { userId })))

export const createShift = async (shift) => unwrap(await apiClient.post(PATH, shift))

// Replaces the shift's breaks with the ones sent
export const updateShift = async (id, shift) => unwrap(await apiClient.put(`${PATH}/${id}`, shift))

export const deleteShift = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}
