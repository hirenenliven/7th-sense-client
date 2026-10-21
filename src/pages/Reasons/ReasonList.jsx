import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Trans, useTranslation } from 'react-i18next'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import SortableHead from '@/components/common/SortableHead'
import TablePagination from '@/components/common/TablePagination'
import { MANAGERS, PAGE_SIZES, SUPERADMIN_ONLY } from '@/constants/app'
import useAuth from '@/hooks/useAuth'
import useTableSort from '@/hooks/useTableSort'
import { newestFirst } from '@/utils/helpers'
import { toast } from '@/utils/toast'
import ReasonFormModal from './ReasonFormModal'
import ReasonRow from './ReasonRow'
import { REASON_PAGES } from './reasonPages'

const matchesSearch = (reason, term) =>
  [reason.id, reason.reasonCode, reason.reason, reason.customerName].some((value) =>
    String(value ?? '').toLowerCase().includes(term),
  )

// Masters › Downtime › Downtime List / Idle List (`kind`). The superadmin sees every customer's
// reasons (filter by customer); everyone else their company's. Managers (superadmin, customer,
// admin) add (Add …) and edit (a row's Edit) in the reason modal, and delete.
function ReasonList({ kind }) {
  const page = REASON_PAGES[kind]
  const text = page.text
  const { t } = useTranslation()
  const { hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)
  const canManage = hasRole(MANAGERS)

  const [reasons, setReasons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [search, setSearch] = useState('')
  const [customerFilter, setCustomerFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [currentPageNo, setPage] = useState(1)

  // Add / Edit modal: `editing` is the row being edited (null = adding)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    page
      .list()
      .then((list) => active && setReasons(list))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [page, reloadKey])

  // Customer filter options: the customers that have reasons
  const customers = useMemo(() => {
    const byId = new Map()
    reasons.forEach((reason) => byId.set(reason.userId, reason.customerName || `Customer #${reason.userId}`))
    return [...byId].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name))
  }, [reasons])

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return reasons.filter(
      (reason) => (!customerFilter || String(reason.userId) === customerFilter) && (!term || matchesSearch(reason, term)),
    )
  }, [reasons, search, customerFilter])
  // Latest entry first (a row just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(currentPageNo, pageCount)
  const columns = [
    { label: t('ID'), sort: (row) => row.id },
    { label: t('Reason Code'), sort: (row) => row.reasonCode },
    { label: t('Reason'), sort: (row) => row.reason },
    ...(isSuperadmin ? [{ label: t('Customer'), sort: (row) => row.customerName }] : []),
    { label: t('Status'), sort: (row) => row.status },
    ...(canManage ? [t('Actions')] : []),
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleAdd = () => {
    setEditing(null)
    setShowForm(true)
  }

  const handleEdit = useCallback((reason) => {
    setEditing(reason)
    setShowForm(true)
  }, [])

  // List rows carry the customer name the save response may not match: reload the list
  const handleSaved = () => {
    if (!editing) setPage(1) // a new row is on top of page 1
    setShowForm(false)
    setReloadKey((key) => key + 1)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await page.remove(pendingDelete.id)
      setReasons((list) => list.filter((reason) => reason.id !== pendingDelete.id))
      toast.success(t('{{name}} has been deleted.', { name: pendingDelete.reason }), { title: t(text.deleted) })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: t(text.deleteFailed) })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text={t(text.loading)} />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>{t(text.loadFailed)}</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            {t('Retry')}
          </Button>
        </Alert>
      )
    }

    if (!reasons.length) {
      return (
        <div className="ts-empty">
          <i className={`bi ${page.icon} ts-empty-icon`} aria-hidden="true" />
          <p className="mb-2">{t(text.empty)}</p>
          {canManage && (
            <Button size="sm" onClick={handleAdd}>
              {t(text.addFirst)}
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
              placeholder={t('Search ID, reason code, reason…')}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label={t(text.search)}
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
                {pageRows.map((reason) => (
                  <ReasonRow
                    key={reason.id}
                    reason={reason}
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
          <div className="ts-empty">{t(text.noMatch)}</div>
        )}
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">{t(text.eyebrow)}</div>
          <h1>{t(text.title)}</h1>
          <p className="ts-page-subtitle">{t(text.subtitle)}</p>
        </div>
        {canManage && (
          <div className="ts-page-actions">
            <Button onClick={handleAdd} disabled={loading || Boolean(error)}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              {t(text.add)}
            </Button>
          </div>
        )}
      </header>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      {canManage && (
        <ReasonFormModal kind={kind} show={showForm} reason={editing} onSaved={handleSaved} onHide={() => setShowForm(false)} />
      )}

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title={t(text.deleteTitle)}
        confirmLabel={t('Delete')}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        {pendingDelete?.reasonCode ? (
          <Trans
            i18nKey="Delete <b>{{name}}</b> ({{code}})?"
            values={{ name: pendingDelete.reason, code: pendingDelete.reasonCode }}
            components={{ b: <strong /> }}
          />
        ) : (
          <Trans i18nKey="Delete <b>{{name}}</b>?" values={{ name: pendingDelete?.reason }} components={{ b: <strong /> }} />
        )}
      </ConfirmModal>
    </>
  )
}

ReasonList.propTypes = {
  kind: PropTypes.oneOf(Object.keys(REASON_PAGES)).isRequired,
}

export default ReasonList
