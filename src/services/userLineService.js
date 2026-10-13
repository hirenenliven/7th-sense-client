import apiClient, { sharedGet } from './apiClient'

// The logged-in user's lines (user_line table). The server picks the user.
// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
const PATH = '/user-line'

// The server omits `data` for an empty list, so lists fall back to [].
const unwrap = (response) => response.data.data
const unwrapList = (response) => unwrap(response) ?? []

// userShopId (optional) keeps only the lines of that shop
export const getUserLines = async (userShopId) =>
  unwrapList(await sharedGet(userShopId ? `${PATH}?userShopId=${userShopId}` : PATH))

// line = { userShopId, name }
export const createUserLine = async (line) => unwrap(await apiClient.post(PATH, line))

export const updateUserLine = async (id, line) => unwrap(await apiClient.put(`${PATH}/${id}`, line))

export const deleteUserLine = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}
