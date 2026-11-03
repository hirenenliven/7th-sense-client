import { useEffect, useRef, useState } from 'react'

// Loads data with an async `load()` whenever `key` changes (a string naming what is loaded; null =
// nothing to load). `refreshMs` reloads it on a timer, keeping the shown data until the new arrives.
// const { data, loading, error } = useLoad(() => getOee(filters), JSON.stringify(filters))
export default function useLoad(load, key, { refreshMs } = {}) {
  const [state, setState] = useState({ data: null, loading: key != null, error: '' })
  const loadRef = useRef(load)

  useEffect(() => {
    loadRef.current = load
  })

  useEffect(() => {
    if (key == null) {
      setState({ data: null, loading: false, error: '' })
      return undefined
    }
    let active = true
    const run = (first) => {
      if (first) setState({ data: null, loading: true, error: '' })
      loadRef.current()
        .then((data) => active && setState({ data, loading: false, error: '' }))
        .catch((err) => active && setState((current) => ({ ...current, loading: false, error: err.message })))
    }
    run(true)
    const timer = refreshMs ? setInterval(() => run(false), refreshMs) : undefined
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [key, refreshMs])

  return state
}
