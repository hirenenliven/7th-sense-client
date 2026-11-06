import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import {
  getMachineState,
  isLiveConnected,
  onMachineEvent,
  subscribeConnection,
  subscribeMachineState,
  watchMachine,
} from '@/services/liveSocket'

// Live values of one machine over Socket.IO (services/liveSocket.js): only `codes` (constants/live.js),
// at most every `intervalMs`, plus `channels` ('status', 'event'). `onEvent` gets the machine's
// alarm / emergency / cycle events. Re-renders only when this machine's state changes.
// const { values, status, connected, denied } = useMachineLive(machine.id, { codes, intervalMs, channels })
export default function useMachineLive(machineId, { codes = [], intervalMs = 0, channels = [], onEvent } = {}) {
  const codesKey = codes.join(',')
  const channelsKey = channels.join(',')
  const onEventRef = useRef(onEvent)

  useEffect(() => {
    onEventRef.current = onEvent
  })

  useEffect(() => {
    if (machineId == null) return undefined
    return watchMachine(machineId, {
      codes: codesKey ? codesKey.split(',') : [],
      channels: channelsKey ? channelsKey.split(',') : [],
      intervalMs,
    })
  }, [machineId, codesKey, channelsKey, intervalMs])

  useEffect(() => {
    if (machineId == null) return undefined
    return onMachineEvent(machineId, (event) => onEventRef.current?.(event))
  }, [machineId])

  const subscribe = useCallback(
    (listener) => (machineId == null ? () => {} : subscribeMachineState(machineId, listener)),
    [machineId],
  )
  const state = useSyncExternalStore(subscribe, () => getMachineState(machineId))
  const connected = useSyncExternalStore(subscribeConnection, isLiveConnected)

  return useMemo(() => ({ ...state, connected }), [state, connected])
}
