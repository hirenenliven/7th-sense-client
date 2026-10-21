import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import SidebarItem from './SidebarItem'
import { NAV_SECTIONS } from '@/constants/navigation'
import useAuth from '@/hooks/useAuth'
import useSidebar from '@/hooks/useSidebar'
import { filterNavByRole } from '@/utils/navigation'

function Sidebar() {
  const { isOpen, closeOnMobile } = useSidebar()
  const { hasRole } = useAuth()
  const { t } = useTranslation()

  // Only the menu items the user's role can open
  const sections = useMemo(() => filterNavByRole(NAV_SECTIONS, hasRole), [hasRole])

  return (
    <>
      <aside id="app-sidebar" className="ts-sidebar" inert={!isOpen}>
        <nav aria-label={t('Main navigation')}>
          {sections.map((section) => (
            <div key={section.key} className="ts-sidenav-section">
              <div className="ts-sidebar-heading">{t(section.title)}</div>
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
