import { io } from 'socket.io-client'
import { notifyUnauthorized } from './apiClient'
import * as authService from './authService'
import { apiBaseUrl } from '@/utils/loginAs'

// Live machine data (ADR 0021, server ADR 0009, ../7th-sense-server/docs/live-socket-events.md).
// One Socket.IO connection per tab, opened on first use under this tab's API base (/api/v1, or
// /api/as/<key>/v1 in a "log in as" tab), so the server knows the user from the session cookie.
// Components say what they need of a machine with watchMachine(); the needs of all components
// are merged per machine (union of codes, smallest interval) into one subscription per machine,
// sent again whenever the union changes and after every reconnect. Screens read the machine's
// state with getMachineState() / subscribeMachineState() (hooks/useMachineLive.js). The socket is
// closed when no machine is watched any more, so an idle tab holds none of the user's sockets.

// After a failed or server-closed connection the session is checked through the REST API at most
// this often: a 401 there sends the user to the login screen like any other 401.
const SESSION_CHECK_MS = 30_000

// The state of a machine nobody has data for yet
const EMPTY_STATE = Object.freeze({ values: Object.freeze({}), at: null, status: null, denied: false })

let socket = null
let connected = false
let sessionCheckedAt = 0
const connectionListeners = new Set()
const pendingSyncs = new Set()

// machineId → { needs: Map(token → need), state, snapshotSeq, subscribedKey, early, listeners, eventListeners }
const machines = new Map()

const machineEntry = (machineId) => {
  if (!machines.has(machineId)) {
    machines.set(machineId, {
      needs: new Map(),
      state: EMPTY_STATE,
      snapshotSeq: 0,
      subscribedKey: '',
      early: null,
      listeners: new Set(),
      eventListeners: new Set(),
    })
  }
  return machines.get(machineId)
}

const setMachineState = (entry, state) => {
  entry.state = state
  entry.listeners.forEach((listener) => listener())
}

const setConnected = (value) => {
  if (connected === value) return
  connected = value
  connectionListeners.forEach((listener) => listener())
}

// Asks the server whether the session still exists; a 401 logs the tab out (apiClient)
const checkSession = (force = false) => {
  if (!force && Date.now() - sessionCheckedAt < SESSION_CHECK_MS) return
  sessionCheckedAt = Date.now()
  authService.getSession().catch(() => {})
}

const statusOf = ({ online, modeId, modeSince, programName }) => ({ online, modeId, modeSince, programName })

// Messages with a seq not above the machine's snapshot are older than it
const isFresh = (message) => {
  const entry = machines.get(message?.machineId)
  return entry && message.seq > entry.snapshotSeq ? entry : null
}

const applyValues = (state, message) => ({ ...state, values: { ...state.values, ...message.values }, at: message.at })
const applyStatus = (state, message) => ({ ...state, status: statusOf(message) })

// A message can overtake the subscribe answer: it is kept until then, because the answer's
// snapshot replaces the state and later messages carry only what changed again
const receive = (message, apply) => {
  const entry = isFresh(message)
  if (!entry) return
  entry.early?.push({ message, apply })
  setMachineState(entry, apply(entry.state, message))
}

const onValues = (message) => receive(message, applyValues)
const onStatus = (message) => receive(message, applyStatus)

const onEvent = (message) => {
  const entry = isFresh(message)
  if (entry) entry.eventListeners.forEach((listener) => listener(message))
}

// The user's machines changed: removed ones show "no access", added ones are subscribed again
const onAccessChanged = ({ removed = [], added = [] }) => {
  removed.forEach((machineId) => {
    const entry = machines.get(machineId)
    if (!entry) return
    entry.subscribedKey = ''
    setMachineState(entry, { ...EMPTY_STATE, denied: true })
  })
  added.forEach((machineId) => {
    if (machines.get(machineId)?.state.denied) scheduleSync(machineId, true)
  })
}

const getSocket = () => {
  if (socket) return socket
  const base = new URL(apiBaseUrl(), window.location.origin)
  socket = io(base.origin, {
    path: `${base.pathname.replace(/\/$/, '')}/socket.io`,
    transports: ['websocket'],
  })
  socket.on('connect', () => {
    setConnected(true)
    machines.forEach((_, machineId) => scheduleSync(machineId, true))
  })
  socket.on('disconnect', (reason) => {
    setConnected(false)
    // The server closed it (logout elsewhere in this session, too many tabs): no auto-reconnect,
    // so drop it and the next watchMachine opens a new one
    if (reason === 'io server disconnect') {
      checkSession(true)
      disconnectLive()
    }
  })
  // A refused handshake looks like a network error with WebSocket only (401 is not readable)
  socket.on('connect_error', () => {
    setConnected(false)
    checkSession()
  })
  socket.on('machine:values', onValues)
  socket.on('machine:status', onStatus)
  socket.on('machine:event', onEvent)
  socket.on('access:changed', onAccessChanged)
  socket.on('session:expired', () => notifyUnauthorized())
  return socket
}

// The machine's subscription: every component's codes and channels, the smallest interval
const mergedRequest = (machineId, entry) => {
  const codes = new Set()
  const channels = new Set()
  let intervalMs = 0
  entry.needs.forEach((need) => {
    need.codes.forEach((code) => codes.add(code))
    need.channels.forEach((channel) => channels.add(channel))
    if (need.intervalMs && (!intervalMs || need.intervalMs < intervalMs)) intervalMs = need.intervalMs
  })
  return { machineIds: [machineId], codes: [...codes].sort(), channels: [...channels].sort(), intervalMs }
}

const applyAnswer = (machineId, key, answer) => {
  const entry = machines.get(machineId)
  if (!entry || entry.subscribedKey !== key) return
  const early = entry.early ?? []
  entry.early = null
  if (!answer?.ok) return
  const snapshot = answer.snapshots?.find((item) => item.machineId === machineId)
  entry.snapshotSeq = snapshot?.seq ?? 0
  const state = {
    values: snapshot?.values ?? {},
    at: snapshot?.at ?? null,
    status: snapshot && 'online' in snapshot ? statusOf(snapshot) : entry.state.status,
    denied: answer.denied?.includes(machineId) ?? false,
  }
  const newer = early.filter(({ message }) => message.seq > entry.snapshotSeq)
  setMachineState(entry, newer.reduce((current, { message, apply }) => apply(current, message), state))
}

const syncMachine = (machineId) => {
  const entry = machines.get(machineId)
  if (!entry) return
  if (!entry.needs.size) {
    if (entry.subscribedKey && socket?.connected) socket.emit('unsubscribe', { machineIds: [machineId] })
    entry.subscribedKey = ''
    if (!entry.listeners.size && !entry.eventListeners.size) {
      machines.delete(machineId)
      if (!machines.size) disconnectLive()
    }
    return
  }
  const request = mergedRequest(machineId, entry)
  const key = JSON.stringify(request)
  if (key === entry.subscribedKey || !socket?.connected) return
  entry.subscribedKey = key
  entry.early = []
  socket.emit('subscribe', request, (answer) => applyAnswer(machineId, key, answer))
}

// Components mounting together are merged into one subscription per machine
function scheduleSync(machineId, force = false) {
  if (force) {
    const entry = machines.get(machineId)
    if (entry) entry.subscribedKey = ''
  }
  if (!pendingSyncs.size) {
    queueMicrotask(() => {
      const machineIds = [...pendingSyncs]
      pendingSyncs.clear()
      machineIds.forEach(syncMachine)
    })
  }
  pendingSyncs.add(machineId)
}

// Start receiving `codes` (+ `channels`: 'status' / 'event') of a machine at most every
// `intervalMs`; returns the function that stops it.
export const watchMachine = (machineId, { codes = [], channels = [], intervalMs = 0 }) => {
  const token = Symbol('need')
  machineEntry(machineId).needs.set(token, { codes, channels, intervalMs })
  getSocket()
  scheduleSync(machineId)
  return () => {
    machines.get(machineId)?.needs.delete(token)
    scheduleSync(machineId)
  }
}

// { values: { code: value }, at, status: { online, modeId, modeSince, programName } | null,
// denied (the user may not read the machine) }
export const getMachineState = (machineId) => machines.get(machineId)?.state ?? EMPTY_STATE

export const subscribeMachineState = (machineId, listener) => {
  const entry = machineEntry(machineId)
  entry.listeners.add(listener)
  return () => {
    entry.listeners.delete(listener)
    scheduleSync(machineId)
  }
}

// listener({ machineId, seq, type, code, message, at }) for alarm / emergency / cycle events
export const onMachineEvent = (machineId, listener) => {
  const entry = machineEntry(machineId)
  entry.eventListeners.add(listener)
  return () => {
    entry.eventListeners.delete(listener)
    scheduleSync(machineId)
  }
}

export const isLiveConnected = () => connected

export const subscribeConnection = (listener) => {
  connectionListeners.add(listener)
  return () => connectionListeners.delete(listener)
}

// Logout / another user / closed by the server / nothing watched: close the socket and forget what
// it received; the next watchMachine opens a new one.
export const disconnectLive = () => {
  if (!socket) return
  socket.removeAllListeners()
  socket.disconnect()
  socket = null
  machines.forEach((entry) => {
    entry.subscribedKey = ''
    entry.snapshotSeq = 0
    entry.early = null
    setMachineState(entry, EMPTY_STATE)
  })
  setConnected(false)
}
