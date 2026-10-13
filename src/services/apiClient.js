import axios from 'axios'
import env from '@/config/env'

const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach auth token (if any) to every request.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const GENERIC_ERROR = 'Something went wrong'

// Normalize error responses: { message, statusCode }. 400 / 404 messages are written for
// end users and shown as is; server errors (5xx) get a generic message.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error.response?.data?.statusCode ?? error.response?.status
    const message =
      statusCode >= 500 ? GENERIC_ERROR : error.response?.data?.message || error.message || GENERIC_ERROR
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
