import apiClient, { sharedGet } from './apiClient'

// The logged-in user's countries (user_country table). The server picks the user.
// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
const PATH = '/user-country'

// The server omits `data` for an empty list, so lists fall back to [].
const unwrap = (response) => response.data.data
const unwrapList = (response) => unwrap(response) ?? []

export const getUserCountries = async () => unwrapList(await sharedGet(PATH))

// country = { name }
export const createUserCountry = async (country) => unwrap(await apiClient.post(PATH, country))

// A country is only added and removed (no update)

export const deleteUserCountry = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}
