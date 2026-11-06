import { useCallback, useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import { Link, generatePath, useNavigate } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import IconAction from '@/components/common/IconAction'
import { MANAGERS, STORAGE_KEYS, SUPERADMIN_ONLY } from '@/constants/app'
import { ACTION_ICONS } from '@/constants/icons'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'
import { deleteMachine } from '@/services/machineService'
import { toast } from '@/utils/toast'
import MachineBrowser from './MachineBrowser'
import MachineViewToggle from './MachineViewToggle'
import useMachines from './useMachines'
import useMachineView from './useMachineView'

// Operations › All Machines: machine set-up only (live data is under Monitoring). The superadmin sees
// every customer's machines (filter by customer), deletes them and opens a machine's Diagnostics;
// managers (superadmin, customer, admin) add and edit; everyone else only reads the machines the
// server returns for them.
function MachineList() {
  const navigate = useNavigate()
  const { hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)
  const canManage = hasRole(MANAGERS)

  const { machines, setMachines, loading, error, reload } = useMachines()
  const [view, changeView] = useMachineView(STORAGE_KEYS.MACHINE_VIEW)

  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Edit (managers) and Delete (superadmin) for one machine; none for the other roles
  const renderActions = useCallback(
    (machine) => (
      <>
        <IconAction
          icon={ACTION_ICONS.edit}
          label={`Edit ${machine.name}`}
          onClick={() => navigate(generatePath(ROUTES.MACHINE_EDIT, { id: String(machine.id) }))}
        />
        {isSuperadmin && (
          <IconAction
            icon={ACTION_ICONS.diagnostics}
            label={`Check data of ${machine.name}`}
            onClick={() => navigate(generatePath(ROUTES.MACHINE_DIAGNOSTICS, { id: String(machine.id) }))}
          />
        )}
        {isSuperadmin && (
          <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${machine.name}`} onClick={() => setPendingDelete(machine)} />
        )}
      </>
    ),
    [navigate, isSuperadmin],
  )
  const actions = canManage ? renderActions : undefined

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteMachine(pendingDelete.id)
      setMachines((list) => list.filter((machine) => machine.id !== pendingDelete.id))
      toast.success(`${pendingDelete.name} has been deleted.`, { title: 'Machine deleted' })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not delete machine' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Operations · Machines</div>
          <h1>All Machines</h1>
          <p className="ts-page-subtitle">
            {isSuperadmin ? 'Every customer’s machines, their model, controller and line.' : 'Your machines, their model, controller and line.'}
          </p>
        </div>
        <div className="ts-page-actions">
          <MachineViewToggle view={view} onChange={changeView} />
          {canManage && (
            <Button as={Link} to={ROUTES.MACHINE_ADD}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              Add Machine
            </Button>
          )}
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
            rowActions={actions}
            cardActions={actions}
            empty={
              <div className="ts-empty">
                <i className="bi bi-cpu ts-empty-icon" aria-hidden="true" />
                <p className="mb-2">No machines yet.</p>
                {canManage && (
                  <Button as={Link} to={ROUTES.MACHINE_ADD} size="sm">
                    Add the first machine
                  </Button>
                )}
              </div>
            }
          />
        </Card.Body>
      </Card>

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title="Delete machine"
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        Delete <strong>{pendingDelete?.name}</strong>? Its data will no longer be collected or shown.
      </ConfirmModal>
    </>
  )
}

export default MachineList
