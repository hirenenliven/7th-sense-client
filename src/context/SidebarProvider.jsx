import { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import SidebarContext from './SidebarContext'
import useMediaQuery from '@/hooks/useMediaQuery'
import { BREAKPOINTS, STORAGE_KEYS } from '@/constants/app'
import { readStorage, writeStorage } from '@/utils/storage'

// Desktop (≥ lg): sidebar pushes content, open/closed is remembered.
// Mobile (< lg):  sidebar overlays content, starts closed, closes after navigation.
function SidebarProvider({ children }) {
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`)
  const [desktopOpen, setDesktopOpen] = useState(() => readStorage(STORAGE_KEYS.SIDEBAR_OPEN, true))
  const [mobileOpen, setMobileOpen] = useState(false)

  const isOpen = isDesktop ? desktopOpen : mobileOpen

  useEffect(() => {
    writeStorage(STORAGE_KEYS.SIDEBAR_OPEN, desktopOpen)
  }, [desktopOpen])

  const toggle = useCallback(() => {
    if (isDesktop) setDesktopOpen((open) => !open)
    else setMobileOpen((open) => !open)
  }, [isDesktop])

  const closeOnMobile = useCallback(() => setMobileOpen(false), [])

  // Escape closes the overlay on mobile
  useEffect(() => {
    if (isDesktop || !mobileOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isDesktop, mobileOpen])

  const value = useMemo(
    () => ({ isOpen, isDesktop, toggle, closeOnMobile }),
    [isOpen, isDesktop, toggle, closeOnMobile],
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

SidebarProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default SidebarProvider
