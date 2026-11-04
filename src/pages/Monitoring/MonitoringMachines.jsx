import { useCallback } from 'react'
import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import IconAction from '@/components/common/IconAction'
import { STORAGE_KEYS, SUPERADMIN_ONLY } from '@/constants/app'
import { ACTION_ICONS } from '@/constants/icons'
import { MONITOR_REFRESH_MS, machineMonitorPath } from '@/constants/monitoring'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'
import MachineBrowser from '@/pages/Machines/MachineBrowser'
import MachineViewToggle from '@/pages/Machines/MachineViewToggle'
import useMachines from '@/pages/Machines/useMachines'
import useMachineView from '@/pages/Machines/useMachineView'
import MonitorMachineCard from './MonitorMachineCard'

// Operations › Monitoring (main screen): every machine the user may see with the mode it is in now
// (reloaded every MONITOR_REFRESH_MS), and only Productivity and Health (each opens that machine's
// tab, MonitoringMachine). Adding, editing and deleting machines stays on All Machines.
const renderCard = (machine, showCustomer) => <MonitorMachineCard machine={machine} showCustomer={showCustomer} />

function MonitoringMachines() {
  const navigate = useNavigate()
  const { hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)

  const { machines, loading, error, reload } = useMachines({ refreshMs: MONITOR_REFRESH_MS })
  const [view, changeView] = useMachineView(STORAGE_KEYS.MONITORING_VIEW)

  const rowActions = useCallback(
    (machine) => (
      <>
        <IconAction
          icon={ACTION_ICONS.productivity}
          label={`${machine.name} productivity`}
          onClick={() => navigate(machineMonitorPath(ROUTES.MACHINE_PRODUCTIVITY, machine))}
        />
        <IconAction
          icon={ACTION_ICONS.health}
          label={`${machine.name} health`}
          onClick={() => navigate(machineMonitorPath(ROUTES.MACHINE_HEALTH, machine))}
        />
      </>
    ),
    [navigate],
  )

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Operations · Monitoring</div>
          <h1>Monitoring</h1>
          <p className="ts-page-subtitle">
            {isSuperadmin ? 'Every customer’s machines.' : 'Your machines.'} Open one to see its productivity or health.
          </p>
        </div>
        <div className="ts-page-actions">
          <MachineViewToggle view={view} onChange={changeView} />
        </div>
      </header>

      <Card>
        <Card.Body>
          <MachineBrowser
            machines={machines}
            loading={loading}
            error={error}
            onRetry={reload}
            view={view}
            rowActions={rowActions}
            renderCard={renderCard}
            showMode
            empty={
              <div className="ts-empty">
                <i className="bi bi-cpu ts-empty-icon" aria-hidden="true" />
                <p className="mb-0">No machines to monitor yet.</p>
              </div>
            }
          />
        </Card.Body>
      </Card>
    </>
  )
}

export default MonitoringMachines
