import { useState } from 'react'
import { readStorage, writeStorage } from '@/utils/storage'

export const MACHINE_VIEWS = [
  { key: 'table', label: 'Table view', icon: 'bi-list-ul' },
  { key: 'cards', label: 'Card view', icon: 'bi-grid-3x3-gap' },
]

// Table rows or cards, remembered per browser under `storageKey` (one per page)
export default function useMachineView(storageKey) {
  const [view, setView] = useState(() => readStorage(storageKey, MACHINE_VIEWS[0].key))
  const changeView = (key) => {
    setView(key)
    writeStorage(storageKey, key)
  }
  return [view, changeView]
}
