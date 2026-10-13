import apiClient, { sharedGet } from './apiClient'

// The logged-in user's cells (user_cell table). The server picks the user.
// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
const PATH = '/user-cell'

// The server omits `data` for an empty list, so lists fall back to [].
const unwrap = (response) => response.data.data
const unwrapList = (response) => unwrap(response) ?? []

// userLineId (optional) keeps only the cells of that line
export const getUserCells = async (userLineId) =>
  unwrapList(await sharedGet(userLineId ? `${PATH}?userLineId=${userLineId}` : PATH))

// cell = { userLineId, name }
export const createUserCell = async (cell) => unwrap(await apiClient.post(PATH, cell))

export const updateUserCell = async (id, cell) => unwrap(await apiClient.put(`${PATH}/${id}`, cell))

export const deleteUserCell = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}
