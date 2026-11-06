import axios from 'axios'
import env from '@/config/env'
import { apiBaseUrl } from '@/utils/loginAs'

const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Authentication: the server sets an HttpOnly session cookie at login, and the browser sends it
// with every same-origin /api request. No token is stored or attached here.
// A "log in as customer" tab calls /api/as/<sessionKey>/v1 instead, where its own cookie lives
// (utils/loginAs.js), so it never uses or ends the superadmin's session.
apiClient.interceptors.request.use((config) => ({ ...config, baseURL: apiBaseUrl() }))

// Every response is { statusCode, success, message, data }; services return `data`. The server
// omits `data` for an empty list, so lists fall back to [].
export const unwrap = (response) => response.data.data
export const unwrapList = (response) => unwrap(response) ?? []

const GENERIC_ERROR = 'Something went wrong'

// 401 = no valid session (expired, logged out elsewhere, user deactivated).
// AuthProvider subscribes and sends the user back to the login screen.
const unauthorizedListeners = new Set()

export const onUnauthorized = (listener) => {
  unauthorizedListeners.add(listener)
  return () => unauthorizedListeners.delete(listener)
}

// Also called by the live socket when the server ends its session (services/liveSocket.js)
export const notifyUnauthorized = () => unauthorizedListeners.forEach((listener) => listener())

// Normalize error responses: { message, statusCode }. 400 / 404 messages are written for
// end users and shown as is; server errors (5xx) get a generic message.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error.response?.data?.statusCode ?? error.response?.status
    const message =
      statusCode >= 500 ? GENERIC_ERROR : error.response?.data?.message || error.message || GENERIC_ERROR
    if (statusCode === 401) notifyUnauthorized()
    return Promise.reject({ ...error, message, statusCode })
  },
)

// GET that shares one request between identical calls made while it is still pending.
// React StrictMode runs effects twice in dev; without this every page load fires each GET twice.
const pendingGets = new Map()

export const sharedGet = (url) => {
  if (!pendingGets.has(url)) {
    const request = apiClient.get(url).finally(() => pendingGets.delete(url))
    pendingGets.set(url, request)
  }
  return pendingGets.get(url)
}

export default apiClient

// path + query string from params; empty values ('', null, undefined) are left out.
// withQuery('/user-city', { userStateId: 3, userId: '' }) → '/user-city?userStateId=3'
export const withQuery = (path, params) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined),
  ).toString()
  return query ? `${path}?${query}` : path
}
