import apiClient, { sharedGet, withQuery } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
// Admins see every customer's machines (userId narrows to one customer); other users
// only get their own. Only admins may create, update and delete.
const PATH = '/machines'

// The server omits `data` for an empty list, so lists fall back to [].
const unwrap = (response) => response.data.data
const unwrapList = (response) => unwrap(response) ?? []

export const getMachines = async (userId) => unwrapList(await sharedGet(withQuery(PATH, { userId })))

export const getMachineById = async (id) => unwrap(await sharedGet(`${PATH}/${id}`))

export const createMachine = async (machine) => unwrap(await apiClient.post(PATH, machine))

// A blank password keeps the saved one
export const updateMachine = async (id, machine) => unwrap(await apiClient.put(`${PATH}/${id}`, machine))

export const deleteMachine = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}
