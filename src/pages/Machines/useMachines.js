import { useCallback, useEffect, useState } from 'react'
import { getMachines } from '@/services/machineService'

// The machines the server returns the user (non-admins: their own), loaded on open and on reload().
// `refreshMs` reloads them on a timer (live mode / connection), keeping the shown list meanwhile.
// `setMachines` lets a page drop a deleted row without loading again.
export default function useMachines({ refreshMs } = {}) {
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getMachines()
      .then((list) => active && setMachines(list))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))

    // A failed background refresh keeps the last list (the next one may succeed)
    const timer = refreshMs
      ? setInterval(() => {
          getMachines()
            .then((list) => active && setMachines(list))
            .catch(() => {})
        }, refreshMs)
      : undefined
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [reloadKey, refreshMs])

  const reload = useCallback(() => setReloadKey((key) => key + 1), [])

  return { machines, setMachines, loading, error, reload }
}
