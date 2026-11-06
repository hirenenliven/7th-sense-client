import apiClient, { sharedGet, withQuery, unwrap, unwrapList } from './apiClient'

// The logged-in user's cells (user_cell table). The server picks the user;
// an admin passes userId to work on another user's rows.
// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
const PATH = '/user-cell'

// userLineId (optional) keeps only the cells of that line
export const getUserCells = async (userLineId, userId) =>
  unwrapList(await sharedGet(withQuery(PATH, { userLineId, userId })))

// cell = { userLineId, name }
export const createUserCell = async (cell, userId) => unwrap(await apiClient.post(withQuery(PATH, { userId }), cell))

export const updateUserCell = async (id, cell, userId) =>
  unwrap(await apiClient.put(withQuery(`${PATH}/${id}`, { userId }), cell))

export const deleteUserCell = async (id, userId) => {
  await apiClient.delete(withQuery(`${PATH}/${id}`, { userId }))
}
