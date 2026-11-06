import apiClient, { sharedGet, withQuery, unwrap, unwrapList } from './apiClient'

// The logged-in user's countries (user_country table). The server picks the user;
// an admin passes userId to work on another user's rows.
// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
const PATH = '/user-country'

export const getUserCountries = async (userId) => unwrapList(await sharedGet(withQuery(PATH, { userId })))

// country = { name }
export const createUserCountry = async (country, userId) => unwrap(await apiClient.post(withQuery(PATH, { userId }), country))

// A country is only added and removed (no update)

export const deleteUserCountry = async (id, userId) => {
  await apiClient.delete(withQuery(`${PATH}/${id}`, { userId }))
}
