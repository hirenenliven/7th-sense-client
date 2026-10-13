import apiClient, { sharedGet, withQuery } from './apiClient'

// The logged-in user's cities (user_city table). The server picks the user;
// an admin passes userId to work on another user's rows.
// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
const PATH = '/user-city'

// The server omits `data` for an empty list, so lists fall back to [].
const unwrap = (response) => response.data.data
const unwrapList = (response) => unwrap(response) ?? []

// userStateId (optional) keeps only the cities of that state
export const getUserCities = async (userStateId, userId) =>
  unwrapList(await sharedGet(withQuery(PATH, { userStateId, userId })))

// city = { userStateId, name }
export const createUserCity = async (city, userId) => unwrap(await apiClient.post(withQuery(PATH, { userId }), city))

export const updateUserCity = async (id, city, userId) =>
  unwrap(await apiClient.put(withQuery(`${PATH}/${id}`, { userId }), city))

export const deleteUserCity = async (id, userId) => {
  await apiClient.delete(withQuery(`${PATH}/${id}`, { userId }))
}
