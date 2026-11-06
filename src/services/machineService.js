import apiClient, { sharedGet, withQuery, unwrap, unwrapList } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
// The superadmin sees every customer's machines (userId narrows to one customer). A customer and
// its admins see all of the company's machines; other users only the machines assigned to them.
// Only the superadmin may create, update and delete.
const PATH = '/machines'

export const getMachines = async (userId) => unwrapList(await sharedGet(withQuery(PATH, { userId })))

export const getMachineById = async (id) => unwrap(await sharedGet(`${PATH}/${id}`))

export const createMachine = async (machine) => unwrap(await apiClient.post(PATH, machine))

// A blank password keeps the saved one
export const updateMachine = async (id, machine) => unwrap(await apiClient.put(`${PATH}/${id}`, machine))

export const deleteMachine = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}
