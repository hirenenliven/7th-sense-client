import { lazy, Suspense } from 'react'
import { Alert, Button, Card, Nav } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import Loader from '@/components/common/Loader'
import { SUPERADMIN_ONLY } from '@/constants/app'
import { MONITORING_MACHINE_TABS, machineMonitorPath } from '@/constants/monitoring'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'
import useMachines from '@/pages/Machines/useMachines'
import { isPathActive } from '@/utils/navigation'

// The tab screens load lazily (their charts are large)
const TAB_SCREENS = {
  productivity: lazy(() => import('@/pages/Productivity/Productivity')),
  health: lazy(() => import('@/pages/MachineHealth/MachineHealth')),
  tools: lazy(() => import('@/pages/Productivity/ToolList')),
  'tool-life': lazy(() => import('@/pages/Productivity/ToolLife')),
  'virtual-screen': lazy(() => import('@/pages/Productivity/VirtualScreen')),
}

const loadingCard = (
  <Card>
    <Card.Body>
      <Loader />
    </Card.Body>
  </Card>
)

// Operations › Monitoring › one machine: a back arrow to the machine list, the machine's name, then
// its Productivity, Machine Health, Tool List, Tool Life and Virtual Screen tabs
// (MONITORING_MACHINE_TABS; the tab is the route). The
// machines the user may read are loaded once: the machine shown, and the OEE trend's machine picker
// (`machines`). A machine the user cannot read (or no longer there) shows "Machine not found".
function MonitoringMachine({ machineId }) {
  const { pathname } = useLocation()
  const { hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)
  const { machines, loading, error, reload } = useMachines()

  const machine = machines.find((item) => String(item.id) === machineId)
  const activeTab = MONITORING_MACHINE_TABS.find((tab) => isPathActive(tab.path, pathname)) ?? MONITORING_MACHINE_TABS[0]
  const TabScreen = TAB_SCREENS[activeTab.key]
  const subtitle = machine
    ? [`Machine # ${machine.id}`, machine.modelName, isSuperadmin && machine.customerName].filter(Boolean).join(' · ')
    : 'Productivity, health and tools of one machine.'

  const renderBody = () => {
    if (loading) return <Loader text="Loading machine…" />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load the machine.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={reload}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }

    if (!machine) {
      return (
        <Card>
          <Card.Body className="ts-empty">
            <i className="bi bi-cpu ts-empty-icon" aria-hidden="true" />
            <p className="mb-2">Machine not found. It is not one of your machines, or it was removed.</p>
            <Button as={Link} to={ROUTES.MONITORING} size="sm" variant="ghost">
              Machine list
            </Button>
          </Card.Body>
        </Card>
      )
    }

    return (
      <>
        <Nav variant="tabs" className="mb-4" as="nav" aria-label={`${machine.name} monitoring`}>
          {MONITORING_MACHINE_TABS.map((tab) => (
            <Nav.Item key={tab.key}>
              <Nav.Link as={Link} to={machineMonitorPath(tab.path, machine)} active={tab.key === activeTab.key}>
                <i className={`bi ${tab.icon} me-2`} aria-hidden="true" />
                {tab.label}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        {/* Keep the header and tabs while the tab's screen loads */}
        <Suspense fallback={loadingCard}>
          <TabScreen machine={machine} machines={machines} />
        </Suspense>
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Operations · Monitoring</div>
          <h1>{machine?.name ?? 'Machine'}</h1>
          <p className="ts-page-subtitle">{subtitle}</p>
        </div>
        <div className="ts-page-actions">
          <Button as={Link} to={ROUTES.MONITORING} variant="ghost">
            <i className="bi bi-arrow-left me-2" aria-hidden="true" />
            Machine list
          </Button>
        </div>
      </header>

      {renderBody()}
    </>
  )
}

MonitoringMachine.propTypes = {
  machineId: PropTypes.string.isRequired,
}

export default MonitoringMachine
