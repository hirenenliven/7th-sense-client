import apiClient, { sharedGet, withQuery, unwrap, unwrapList } from './apiClient'

// The logged-in user's states (user_state table). The server picks the user;
// an admin passes userId to work on another user's rows.
// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
const PATH = '/user-state'

// userCountryId (optional) keeps only the states of that country
export const getUserStates = async (userCountryId, userId) =>
  unwrapList(await sharedGet(withQuery(PATH, { userCountryId, userId })))

// state = { userCountryId, name }
export const createUserState = async (state, userId) => unwrap(await apiClient.post(withQuery(PATH, { userId }), state))

// A state is only added and removed (no update)

export const deleteUserState = async (id, userId) => {
  await apiClient.delete(withQuery(`${PATH}/${id}`, { userId }))
}
