import apiClient, { unwrap, unwrapList } from './apiClient'

// Login sessions (server ADR 0014). A session is { id, userId, device, browser, os, ipAddress,
// createdAt, lastUsedAt, expiresAt, isCurrent, isLoginAs }; no token is ever returned.
const SESSIONS_PATH = '/sessions'
const ADMIN_PATH = '/admin'

// The logged-in user's active sessions (the current one has isCurrent)
export const getMySessions = async () => unwrapList(await apiClient.get(SESSIONS_PATH))

// Logs out one of the logged-in user's sessions (another user's id answers 404)
export const revokeMySession = async (id) => {
  await apiClient.delete(`${SESSIONS_PATH}/${id}`)
}

// Logs out every session of the logged-in user but this one; returns { revoked }
export const revokeMyOtherSessions = async () => unwrap(await apiClient.delete(`${SESSIONS_PATH}/others`))

// Superadmin: a user's active sessions, "log in as" ones included (isLoginAs)
export const getUserSessions = async (userId) => unwrapList(await apiClient.get(`${ADMIN_PATH}/users/${userId}/sessions`))

// Superadmin: logs out one session of any user
export const revokeUserSession = async (id) => {
  await apiClient.delete(`${ADMIN_PATH}/sessions/${id}`)
}

// Superadmin: logs out every session of a user; returns { revoked }
export const revokeAllUserSessions = async (userId) =>
  unwrap(await apiClient.delete(`${ADMIN_PATH}/users/${userId}/sessions`))
