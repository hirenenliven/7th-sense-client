import { useContext } from 'react'
import SidebarContext from '@/context/SidebarContext'

export default function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) throw new Error('useSidebar must be used inside <SidebarProvider>')
  return context
}
