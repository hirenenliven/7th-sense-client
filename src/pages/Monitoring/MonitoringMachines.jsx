import { useCallback, useMemo, useState } from 'react'
import { Card } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import IconAction from '@/components/common/IconAction'
import { STORAGE_KEYS, SUPERADMIN_ONLY } from '@/constants/app'
import { ACTION_ICONS } from '@/constants/icons'
import { MONITORING_SEARCH_PARAM, MONITOR_REFRESH_MS, machineMonitorPath } from '@/constants/monitoring'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'
import useLoad from '@/hooks/useLoad'
import MachineBrowser from '@/pages/Machines/MachineBrowser'
import MachineViewToggle from '@/pages/Machines/MachineViewToggle'
import useMachines from '@/pages/Machines/useMachines'
import useMachineView from '@/pages/Machines/useMachineView'
import { getMachineSummaries } from '@/services/productivityService'
import MonitorMachineCard from './MonitorMachineCard'
import MonitorMachineRow from './MonitorMachineRow'
import { monitorColumns } from './monitorTable'

// Operations › Monitoring (main screen): every machine the user may see with the mode it is in now
// and today's OEE and cycles (GET /machines + GET /productivity/machine-summaries, both reloaded
// every MONITOR_REFRESH_MS), and only Productivity and Health (each opens that machine's tab,
// MonitoringMachine). The table is compact (stacked cells) so it fits without sideways scroll.
// Adding, editing and deleting machines stays on All Machines.

function MonitoringMachines() {
  const navigate = useNavigate()
  // `?search=` (a Home fleet tile's mode name) fills the search box once; typing drops it from the URL
  const [searchParams, setSearchParams] = useSearchParams()
  const [initialSearch] = useState(() => searchParams.get(MONITORING_SEARCH_PARAM) ?? '')
  const dropSearchParam = useCallback(() => {
    if (searchParams.has(MONITORING_SEARCH_PARAM)) setSearchParams({}, { replace: true })
  }, [searchParams, setSearchParams])
  const { hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)

  const { machines, loading, error, reload } = useMachines({ refreshMs: MONITOR_REFRESH_MS })
  const [view, changeView] = useMachineView(STORAGE_KEYS.MONITORING_VIEW)
  // A failed load only leaves OEE / cycles as "—"; the machine list still shows
  const summariesState = useLoad(getMachineSummaries, 'machine-summaries', { refreshMs: MONITOR_REFRESH_MS })
  const summaries = useMemo(
    () => new Map((summariesState.data ?? []).map((summary) => [summary.machineId, summary])),
    [summariesState.data],
  )

  const tableColumns = useCallback((showCustomer) => monitorColumns(showCustomer, summaries), [summaries])
  const renderRow = useCallback(
    (machine, showCustomer, actions) => (
      <MonitorMachineRow
        key={machine.id}
        machine={machine}
        showCustomer={showCustomer}
        summary={summaries.get(machine.id)}
        actions={actions}
      />
    ),
    [summaries],
  )
  const renderCard = useCallback(
    (machine, showCustomer) => (
      <MonitorMachineCard machine={machine} showCustomer={showCustomer} summary={summaries.get(machine.id)} />
    ),
    [summaries],
  )

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
            tableColumns={tableColumns}
            renderRow={renderRow}
            showMode
            initialSearch={initialSearch}
            onSearchChange={dropSearchParam}
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
