import apiClient, { sharedGet } from './apiClient'

// The logged-in user's states (user_state table). The server picks the user.
// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
const PATH = '/user-state'

// The server omits `data` for an empty list, so lists fall back to [].
const unwrap = (response) => response.data.data
const unwrapList = (response) => unwrap(response) ?? []

// userCountryId (optional) keeps only the states of that country
export const getUserStates = async (userCountryId) =>
  unwrapList(await sharedGet(userCountryId ? `${PATH}?userCountryId=${userCountryId}` : PATH))

// state = { userCountryId, name }
export const createUserState = async (state) => unwrap(await apiClient.post(PATH, state))

// A state is only added and removed (no update)

export const deleteUserState = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}
