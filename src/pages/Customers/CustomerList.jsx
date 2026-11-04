import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { Link, generatePath, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
import { PAGE_SIZES, ROLE_LABELS, SUPERADMIN_ONLY, USER_STATUS } from '@/constants/app'
import { deleteUser, getUserById, getUsers, updateUser } from '@/services/customerService'
import { loginAs } from '@/services/authService'
import { loginAsUrl } from '@/utils/loginAs'
import { toast } from '@/utils/toast'
import { ACCOUNT_KIND, ACCOUNT_PAGES, isAccountOfKind } from './accountPages'
import CustomerRow from './CustomerRow'
import { toFormValues, toUserPayload } from './customerForm'
import { customerMobile, customerName } from './customerFormat'
import useTableSort from '@/hooks/useTableSort'
import useAuth from '@/hooks/useAuth'
import useOrgUser from '@/hooks/useOrgUser'
import SortableHead from '@/components/common/SortableHead'
import { newestFirst } from '@/utils/helpers'

const matchesSearch = (customer, term) =>
  [customer.id, customer.username, customerName(customer), ROLE_LABELS[customer.role], customer.email, customerMobile(customer)]
    .some((value) => String(value ?? '').toLowerCase().includes(term))

// Account Center › Customer and Masters › Users (kind): the same list, on each kind's accounts
function CustomerList({ kind = ACCOUNT_KIND.CUSTOMER }) {
  const account = ACCOUNT_PAGES[kind]
  const navigate = useNavigate()
  const { hasRole } = useAuth()
  const { customerLabel } = useOrgUser()
  // The superadmin's Users list has every company's members: show whose each one is
  const showCustomer = kind === ACCOUNT_KIND.USER && hasRole(SUPERADMIN_ONLY)

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

  // Load the kind's accounts on open (and on Retry)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getUsers(ACCOUNT_PAGES[kind].listQuery)
      .then((list) => active && setCustomers(list.filter((account) => isAccountOfKind(account, kind))))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey, kind])

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return term ? customers.filter((customer) => matchesSearch(customer, term)) : customers
  }, [customers, search])
  // Latest entry first (a row just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  // Stay on a valid page when the list shrinks (search, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const columns = [
    { label: 'ID', sort: (row) => row.id },
    { label: 'User Name', sort: (row) => row.username },
    { label: kind === ACCOUNT_KIND.USER ? 'Name' : 'Customer Name', sort: (row) => customerName(row) },
    ...(kind === ACCOUNT_KIND.USER ? [{ label: 'Role', sort: (row) => ROLE_LABELS[row.role] ?? row.role }] : []),
    ...(showCustomer ? [{ label: 'Customer', sort: (row) => customerLabel(row.companyId) }] : []),
    { label: 'Email', sort: (row) => row.email },
    { label: 'Mobile Number', sort: (row) => customerMobile(row) },
    { label: 'Status', sort: (row) => row.status },
    'View',
    'Actions',
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

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
  const handleToggleStatus = useCallback(
    async (customer) => {
      const previous = customer.status
      const status = previous === USER_STATUS.INACTIVE ? USER_STATUS.ACTIVE : USER_STATUS.INACTIVE
      setCustomerStatus(customer.id, status)
      setStatusBusy(customer.id, true)
      try {
        const current = await getUserById(customer.id)
        await updateUser(customer.id, { ...toUserPayload(toFormValues(current), current, kind), status })
        toast.success(`${customerName(customer)} is now ${status}.`, { title: 'Status updated' })
      } catch (err) {
        setCustomerStatus(customer.id, previous)
        toast.error(err.message, { title: 'Could not update status' })
      } finally {
        setStatusBusy(customer.id, false)
      }
    },
    [kind],
  )

  // Customers: View logs the superadmin in as the customer in a new tab, which opens on the
  // dashboard with the customer's own session (utils/loginAs.js). The tab is opened before the
  // request, while the click still counts, so the browser does not block it. Users: the detail page.
  const handleView = useCallback(
    (customer) => {
      if (kind === ACCOUNT_KIND.CUSTOMER) {
        const tab = window.open('', '_blank')
        if (!tab) {
          toast.error('Allow pop-ups for this site to open the customer in a new tab.', { title: 'Could not open a tab' })
          return
        }
        loginAs(customer.id)
          .then(({ sessionKey }) => {
            tab.opener = null
            tab.location.replace(loginAsUrl(sessionKey))
          })
          .catch((err) => {
            tab.close()
            toast.error(err.message, { title: 'Could not log in as customer' })
          })
        return
      }
      navigate(generatePath(ACCOUNT_PAGES[kind].routes.view, { id: String(customer.id) }))
    },
    [navigate, kind],
  )

  const handleEdit = useCallback(
    (customer) => navigate(generatePath(ACCOUNT_PAGES[kind].routes.edit, { id: String(customer.id) })),
    [navigate, kind],
  )

  const handleUnavailable = useCallback((feature) => {
    toast.info(`${feature} is not available yet.`, { title: 'Coming soon' })
  }, [])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteUser(pendingDelete.id)
      setCustomers((list) => list.filter((customer) => customer.id !== pendingDelete.id))
      toast.success(`${customerName(pendingDelete)} has been deleted.`, { title: `${account.title} deleted` })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: `Could not delete ${account.noun}` })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text={`Loading ${account.noun}s…`} />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load {account.noun}s.</b> {error}
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
          <i className={`bi ${account.icon} ts-empty-icon`} aria-hidden="true" />
          <p className="mb-2">No {account.noun}s yet.</p>
          <Button as={Link} to={account.routes.add} size="sm">
            Add the first {account.noun}
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
              placeholder={`Search ID, user name, ${kind === ACCOUNT_KIND.USER ? 'name, role' : 'customer'}, email, mobile…`}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label={`Search ${account.noun}s`}
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
        </div>

        {filtered.length ? (
          <div className="ts-table-panel">
            <Table hover responsive className="mb-0">
              <SortableHead columns={columns} sort={sort} onSort={onSort} />
              <tbody>
                {pageRows.map((customer) => (
                  <CustomerRow
                    key={customer.id}
                    kind={kind}
                    customer={customer}
                    customerLabel={showCustomer ? customerLabel(customer.companyId) : undefined}
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
          <div className="ts-empty">
            No {account.noun}s match “{search.trim()}”.
          </div>
        )}
      </>
    )
  }

  const addButton = (
    <Button as={Link} to={account.routes.add}>
      <i className="bi bi-plus-lg me-2" aria-hidden="true" />
      Add New
    </Button>
  )

  return (
    <>
      {account.tabbed ? (
        <div className="ts-tab-header">
          <div>
            <h2 className="ts-section-title">{account.listTitle}</h2>
            <p className="ts-note mb-0">{account.listSubtitle}</p>
          </div>
          <div className="ts-page-actions">{addButton}</div>
        </div>
      ) : (
        <header className="ts-page-header">
          <div>
            <div className="ts-eyebrow">{account.section}</div>
            <h1>{account.listTitle}</h1>
            <p className="ts-page-subtitle">{account.listSubtitle}</p>
          </div>
          <div className="ts-page-actions">{addButton}</div>
        </header>
      )}

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title={`Delete ${account.noun}`}
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

CustomerList.propTypes = {
  kind: PropTypes.oneOf(Object.values(ACCOUNT_KIND)),
}

export default CustomerList
