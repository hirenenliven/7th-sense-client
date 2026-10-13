import apiClient, { sharedGet } from './apiClient'

// The logged-in user's locations (user_location table). The server picks the user.
// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
const PATH = '/user-location'

// The server omits `data` for an empty list, so lists fall back to [].
const unwrap = (response) => response.data.data
const unwrapList = (response) => unwrap(response) ?? []

// userBranchId (optional) keeps only the locations of that branch
export const getUserLocations = async (userBranchId) =>
  unwrapList(await sharedGet(userBranchId ? `${PATH}?userBranchId=${userBranchId}` : PATH))

// location = { userBranchId, name }
export const createUserLocation = async (location) => unwrap(await apiClient.post(PATH, location))

export const updateUserLocation = async (id, location) => unwrap(await apiClient.put(`${PATH}/${id}`, location))

export const deleteUserLocation = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}
