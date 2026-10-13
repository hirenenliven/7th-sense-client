import apiClient, { sharedGet, withQuery } from './apiClient'

// The logged-in user's lines (user_line table). The server picks the user;
// an admin passes userId to work on another user's rows.
// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
const PATH = '/user-line'

// The server omits `data` for an empty list, so lists fall back to [].
const unwrap = (response) => response.data.data
const unwrapList = (response) => unwrap(response) ?? []

// userShopId (optional) keeps only the lines of that shop
export const getUserLines = async (userShopId, userId) =>
  unwrapList(await sharedGet(withQuery(PATH, { userShopId, userId })))

// line = { userShopId, name }
export const createUserLine = async (line, userId) => unwrap(await apiClient.post(withQuery(PATH, { userId }), line))

export const updateUserLine = async (id, line, userId) =>
  unwrap(await apiClient.put(withQuery(`${PATH}/${id}`, { userId }), line))

export const deleteUserLine = async (id, userId) => {
  await apiClient.delete(withQuery(`${PATH}/${id}`, { userId }))
}
