import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
import { CUSTOMER_ROLE_ID, MANAGERS, PAGE_SIZES, ROLES, SUPERADMIN_ONLY } from '@/constants/app'
import useAuth from '@/hooks/useAuth'
import { deleteBreak, getBreaks } from '@/services/breakService'
import { getUsers } from '@/services/customerService'
import i18n from '@/i18n'
import { toast } from '@/utils/toast'
import BreakFormModal from './BreakFormModal'
import BreakRow from './BreakRow'
import { minutesBetween } from '@/utils/dateTime'
import useTableSort from '@/hooks/useTableSort'
import SortableHead from '@/components/common/SortableHead'
import { newestFirst } from '@/utils/helpers'
import { Trans, useTranslation } from 'react-i18next'

const matchesSearch = (shiftBreak, term) =>
  [shiftBreak.id, shiftBreak.name, shiftBreak.shiftName, shiftBreak.customerName, shiftBreak.startTime, shiftBreak.endTime].some((value) =>
    String(value ?? '').toLowerCase().includes(term),
  )

// Shift › Breaks: the break list. A break belongs to a customer and to at most one of its shifts
// (picked here or on Add / Manage Shift). The superadmin works on every customer's breaks (filter by
// customer); everyone else sees their company's. Managers add (Add Break) and edit (a row's Edit)
// in the Break modal, and delete.
function BreakSetup() {
  const { t } = useTranslation()
  const { user, hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)
  const canManage = hasRole(MANAGERS)
  const ownCompanyId = user?.role === ROLES.CUSTOMER ? user.id : user?.companyId

  const [breaks, setBreaks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [customers, setCustomers] = useState([])

  const [search, setSearch] = useState('')
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
    getBreaks()
      .then((list) => active && setBreaks(list))
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
      .catch((err) => active && toast.error(err.message, { title: i18n.t('Could not load customers') }))
    return () => {
      active = false
    }
  }, [isSuperadmin])

  // Customers that have breaks, for the filter
  const filterOptions = useMemo(() => {
    const byId = new Map()
    breaks.forEach((shiftBreak) => byId.set(shiftBreak.userId, shiftBreak.customerName || `Customer #${shiftBreak.userId}`))
    return [...byId].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name))
  }, [breaks])

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return breaks.filter(
      (shiftBreak) =>
        (!customerFilter || String(shiftBreak.userId) === customerFilter) && (!term || matchesSearch(shiftBreak, term)),
    )
  }, [breaks, search, customerFilter])
  // Latest entry first (a row just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const columns = [
    { label: t('ID'), sort: (row) => row.id },
    { label: t('Break Name'), sort: (row) => row.name },
    ...(isSuperadmin ? [{ label: t('Customer Name'), sort: (row) => row.customerName }] : []),
    { label: t('Shift'), sort: (row) => row.shiftName },
    { label: t('Start Time'), sort: (row) => row.startTime },
    { label: t('End Time'), sort: (row) => row.endTime },
    { label: t('Length'), sort: (row) => minutesBetween(row.startTime, row.endTime) },
    { label: t('Status'), sort: (row) => row.status },
    ...(canManage ? [t('Actions')] : []),
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleSaved = useCallback((saved, wasEdit) => {
    if (!wasEdit) setPage(1) // a new row is on top of page 1
    setBreaks((list) => (wasEdit ? list.map((shiftBreak) => (shiftBreak.id === saved.id ? saved : shiftBreak)) : [...list, saved]))
    setShowForm(false)
  }, [])

  const handleAdd = () => {
    setEditing(null)
    setShowForm(true)
  }

  const handleEdit = useCallback((shiftBreak) => {
    setEditing(shiftBreak)
    setShowForm(true)
  }, [])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteBreak(pendingDelete.id)
      setBreaks((list) => list.filter((shiftBreak) => shiftBreak.id !== pendingDelete.id))
      toast.success(t('{{name}} has been deleted.', { name: pendingDelete.name }), { title: t('Break deleted') })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: t('Could not delete break') })
    } finally {
      setDeleting(false)
    }
  }


  const renderList = () => {
    if (loading) return <Loader text={t('Loading breaks…')} />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>{t('Could not load breaks.')}</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            {t('Retry')}
          </Button>
        </Alert>
      )
    }

    if (!breaks.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-cup-hot ts-empty-icon" aria-hidden="true" />
          <p className="mb-0">{t('No breaks yet.')}</p>
        </div>
      )
    }

    return (
      <>
        <div className="ts-toolbar">
          <InputGroup className="flex-grow-1 w-auto">
            <Form.Control
              type="search"
              placeholder={t('Search ID, break, shift, customer, time…')}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label={t('Search breaks')}
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
              aria-label={t('Filter by customer')}
            >
              <option value="">{t('All customers')}</option>
              {filterOptions.map((customer) => (
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
                {pageRows.map((shiftBreak) => (
                  <BreakRow
                    key={shiftBreak.id}
                    shiftBreak={shiftBreak}
                    showCustomer={isSuperadmin}
                    canManage={canManage}
                    isEditing={showForm && editing?.id === shiftBreak.id}
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
          <div className="ts-empty">{t('No breaks match these filters.')}</div>
        )}
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">{t('Masters · Shift')}</div>
          <h1>{t('Breaks')}</h1>
          <p className="ts-page-subtitle">
            {isSuperadmin ? t('Every customer’s breaks and the shift that takes each.') : t('Your breaks and the shift that takes each.')}
          </p>
        </div>
        {canManage && (
          <div className="ts-page-actions">
            <Button onClick={handleAdd} disabled={loading || Boolean(error)}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              {t('Add Break')}
            </Button>
          </div>
        )}
      </header>

      <Card>
        <Card.Body>{renderList()}</Card.Body>
      </Card>

      {canManage && (
        <BreakFormModal
          show={showForm}
          shiftBreak={editing}
          customers={customers}
          canPickCustomer={isSuperadmin}
          ownCompanyId={ownCompanyId}
          onSaved={handleSaved}
          onHide={() => setShowForm(false)}
        />
      )}

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title={t('Delete break')}
        confirmLabel={t('Delete')}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        {pendingDelete?.shiftName ? (
          <Trans
            i18nKey="Delete break <b>{{name}}</b>? Shift {{shift}} will no longer take it."
            values={{ name: pendingDelete.name, shift: pendingDelete.shiftName }}
            components={{ b: <strong /> }}
          />
        ) : (
          <Trans i18nKey="Delete break <b>{{name}}</b>?" values={{ name: pendingDelete?.name }} components={{ b: <strong /> }} />
        )}
      </ConfirmModal>
    </>
  )
}

export default BreakSetup
