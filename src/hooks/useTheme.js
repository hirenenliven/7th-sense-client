import { useSyncExternalStore } from 'react'
import { getTheme, subscribeTheme } from '@/utils/theme'

// The theme on screen (THEME.DARK / THEME.LIGHT); re-renders when it changes
export default function useTheme() {
  return useSyncExternalStore(subscribeTheme, getTheme)
}
