import apiClient, { sharedGet } from './apiClient'

// The logged-in user's branches (user_branch table). The server picks the user.
// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
const PATH = '/user-branch'

// The server omits `data` for an empty list, so lists fall back to [].
const unwrap = (response) => response.data.data
const unwrapList = (response) => unwrap(response) ?? []

// userCityId (optional) keeps only the branches of that city
export const getUserBranches = async (userCityId) =>
  unwrapList(await sharedGet(userCityId ? `${PATH}?userCityId=${userCityId}` : PATH))

// branch = { userCityId, name }
export const createUserBranch = async (branch) => unwrap(await apiClient.post(PATH, branch))

export const updateUserBranch = async (id, branch) => unwrap(await apiClient.put(`${PATH}/${id}`, branch))

export const deleteUserBranch = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}
