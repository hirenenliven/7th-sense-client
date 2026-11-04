import { Suspense } from 'react'
import { Card, Nav } from 'react-bootstrap'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import Loader from '@/components/common/Loader'
import { isPathActive } from '@/utils/navigation'
import { MONITORING_TABS } from '@/constants/monitoring'

// Operations › Monitoring: the machine list, then a machine's Productivity and Machine Health, on
// one page as tabs (MONITORING_TABS). The tab is the route; `children` is that tab's screen, which
// keeps its own machine picker, data and refresh. The Productivity / Health tab links keep
// `?machineId`, so switching between them stays on the same machine.
function MonitoringPage({ children }) {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const machineId = searchParams.get('machineId')
  const search = machineId ? `?${new URLSearchParams({ machineId })}` : ''

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Operations · Monitoring</div>
          <h1>Monitoring</h1>
          <p className="ts-page-subtitle">Pick a machine to see its productivity and health.</p>
        </div>
      </header>

      <Nav variant="tabs" className="mb-4" as="nav" aria-label="Monitoring">
        {MONITORING_TABS.map((tab) => (
          <Nav.Item key={tab.key}>
            <Nav.Link as={Link} to={{ pathname: tab.path, search: tab.withMachine ? search : '' }} active={isPathActive(tab.path, pathname)}>
              <i className={`bi ${tab.icon} me-2`} aria-hidden="true" />
              {tab.label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

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

MonitoringPage.propTypes = {
  children: PropTypes.node.isRequired,
}

export default MonitoringPage
