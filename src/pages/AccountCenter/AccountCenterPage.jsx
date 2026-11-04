import { Suspense } from 'react'
import { Card, Nav } from 'react-bootstrap'
import { Link, Navigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import Loader from '@/components/common/Loader'
import useAuth from '@/hooks/useAuth'
import { isPathActive } from '@/utils/navigation'
import { ACCOUNT_CENTER_TABS } from '@/constants/accountCenter'

const isTabActive = (tab, pathname) => (tab.subTabs ?? [tab]).some((screen) => isPathActive(screen.path, pathname))

// System › Account Center: Customer, Licence Key, Clientele and Machine Catalog on one page as tabs
// (ACCOUNT_CENTER_TABS, only the ones the role may open). The tab is the route; `children` is that
// tab's screen, which keeps its own data, filters, modals and access rules. Without `children`
// (`/account-center`) it opens the first tab the user may see.
function AccountCenterPage({ children }) {
  const { pathname } = useLocation()
  const { hasRole } = useAuth()
  const tabs = ACCOUNT_CENTER_TABS.filter((tab) => hasRole(tab.roles))

  if (!children) return <Navigate to={tabs[0].path} replace />

  const subTabs = tabs.find((tab) => isTabActive(tab, pathname))?.subTabs

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">System · Account Center</div>
          <h1>Account Center</h1>
          <p className="ts-page-subtitle">Customers, licence keys, clientele and the machine catalog.</p>
        </div>
      </header>

      <Nav variant="tabs" className="mb-4" as="nav" aria-label="Account center">
        {tabs.map((tab) => (
          <Nav.Item key={tab.key}>
            <Nav.Link as={Link} to={tab.path} active={isTabActive(tab, pathname)}>
              <i className={`bi ${tab.icon} me-2`} aria-hidden="true" />
              {tab.label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {subTabs && (
        <Nav variant="pills" className="mb-4" as="nav" aria-label="Machine catalog">
          {subTabs.map((screen) => (
            <Nav.Item key={screen.key}>
              <Nav.Link as={Link} to={screen.path} active={isPathActive(screen.path, pathname)}>
                {screen.label}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      )}

      {/* The tab's screen loads lazily: keep the header and tabs while it does */}
      <Suspense
        fallback={
          <Card>
            <Card.Body>
              <Loader />
            </Card.Body>
          </Card>
        }
      >
        {children}
      </Suspense>
    </>
  )
}

AccountCenterPage.propTypes = {
  children: PropTypes.node,
}

export default AccountCenterPage
