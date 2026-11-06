import apiClient, { sharedGet, withQuery, unwrap, unwrapList } from './apiClient'

// The logged-in user's locations (user_location table). The server picks the user;
// an admin passes userId to work on another user's rows.
// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
const PATH = '/user-location'

// branchId (optional) keeps only the locations of that branch
export const getUserLocations = async (branchId, userId) =>
  unwrapList(await sharedGet(withQuery(PATH, { branchId, userId })))

// location = { branchId, name } — branchId is a branch from GET /branches
export const createUserLocation = async (location, userId) => unwrap(await apiClient.post(withQuery(PATH, { userId }), location))

export const updateUserLocation = async (id, location, userId) =>
  unwrap(await apiClient.put(withQuery(`${PATH}/${id}`, { userId }), location))

export const deleteUserLocation = async (id, userId) => {
  await apiClient.delete(withQuery(`${PATH}/${id}`, { userId }))
}
