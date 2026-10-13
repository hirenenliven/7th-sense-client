import apiClient, { sharedGet } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
const USERS_PATH = '/users'

// The server omits `data` for an empty list, so lists fall back to [].
const unwrap = (response) => response.data.data
const unwrapList = (response) => unwrap(response) ?? []

export const getUsers = async () => unwrapList(await sharedGet(USERS_PATH))

export const getUserById = async (id) => unwrap(await sharedGet(`${USERS_PATH}/${id}`))

// The logged-in user with its profile (theme, …)
export const getCurrentUser = async () => unwrap(await sharedGet('/me'))

export const createUser = async (user) => unwrap(await apiClient.post(USERS_PATH, user))

export const updateUser = async (id, user) => unwrap(await apiClient.put(`${USERS_PATH}/${id}`, user))

export const deleteUser = async (id) => {
  await apiClient.delete(`${USERS_PATH}/${id}`)
}
