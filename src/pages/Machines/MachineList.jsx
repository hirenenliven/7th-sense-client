import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { Link, generatePath, useNavigate } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
import { MANAGERS, PAGE_SIZES, SUPERADMIN_ONLY } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'
import { deleteMachine, getMachines } from '@/services/machineService'
import { toast } from '@/utils/toast'
import MachineRow from './MachineRow'
import useTableSort from '@/hooks/useTableSort'
import SortableHead from '@/components/common/SortableHead'
import { newestFirst } from '@/utils/helpers'

const matchesSearch = (machine, term) =>
  [machine.id, machine.name, machine.serialNumber, machine.customerName, machine.modelName, machine.brandName, machine.controllerName, machine.lineName]
    .some((value) => String(value ?? '').toLowerCase().includes(term))

// Operations › All Machines. The superadmin sees every customer's machines (filter by customer)
// and deletes them; managers (superadmin, customer, admin) add and edit; everyone else only
// reads the machines the server returns for them.
function MachineList() {
  const navigate = useNavigate()
  const { hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)
  const canManage = hasRole(MANAGERS)

  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [search, setSearch] = useState('')
  const [customerFilter, setCustomerFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Load the machines on open (and on Retry); the server limits non-admins to their own
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getMachines()
      .then((list) => active && setMachines(list))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  // Customer filter options: the customers that have machines
  const customers = useMemo(() => {
    const byId = new Map()
    machines.forEach((machine) => {
      if (machine.userId) byId.set(machine.userId, machine.customerName || `Customer #${machine.userId}`)
    })
    return [...byId].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name))
  }, [machines])

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return machines.filter(
      (machine) =>
        (!customerFilter || String(machine.userId) === customerFilter) && (!term || matchesSearch(machine, term)),
    )
  }, [machines, search, customerFilter])
  // Latest entry first (a row just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const columns = [
    { label: 'ID', sort: (row) => row.id },
    { label: 'Machine', sort: (row) => row.name },
    ...(isSuperadmin ? [{ label: 'Customer', sort: (row) => row.customerName }] : []),
    { label: 'Model', sort: (row) => row.modelName },
    { label: 'Brand / Controller', sort: (row) => [row.brandName, row.controllerName].filter(Boolean).join(' ') },
    { label: 'Line', sort: (row) => row.lineName },
    { label: 'Installed', sort: (row) => row.installationDate },
    { label: 'Connection', sort: (row) => (row.onlineStatus ? 1 : 0) },
    { label: 'Status', sort: (row) => row.status },
    ...(canManage ? ['Actions'] : []),
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleEdit = useCallback(
    (machine) => navigate(generatePath(ROUTES.MACHINE_EDIT, { id: String(machine.id) })),
    [navigate],
  )

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


  const renderBody = () => {
    if (loading) return <Loader text="Loading machines…" />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load machines.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }

    if (!machines.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-cpu ts-empty-icon" aria-hidden="true" />
          <p className="mb-2">No machines yet.</p>
          {canManage && (
            <Button as={Link} to={ROUTES.MACHINE_ADD} size="sm">
              Add the first machine
            </Button>
          )}
        </div>
      )
    }

    return (
      <>
        <div className="ts-toolbar">
          <InputGroup className="flex-grow-1 w-auto">
            <Form.Control
              type="search"
              placeholder="Search ID, machine, serial no., customer, model…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search machines"
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
          {isSuperadmin && (
            <Form.Select
              className="w-auto"
              value={customerFilter}
              onChange={(event) => {
                setCustomerFilter(event.target.value)
                setPage(1)
              }}
              aria-label="Filter by customer"
            >
              <option value="">All customers</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </Form.Select>
          )}
        </div>

        {filtered.length ? (
          <div className="ts-table-panel">
            <Table hover responsive className="mb-0">
              <SortableHead columns={columns} sort={sort} onSort={onSort} />
              <tbody>
                {pageRows.map((machine) => (
                  <MachineRow
                    key={machine.id}
                    machine={machine}
                    showCustomer={isSuperadmin}
                    canEdit={canManage}
                    canDelete={isSuperadmin}
                    onEdit={handleEdit}
                    onDelete={setPendingDelete}
                  />
                ))}
              </tbody>
            </Table>
            <TablePagination
              page={currentPage}
              pageSize={pageSize}
              totalCount={filtered.length}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setPage(1)
              }}
            />
          </div>
        ) : (
          <div className="ts-empty">No machines match these filters.</div>
        )}
      </>
    )
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
        {canManage && (
          <div className="ts-page-actions">
            <Button as={Link} to={ROUTES.MACHINE_ADD}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              Add Machine
            </Button>
          </div>
        )}
      </header>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
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
