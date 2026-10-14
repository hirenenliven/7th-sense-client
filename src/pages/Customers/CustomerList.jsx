import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { Link, generatePath, useNavigate } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
import { PAGE_SIZES, USER_STATUS } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { deleteUser, getUserById, getUsers, updateUser } from '@/services/customerService'
import { toast } from '@/utils/toast'
import CustomerRow from './CustomerRow'
import { toFormValues, toUserPayload } from './customerForm'
import { customerMobile, customerName } from './customerFormat'

const COLUMNS = ['ID', 'User Name', 'Customer Name', 'Email', 'Mobile Number', 'Status', 'Statement', 'View', 'Actions']

const matchesSearch = (customer, term) =>
  [customer.id, customer.username, customerName(customer), customer.email, customerMobile(customer)]
    .some((value) => String(value ?? '').toLowerCase().includes(term))

function CustomerList() {
  const navigate = useNavigate()

  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  const [statusBusyIds, setStatusBusyIds] = useState(() => new Set())
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Load all users on open (and on Retry)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getUsers()
      .then((list) => active && setCustomers(list))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return term ? customers.filter((customer) => matchesSearch(customer, term)) : customers
  }, [customers, search])

  // Stay on a valid page when the list shrinks (search, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const setCustomerStatus = (id, status) =>
    setCustomers((list) => list.map((customer) => (customer.id === id ? { ...customer, status } : customer)))

  const setStatusBusy = (id, busy) =>
    setStatusBusyIds((ids) => {
      const next = new Set(ids)
      if (busy) next.add(id)
      else next.delete(id)
      return next
    })

  // PUT replaces every field, so read the full customer and send it all back with the new status.
  // The switch flips immediately and reverts if the update fails.
  const handleToggleStatus = useCallback(async (customer) => {
    const previous = customer.status
    const status = previous === USER_STATUS.INACTIVE ? USER_STATUS.ACTIVE : USER_STATUS.INACTIVE
    setCustomerStatus(customer.id, status)
    setStatusBusy(customer.id, true)
    try {
      const current = await getUserById(customer.id)
      await updateUser(customer.id, { ...toUserPayload(toFormValues(current), current), status })
      toast.success(`${customerName(customer)} is now ${status}.`, { title: 'Status updated' })
    } catch (err) {
      setCustomerStatus(customer.id, previous)
      toast.error(err.message, { title: 'Could not update status' })
    } finally {
      setStatusBusy(customer.id, false)
    }
  }, [])

  const handleView = useCallback(
    (customer) => navigate(generatePath(ROUTES.CUSTOMER_VIEW, { id: String(customer.id) })),
    [navigate],
  )

  const handleEdit = useCallback(
    (customer) => navigate(generatePath(ROUTES.CUSTOMER_EDIT, { id: String(customer.id) })),
    [navigate],
  )

  const handleUnavailable = useCallback((feature) => {
    toast.info(`${feature} is not available yet.`, { title: 'Coming soon' })
  }, [])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteUser(pendingDelete.id)
      setCustomers((list) => list.filter((customer) => customer.id !== pendingDelete.id))
      toast.success(`${customerName(pendingDelete)} has been deleted.`, { title: 'Customer deleted' })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not delete customer' })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text="Loading customers…" />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load customers.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }

    if (!customers.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-building ts-empty-icon" aria-hidden="true" />
          <p className="mb-2">No customers yet.</p>
          <Button as={Link} to={ROUTES.CUSTOMER_ADD} size="sm">
            Add the first customer
          </Button>
        </div>
      )
    }

    return (
      <>
        <div className="ts-toolbar">
          <InputGroup className="flex-grow-1 w-auto">
            <Form.Control
              type="search"
              placeholder="Search ID, user name, customer, email, mobile…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search customers"
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
        </div>

        {filtered.length ? (
          <div className="ts-table-panel">
            <Table hover responsive className="mb-0">
              <thead>
                <tr>
                  {COLUMNS.map((column) => (
                    <th key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((customer) => (
                  <CustomerRow
                    key={customer.id}
                    customer={customer}
                    statusBusy={statusBusyIds.has(customer.id)}
                    onToggleStatus={handleToggleStatus}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={setPendingDelete}
                    onUnavailable={handleUnavailable}
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
          <div className="ts-empty">No customers match “{search.trim()}”.</div>
        )}
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Masters · Customers</div>
          <h1>Manage Customer</h1>
          <p className="ts-page-subtitle">All customer accounts and their logins.</p>
        </div>
        <div className="ts-page-actions">
          <Button as={Link} to={ROUTES.CUSTOMER_ADD}>
            <i className="bi bi-plus-lg me-2" aria-hidden="true" />
            Add New
          </Button>
        </div>
      </header>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title="Delete customer"
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        Delete <strong>{pendingDelete && customerName(pendingDelete)}</strong>? Their login will stop working.
      </ConfirmModal>
    </>
  )
}

export default CustomerList
