import apiClient, { sharedGet } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
const BRANCHES_PATH = '/branches'

// The server omits `data` for an empty list, so lists fall back to [].
const unwrap = (response) => response.data.data
const unwrapList = (response) => unwrap(response) ?? []

export const getBranches = async () => unwrapList(await sharedGet(BRANCHES_PATH))

export const getBranchById = async (id) => unwrap(await sharedGet(`${BRANCHES_PATH}/${id}`))

export const createBranch = async (branch) => unwrap(await apiClient.post(BRANCHES_PATH, branch))

export const updateBranch = async (id, branch) => unwrap(await apiClient.put(`${BRANCHES_PATH}/${id}`, branch))

export const deleteBranch = async (id) => {
  await apiClient.delete(`${BRANCHES_PATH}/${id}`)
}
