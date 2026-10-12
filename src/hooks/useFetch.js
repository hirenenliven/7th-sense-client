import { useEffect, useState } from 'react'
import apiClient from '@/services/apiClient'

// Simple GET hook: const { data, loading, error } = useFetch('/users')
export default function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    apiClient
      .get(url, { signal: controller.signal })
      .then((res) => setData(res.data))
      .catch((err) => {
        if (err.code !== 'ERR_CANCELED') setError(err.message)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [url])

  return { data, loading, error }
}
