# 0004. Axios client with the HttpOnly session cookie

- **Date:** 2026-11-03
- **Status:** Accepted (Inferred from existing code)

## Context

Tokens readable by JavaScript can be stolen by XSS.

## Decision

The server sets an HttpOnly `ts_session` cookie at login; `apiClient` (axios, 15 s timeout) sends it automatically. Any 401 fires `onUnauthorized`, which logs the user out in the UI.

## Alternatives considered

- JWT in localStorage with a refresh token
- fetch() without a wrapper

## Consequences

- No token handling in the client; no refresh flow.
- Requires credentials-enabled CORS between client and API.
