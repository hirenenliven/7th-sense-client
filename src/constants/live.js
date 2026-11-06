// Live machine data over Socket.IO (ADR 0021, server ADR 0009, ../7th-sense-server/docs/live-socket-events.md).
// A screen asks for exactly the cnc_variables codes it shows and receives only those, only when
// they change. To show another variable the server already reads, add its code here and draw it.

// Codes each screen subscribes to (server names, case-sensitive)
export const LIVE_CODES = {
  VIRTUAL_SCREEN: [
    'SpindleLoad',
    'SpindleRpm',
    'speedOvr',
    'feedRateOvr',
    'actFeedRate',
    'FeedRev',
    'axLoadX',
    'axLoadY',
    'axLoadZ',
    'toolNumber',
    'isEmergency',
    'progName',
    'Alarm',
    'alarmMsg',
  ],
}

// At most one message per screen this often (the server's minimum is 200 ms)
export const LIVE_INTERVAL_MS = {
  VIRTUAL_SCREEN: 200,
}

// Channels besides variables: status (online, mode, program) and event (alarm, E-stop, cycle)
export const LIVE_CHANNELS = { STATUS: 'status', EVENT: 'event' }

// Machine events a screen reloads its REST data on (cycle / job / alarm history are worked out
// by the server, never pushed)
export const LIVE_RELOAD_EVENTS = ['alarm_on', 'alarm_off', 'emergency_on', 'emergency_off', 'cycle_opened', 'cycle_closed']
