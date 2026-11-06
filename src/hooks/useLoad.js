import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// Loads data with an async `load()` whenever `key` changes (a string naming what is loaded; null =
// nothing to load). `refreshMs` reloads it on a timer, keeping the shown data until the new arrives;
// changing it only restarts the timer. `reload()` does the same once, now (e.g. on a live event).
// const { data, loading, error, reload } = useLoad(() => getOee(filters), JSON.stringify(filters))
export default function useLoad(load, key, { refreshMs } = {}) {
  const [state, setState] = useState({ data: null, loading: key != null, error: '' })
  const loadRef = useRef(load)
  const refreshRef = useRef(() => {})

  useEffect(() => {
    loadRef.current = load
  })

  useEffect(() => {
    if (key == null) {
      setState({ data: null, loading: false, error: '' })
      return undefined
    }
    let active = true
    let sent = 0
    let shown = 0
    const run = (first) => {
      const id = ++sent
      // Reloads can overlap: an answer older than the one on screen is dropped
      const show = (next) => {
        if (!active || id < shown) return
        shown = id
        setState(next)
      }
      if (first) setState({ data: null, loading: true, error: '' })
      loadRef.current()
        .then((data) => show({ data, loading: false, error: '' }))
        .catch((err) => show((current) => ({ ...current, loading: false, error: err.message })))
    }
    refreshRef.current = () => run(false)
    run(true)
    return () => {
      active = false
      refreshRef.current = () => {}
    }
  }, [key])

  useEffect(() => {
    if (key == null || !refreshMs) return undefined
    const timer = setInterval(() => refreshRef.current(), refreshMs)
    return () => clearInterval(timer)
  }, [key, refreshMs])

  const reload = useCallback(() => refreshRef.current(), [])
  return useMemo(() => ({ ...state, reload }), [state, reload])
}
