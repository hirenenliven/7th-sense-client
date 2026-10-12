import { useSyncExternalStore } from 'react'
import ToastItem from './ToastItem'
import { getToasts, subscribeToasts, toast } from '@/utils/toast'

// Mount once (App.jsx). Renders every toast raised through `toast.*()`.
function Toaster() {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts)

  return (
    <div className="ts-toaster" aria-live="polite" aria-relevant="additions">
      {toasts.map((item) => (
        <ToastItem key={`${item.id}:${item.seq}`} toast={item} onDismiss={toast.dismiss} />
      ))}
    </div>
  )
}

export default Toaster
