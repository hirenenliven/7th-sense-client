// Centralized access to environment variables (must be prefixed with VITE_).
const env = {
  appName: import.meta.env.VITE_APP_NAME || '7th Sense',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  isDev: import.meta.env.DEV,
}

export default env
