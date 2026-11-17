// Login sessions (server ADR 0014, client ADR 0027). The server answers with fixed message codes;
// the words people see are here.

// Message codes of the API and reasons of the socket's session:expired
export const SESSION_CODES = {
  CONFLICT: 'session_conflict', // 409 at login: the user already has as many sessions as allowed
  REVOKED: 'session_revoked', // 401: another login, the user or the superadmin ended this session
  EXPIRED: 'session_expired', // 401: the session outlived its lifetime
}

// Why a session was revoked (auth_tokens.revoke_reason)
export const REVOKE_REASONS = {
  REPLACED_BY_NEW_LOGIN: 'replaced_by_new_login',
  USER_REVOKED: 'user_revoked',
  ADMIN_REVOKED: 'admin_revoked',
}

// SESSION_MODE of the server
export const SESSION_MODES = {
  SINGLE: 'single',
  MULTIPLE: 'multiple',
}

const REVOKED_MESSAGES = {
  [REVOKE_REASONS.REPLACED_BY_NEW_LOGIN]: 'You were logged out because your account signed in on another device.',
  [REVOKE_REASONS.USER_REVOKED]: 'This session was logged out from another of your sessions.',
  [REVOKE_REASONS.ADMIN_REVOKED]: 'An administrator logged you out of this session.',
}

const EXPIRED_MESSAGE = 'Your session has expired. Please log in again.'
const ENDED_MESSAGE = 'Your session has ended. Please log in again.'

// The toast shown when the session ended: `code` and `reason` come from notifyUnauthorized
export const sessionEndedMessage = ({ code, reason }) => {
  if (code === SESSION_CODES.REVOKED) return REVOKED_MESSAGES[reason] ?? ENDED_MESSAGE
  if (code === SESSION_CODES.EXPIRED) return EXPIRED_MESSAGE
  return ENDED_MESSAGE
}

// true for the 401s that tell why the session ended (shown even when no user was loaded yet,
// e.g. a reload of a tab whose session was revoked meanwhile)
export const isSessionEnded = (code) => code === SESSION_CODES.REVOKED || code === SESSION_CODES.EXPIRED

// "17 Nov 2026, 10:28" in the browser's time zone; '—' when missing
export const formatSessionTime = (value) =>
  value
    ? new Date(value).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'
