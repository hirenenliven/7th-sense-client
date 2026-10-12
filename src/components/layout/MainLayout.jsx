import { Outlet } from 'react-router-dom'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import SidebarProvider from '@/context/SidebarProvider'
import useSidebar from '@/hooks/useSidebar'

function AppShell() {
  const { isOpen } = useSidebar()

  return (
    <div className={`ts-shell${isOpen ? ' sidebar-open' : ''}`}>
      <Topbar />
      <Sidebar />
      <main className="ts-content">
        <div className="ts-page">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  )
}

function MainLayout() {
  return (
    <SidebarProvider>
      <AppShell />
    </SidebarProvider>
  )
}

export default MainLayout
