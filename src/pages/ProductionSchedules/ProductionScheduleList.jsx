import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { Link, generatePath, useNavigate } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
import { MANAGERS, PAGE_SIZES, SUPERADMIN_ONLY } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'
import { deleteProductionSchedule, getProductionSchedules } from '@/services/productionScheduleService'
import { toast } from '@/utils/toast'
import useTableSort from '@/hooks/useTableSort'
import SortableHead from '@/components/common/SortableHead'
import { newestFirst } from '@/utils/helpers'
import ScheduleRow from './ScheduleRow'
import { SCHEDULE_TYPES, scheduleDates } from './scheduleForm'

const matchesSearch = (schedule, term) =>
  [schedule.id, schedule.machineName, schedule.customerName, scheduleDates(schedule)].some((value) =>
    String(value ?? '').toLowerCase().includes(term),
  )

// Production › Schedule. The superadmin sees every customer's schedules (filter by customer);
// everyone else their company's. Managers (superadmin, customer, admin) add, edit and delete.
function ProductionScheduleList() {
  const navigate = useNavigate()
  const { hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)
  const canManage = hasRole(MANAGERS)

  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [search, setSearch] = useState('')
  const [customerFilter, setCustomerFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getProductionSchedules()
      .then((list) => active && setSchedules(list))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  // Customer filter options: the customers that have schedules
  const customers = useMemo(() => {
    const byId = new Map()
    schedules.forEach((schedule) => byId.set(schedule.userId, schedule.customerName || `Customer #${schedule.userId}`))
    return [...byId].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name))
  }, [schedules])

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return schedules.filter(
      (schedule) =>
        (!customerFilter || String(schedule.userId) === customerFilter) &&
        (!typeFilter || schedule.scheduleType === typeFilter) &&
        (!term || matchesSearch(schedule, term)),
    )
  }, [schedules, search, customerFilter, typeFilter])
  // Latest entry first (a row just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const columns = [
    { label: 'ID', sort: (row) => row.id },
    { label: 'Schedule Date', sort: (row) => row.startDate },
    { label: 'Type', sort: (row) => row.scheduleType },
    { label: 'Machine', sort: (row) => row.machineName },
    ...(isSuperadmin ? [{ label: 'Customer', sort: (row) => row.customerName }] : []),
    { label: 'Jobs', sort: (row) => row.itemCount },
    { label: 'Total Qty.', sort: (row) => row.totalQuantity },
    { label: 'Status', sort: (row) => row.status },
    { label: 'Created', sort: (row) => row.createdAt },
    ...(canManage ? ['Actions'] : []),
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleEdit = useCallback(
    (schedule) => navigate(generatePath(ROUTES.PRODUCTION_SCHEDULE_EDIT, { id: String(schedule.id) })),
    [navigate],
  )

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteProductionSchedule(pendingDelete.id)
      setSchedules((list) => list.filter((schedule) => schedule.id !== pendingDelete.id))
      toast.success(`The schedule of ${pendingDelete.machineName} has been deleted.`, { title: 'Schedule deleted' })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not delete schedule' })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text="Loading production schedules…" />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load production schedules.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }

    if (!schedules.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-calendar-week ts-empty-icon" aria-hidden="true" />
          <p className="mb-2">No production schedules yet.</p>
          {canManage && (
            <Button as={Link} to={ROUTES.PRODUCTION_SCHEDULE_ADD} size="sm">
              Add the first schedule
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
              placeholder="Search ID, machine, customer, date…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search production schedules"
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
          <Form.Select
            className="w-auto"
            value={typeFilter}
            onChange={(event) => {
              setTypeFilter(event.target.value)
              setPage(1)
            }}
            aria-label="Filter by schedule type"
          >
            <option value="">All types</option>
            {SCHEDULE_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
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
                {pageRows.map((schedule) => (
                  <ScheduleRow
                    key={schedule.id}
                    schedule={schedule}
                    showCustomer={isSuperadmin}
                    canManage={canManage}
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
          <div className="ts-empty">No production schedules match these filters.</div>
        )}
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Production · Schedule</div>
          <h1>Production Schedule</h1>
          <p className="ts-page-subtitle">
            {isSuperadmin ? 'Every customer’s machine schedules and their jobs.' : 'Your machine schedules and their jobs.'}
          </p>
        </div>
        {canManage && (
          <div className="ts-page-actions">
            <Button as={Link} to={ROUTES.PRODUCTION_SCHEDULE_ADD}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              Add Production Schedule
            </Button>
          </div>
        )}
      </header>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title="Delete production schedule"
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        Delete the schedule of <strong>{pendingDelete?.machineName}</strong> on {pendingDelete ? scheduleDates(pendingDelete) : ''} with its{' '}
        {pendingDelete?.itemCount} job(s)?
      </ConfirmModal>
    </>
  )
}

export default ProductionScheduleList
