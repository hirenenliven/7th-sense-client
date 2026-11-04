import apiClient from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// The session lives in an HttpOnly cookie set by the server: the token is never visible to
// this code, so it cannot be stolen by a script. These functions return the user
// ({ id, username, email, firstName, lastName, status, role }).
const AUTH_PATH = '/auth'

const unwrap = (response) => response.data.data

export const login = async ({ username, password, remember }) =>
  unwrap(await apiClient.post(`${AUTH_PATH}/login`, { username, password, remember }))

// The logged-in user; rejects with statusCode 401 when there is no valid session.
export const getSession = async () => unwrap(await apiClient.get(`${AUTH_PATH}/me`))

// Superadmin only: starts a session of the customer for this tab ("log in as", utils/loginAs.js).
// Returns { sessionKey, user }; the session token itself is set as an HttpOnly cookie.
export const loginAs = async (customerId) => unwrap(await apiClient.post(`${AUTH_PATH}/login-as`, { customerId }))

export const logout = async () => {
  await apiClient.post(`${AUTH_PATH}/logout`)
}
