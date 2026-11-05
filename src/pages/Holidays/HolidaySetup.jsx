import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
import TableNoResults from '@/components/common/TableNoResults'
import { CUSTOMER_ROLE_ID, MANAGERS, PAGE_SIZES, ROLES, SUPERADMIN_ONLY } from '@/constants/app'
import { HOLIDAY_TYPES, WEEKDAYS } from '@/constants/shifts'
import useAuth from '@/hooks/useAuth'
import { getUsers } from '@/services/customerService'
import { deleteHoliday, getHolidays } from '@/services/holidayService'
import { toast } from '@/utils/toast'
import HolidayFormModal from './HolidayFormModal'
import HolidayRow from './HolidayRow'
import useTableSort from '@/hooks/useTableSort'
import SortableHead from '@/components/common/SortableHead'
import { newestFirst } from '@/utils/helpers'

const TYPE_FILTERS = [
  { value: '', label: 'Holidays and week offs' },
  { value: HOLIDAY_TYPES.HOLIDAY, label: 'Holidays' },
  { value: HOLIDAY_TYPES.WEEK_OFF, label: 'Week offs' },
]

const matchesSearch = (holiday, term) =>
  [
    holiday.name,
    holiday.customerName,
    holiday.startDate,
    holiday.endDate,
    WEEKDAYS.find((day) => day.id === holiday.weekDay)?.label,
    holiday.holidayType === HOLIDAY_TYPES.WEEK_OFF ? 'week off' : 'holiday',
  ].some((value) => String(value ?? '').toLowerCase().includes(term))

// Shift › Holiday / Week Off: the list of holidays and week offs. Both belong to a customer. The
// superadmin works on every customer's (filter by customer); everyone else sees their company's.
// Managers add (Add Holiday) and edit (a row's Edit) in the Holiday modal, and delete.
function HolidaySetup() {
  const { user, hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)
  const canManage = hasRole(MANAGERS)
  const ownCompanyId = user?.role === ROLES.CUSTOMER ? user.id : user?.companyId

  const [holidays, setHolidays] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [customers, setCustomers] = useState([])

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [customerFilter, setCustomerFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  // Add / Edit modal: `editing` is the row being edited (null = adding)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getHolidays()
      .then((list) => active && setHolidays(list))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  // Superadmin: customers for the form and the filter
  useEffect(() => {
    if (!isSuperadmin) return undefined
    let active = true
    getUsers()
      .then((users) => active && setCustomers(users.filter((option) => option.roleId === CUSTOMER_ROLE_ID)))
      .catch((err) => active && toast.error(err.message, { title: 'Could not load customers' }))
    return () => {
      active = false
    }
  }, [isSuperadmin])

  // Customers that have holidays, for the filter
  const filterOptions = useMemo(() => {
    const byId = new Map()
    holidays.forEach((holiday) => byId.set(holiday.userId, holiday.customerName || `Customer #${holiday.userId}`))
    return [...byId].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name))
  }, [holidays])

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return holidays.filter(
      (holiday) =>
        (!typeFilter || holiday.holidayType === typeFilter) &&
        (!customerFilter || String(holiday.userId) === customerFilter) &&
        (!term || matchesSearch(holiday, term)),
    )
  }, [holidays, search, typeFilter, customerFilter])
  // Latest entry first (a row just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const firstIndex = (currentPage - 1) * pageSize
  const columns = [
    'Sr. No.',
    { label: 'Type', sort: (row) => row.holidayType },
    ...(isSuperadmin ? [{ label: 'Customer', sort: (row) => row.customerName }] : []),
    { label: 'Name', sort: (row) => row.name },
    { label: 'Start Date', sort: (row) => row.startDate },
    { label: 'End Date', sort: (row) => row.endDate },
    { label: 'Day', sort: (row) => row.weekDay },
    { label: 'Status', sort: (row) => row.status },
    ...(canManage ? ['Actions'] : []),
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice(firstIndex, firstIndex + pageSize)

  // No results: Clear filters goes back to the whole list
  const clearFilters = () => {
    setSearch('')
    setTypeFilter('')
    setCustomerFilter('')
    setPage(1)
  }

  const handleSaved = useCallback((saved, wasEdit) => {
    if (!wasEdit) setPage(1) // a new row is on top of page 1
    setHolidays((list) => (wasEdit ? list.map((holiday) => (holiday.id === saved.id ? saved : holiday)) : [...list, saved]))
    setShowForm(false)
  }, [])

  const handleAdd = () => {
    setEditing(null)
    setShowForm(true)
  }

  const handleEdit = useCallback((holiday) => {
    setEditing(holiday)
    setShowForm(true)
  }, [])

  const filterChange = (setter) => (event) => {
    setter(event.target.value)
    setPage(1)
  }

  const confirmDelete = async () => {
    const isWeekOff = pendingDelete.holidayType === HOLIDAY_TYPES.WEEK_OFF
    setDeleting(true)
    try {
      await deleteHoliday(pendingDelete.id)
      setHolidays((list) => list.filter((holiday) => holiday.id !== pendingDelete.id))
      toast.success(`The ${isWeekOff ? 'week off' : 'holiday'} has been deleted.`, { title: isWeekOff ? 'Week off deleted' : 'Holiday deleted' })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not delete' })
    } finally {
      setDeleting(false)
    }
  }


  const renderList = () => {
    if (loading) return <Loader text="Loading holidays…" />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load holidays.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }

    if (!holidays.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-calendar-event ts-empty-icon" aria-hidden="true" />
          <p className="mb-0">No holidays or week offs yet.</p>
        </div>
      )
    }

    return (
      <>
        <div className="ts-toolbar">
          <InputGroup className="flex-grow-1 w-auto">
            <Form.Control
              type="search"
              placeholder="Search name, customer, day, date…"
              value={search}
              onChange={filterChange(setSearch)}
              aria-label="Search holidays and week offs"
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
          <Form.Select className="w-auto" value={typeFilter} onChange={filterChange(setTypeFilter)} aria-label="Filter by type">
            {TYPE_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
          {isSuperadmin && (
            <Form.Select className="w-auto" value={customerFilter} onChange={filterChange(setCustomerFilter)} aria-label="Filter by customer">
              <option value="">All customers</option>
              {filterOptions.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </Form.Select>
          )}
        </div>

        <div className="ts-table-panel">
          <Table hover responsive className="mb-0">
            <SortableHead columns={columns} sort={sort} onSort={onSort} />
            <tbody>
              {pageRows.map((holiday, index) => (
                <HolidayRow
                  key={holiday.id}
                  holiday={holiday}
                  number={firstIndex + index + 1}
                  showCustomer={isSuperadmin}
                  canManage={canManage}
                  isEditing={showForm && editing?.id === holiday.id}
                  onEdit={handleEdit}
                  onDelete={setPendingDelete}
                />
              ))}
              {!pageRows.length && (
                <TableNoResults colSpan={columns.length} message="Nothing matches these filters." onClear={clearFilters} />
              )}
            </tbody>
          </Table>
          {filtered.length > 0 && (
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
          )}
        </div>
      </>
    )
  }

  const pendingIsWeekOff = pendingDelete?.holidayType === HOLIDAY_TYPES.WEEK_OFF
  const pendingLabel = pendingIsWeekOff
    ? `the ${WEEKDAYS.find((day) => day.id === pendingDelete?.weekDay)?.label ?? ''} week off`
    : pendingDelete?.name

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Masters · Shift</div>
          <h1>Holiday / Week Off</h1>
          <p className="ts-page-subtitle">
            {isSuperadmin ? 'Every customer’s holidays and weekly days off.' : 'Your holidays and weekly days off.'}
          </p>
        </div>
        {canManage && (
          <div className="ts-page-actions">
            <Button onClick={handleAdd} disabled={loading || Boolean(error)}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              Add Holiday
            </Button>
          </div>
        )}
      </header>

      <Card>
        <Card.Body>{renderList()}</Card.Body>
      </Card>

      {canManage && (
        <HolidayFormModal
          show={showForm}
          holiday={editing}
          customers={customers}
          canPickCustomer={isSuperadmin}
          ownCompanyId={ownCompanyId}
          onSaved={handleSaved}
          onHide={() => setShowForm(false)}
        />
      )}

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title={pendingIsWeekOff ? 'Delete week off' : 'Delete holiday'}
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        Delete <strong>{pendingLabel}</strong>?
      </ConfirmModal>
    </>
  )
}

export default HolidaySetup
