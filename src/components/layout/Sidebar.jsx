import SidebarItem from './SidebarItem'
import { NAV_SECTIONS } from '@/constants/navigation'
import useSidebar from '@/hooks/useSidebar'

function Sidebar() {
  const { isOpen, closeOnMobile } = useSidebar()

  return (
    <>
      <aside id="app-sidebar" className="ts-sidebar" inert={!isOpen}>
        <nav aria-label="Main navigation">
          {NAV_SECTIONS.map((section) => (
            <div key={section.key} className="ts-sidenav-section">
              <div className="ts-sidebar-heading">{section.title}</div>
              <ul className="ts-sidenav">
                {section.items.map((item) => (
                  <SidebarItem key={item.key} item={item} onNavigate={closeOnMobile} />
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay backdrop (hidden ≥ lg via CSS) */}
      <div className="ts-sidebar-backdrop" onClick={closeOnMobile} aria-hidden="true" />
    </>
  )
}

export default Sidebar
