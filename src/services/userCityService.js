import apiClient, { sharedGet } from './apiClient'

// The logged-in user's cities (user_city table). The server picks the user.
// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
const PATH = '/user-city'

// The server omits `data` for an empty list, so lists fall back to [].
const unwrap = (response) => response.data.data
const unwrapList = (response) => unwrap(response) ?? []

// userStateId (optional) keeps only the cities of that state
export const getUserCities = async (userStateId) =>
  unwrapList(await sharedGet(userStateId ? `${PATH}?userStateId=${userStateId}` : PATH))

// city = { userStateId, name }
export const createUserCity = async (city) => unwrap(await apiClient.post(PATH, city))

export const updateUserCity = async (id, city) => unwrap(await apiClient.put(`${PATH}/${id}`, city))

export const deleteUserCity = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}
