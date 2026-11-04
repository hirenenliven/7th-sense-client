import { Suspense } from 'react'
import { Card, Nav } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import Loader from '@/components/common/Loader'
import { isPathActive } from '@/utils/navigation'
import { ORGANIZATION_TABS } from '@/constants/organization'

// Masters › Organization: Country … Supervisor on one page as tabs (ORGANIZATION_TABS). The tab is
// the route (`/organization/<level>`, Branch `/masters/branches`); `children` is that tab's list,
// which keeps its own data, filters, add / edit modals and access rules.
function OrganizationPage({ children }) {
  const { pathname } = useLocation()

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Masters · Organization</div>
          <h1>Organization</h1>
          <p className="ts-page-subtitle">Country, state, city, branch, location, shop, line, cell and supervisor.</p>
        </div>
      </header>

      <Nav variant="tabs" className="mb-4" as="nav" aria-label="Organization levels">
        {ORGANIZATION_TABS.map((tab) => (
          <Nav.Item key={tab.key}>
            <Nav.Link as={Link} to={tab.path} active={isPathActive(tab.path, pathname)}>
              <i className={`bi ${tab.icon} me-2`} aria-hidden="true" />
              {tab.label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {/* The tab's list loads lazily: keep the header and tabs while it does */}
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

OrganizationPage.propTypes = {
  children: PropTypes.node.isRequired,
}

export default OrganizationPage
