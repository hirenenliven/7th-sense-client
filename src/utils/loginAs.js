import env from '@/config/env'
import { STORAGE_KEYS } from '@/constants/app'
import { ROUTES } from '@/constants/routes'

// "Log in as customer" (ADR 0018): the superadmin opens a customer's account in a new tab. The
// server scopes that session's HttpOnly cookie to /api/as/<sessionKey>, so this tab calls the API
// under that path and the superadmin's own session (cookie on /api) is never replaced or ended.
// The key is per tab (sessionStorage): a reload keeps it, other tabs never see it. It is not a
// secret — the session token stays in the cookie.

// The new tab opens at /#loginAs=<sessionKey>; takeLoginAsFromUrl() moves the key to this tab's
// storage and removes the hash before the app renders, so the tab simply shows the dashboard.
const LOGIN_AS_HASH = '#loginAs='
const SESSION_KEY_PATTERN = /^[0-9a-f]{32}$/

// sessionStorage can throw (private mode, blocked storage) — never let it break the UI.
const readSessionKey = () => {
  try {
    const sessionKey = sessionStorage.getItem(STORAGE_KEYS.LOGIN_AS) || ''
    return SESSION_KEY_PATTERN.test(sessionKey) ? sessionKey : ''
  } catch {
    return ''
  }
}

export const clearLoginAs = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEYS.LOGIN_AS)
  } catch {
    // ignore
  }
}

// Where the new tab opens for a "log in as" session
export const loginAsUrl = (sessionKey) => `${ROUTES.HOME}${LOGIN_AS_HASH}${sessionKey}`

// Called once in main.jsx, before the first render
export const takeLoginAsFromUrl = () => {
  const { hash, pathname, search } = window.location
  if (!hash.startsWith(LOGIN_AS_HASH)) return
  const sessionKey = hash.slice(LOGIN_AS_HASH.length)
  if (SESSION_KEY_PATTERN.test(sessionKey)) {
    try {
      sessionStorage.setItem(STORAGE_KEYS.LOGIN_AS, sessionKey)
    } catch {
      // without storage the tab stays on the superadmin's session
    }
  }
  window.history.replaceState(null, '', `${pathname}${search}`)
}

// The API base of this tab: /api/v1 normally, /api/as/<sessionKey>/v1 in a "log in as" tab
export const apiBaseUrl = () => {
  const sessionKey = readSessionKey()
  return sessionKey ? env.apiBaseUrl.replace(/\/api(?=\/)/, `/api/as/${sessionKey}`) : env.apiBaseUrl
}
