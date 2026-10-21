import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import SortableHead from '@/components/common/SortableHead'
import TablePagination from '@/components/common/TablePagination'
import { CUSTOMER_ROLE_ID, PAGE_SIZES, SUPERADMIN_ONLY } from '@/constants/app'
import useAuth from '@/hooks/useAuth'
import useTableSort from '@/hooks/useTableSort'
import { getUsers } from '@/services/customerService'
import { deleteLicenceKey, getLicenceKeys } from '@/services/licenceKeyService'
import { newestFirst } from '@/utils/helpers'
import i18n from '@/i18n'
import { toast } from '@/utils/toast'
import LicenceKeyFormModal from './LicenceKeyFormModal'
import LicenceKeyGenerator from './LicenceKeyGenerator'
import LicenceKeyRow from './LicenceKeyRow'
import { LICENCE_KEY_STATUS } from './licenceKeyForm'
import { Trans, useTranslation } from 'react-i18next'
import { tk } from '@/i18n/tk'

const EXPIRED = 'expired'
const STATUS_FILTERS = [
  { value: '', label: tk('All statuses') },
  { value: LICENCE_KEY_STATUS.ACTIVE, label: tk('Active') },
  { value: LICENCE_KEY_STATUS.INACTIVE, label: tk('Inactive') },
  { value: EXPIRED, label: tk('Expired') },
]

const matchesSearch = (licenceKey, term) =>
  [licenceKey.licenceKey, licenceKey.customerName].some((value) => String(value ?? '').toLowerCase().includes(term))

// Masters › Licence Keys: the Generate Licence Key card (superadmin) above the list of saved keys.
// The superadmin generates keys for a customer, edits (customer, status) and deletes them and sees
// every customer's (filter by customer); a customer and its admins read their company's.
function LicenceKeySetup() {
  const { t } = useTranslation()
  const { hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)

  const [licenceKeys, setLicenceKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [customers, setCustomers] = useState([])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [customerFilter, setCustomerFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getLicenceKeys()
      .then((list) => active && setLicenceKeys(list))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  // Superadmin: customers for the generator, the edit modal and the filter
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

  // Customers that have keys, for the filter
  const filterOptions = useMemo(() => {
    const byId = new Map()
    licenceKeys.forEach((licenceKey) => byId.set(licenceKey.userId, licenceKey.customerName || `Customer #${licenceKey.userId}`))
    return [...byId].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name))
  }, [licenceKeys])

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return licenceKeys.filter(
      (licenceKey) =>
        (!statusFilter || (statusFilter === EXPIRED ? licenceKey.isExpired : licenceKey.status === statusFilter)) &&
        (!customerFilter || String(licenceKey.userId) === customerFilter) &&
        (!term || matchesSearch(licenceKey, term)),
    )
  }, [licenceKeys, search, statusFilter, customerFilter])
  // Latest entry first (keys just saved show on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const firstIndex = (currentPage - 1) * pageSize
  const columns = [
    'Sr. No.',
    ...(isSuperadmin ? [{ label: t('Customer'), sort: (row) => row.customerName }] : []),
    { label: t('Licence Key'), sort: (row) => row.licenceKey },
    { label: t('Duration'), sort: (row) => row.expiresOn ?? '9999' },
    { label: t('Created'), sort: (row) => row.createdAt },
    { label: t('Expires On'), sort: (row) => row.expiresOn ?? '9999' },
    { label: t('Status'), sort: (row) => row.status },
    ...(isSuperadmin ? [t('Actions')] : []),
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice(firstIndex, firstIndex + pageSize)

  const handleCreated = useCallback((saved) => {
    setPage(1) // new rows are on top of page 1
    setLicenceKeys((list) => [...list, ...saved])
  }, [])

  const handleUpdated = useCallback((saved) => {
    setLicenceKeys((list) => list.map((licenceKey) => (licenceKey.id === saved.id ? saved : licenceKey)))
    setEditing(null)
  }, [])

  const handleCopy = useCallback(async (licenceKey) => {
    try {
      await navigator.clipboard.writeText(licenceKey.licenceKey)
      toast.success(t('{{key}} copied to the clipboard.', { key: licenceKey.licenceKey }), { title: t('Copied') })
    } catch {
      toast.error(t('The browser did not allow copying.'), { title: t('Could not copy') })
    }
  }, [t])

  const filterChange = (setter) => (event) => {
    setter(event.target.value)
    setPage(1)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteLicenceKey(pendingDelete.id)
      setLicenceKeys((list) => list.filter((licenceKey) => licenceKey.id !== pendingDelete.id))
      toast.success(t('The licence key has been deleted.'), { title: t('Licence key deleted') })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: t('Could not delete') })
    } finally {
      setDeleting(false)
    }
  }

  const renderList = () => {
    if (loading) return <Loader text={t('Loading licence keys…')} />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>{t('Could not load licence keys.')}</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            {t('Retry')}
          </Button>
        </Alert>
      )
    }

    if (!licenceKeys.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-key ts-empty-icon" aria-hidden="true" />
          <p className="mb-0">{t('No licence keys yet.')}</p>
        </div>
      )
    }

    return (
      <>
        <div className="ts-toolbar">
          <InputGroup className="flex-grow-1 w-auto">
            <Form.Control
              type="search"
              placeholder={isSuperadmin ? t('Search key, customer…') : t('Search key…')}
              value={search}
              onChange={filterChange(setSearch)}
              aria-label={t('Search licence keys')}
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
          <Form.Select className="w-auto" value={statusFilter} onChange={filterChange(setStatusFilter)} aria-label={t('Filter by status')}>
            {STATUS_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)}
              </option>
            ))}
          </Form.Select>
          {isSuperadmin && (
            <Form.Select className="w-auto" value={customerFilter} onChange={filterChange(setCustomerFilter)} aria-label={t('Filter by customer')}>
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
                {pageRows.map((licenceKey, index) => (
                  <LicenceKeyRow
                    key={licenceKey.id}
                    licenceKey={licenceKey}
                    number={firstIndex + index + 1}
                    showCustomer={isSuperadmin}
                    canManage={isSuperadmin}
                    onCopy={handleCopy}
                    onEdit={setEditing}
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
          <div className="ts-empty">{t('Nothing matches these filters.')}</div>
        )}
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">{t('Masters')}</div>
          <h1>{t('Licence Keys')}</h1>
          <p className="ts-page-subtitle">
            {isSuperadmin ? t('Generate licence keys for a customer and manage every customer’s keys.') : t('Your company’s licence keys.')}
          </p>
        </div>
      </header>

      {isSuperadmin && <LicenceKeyGenerator customers={customers} onSaved={handleCreated} />}

      <Card>
        <Card.Body>{renderList()}</Card.Body>
      </Card>

      {isSuperadmin && (
        <LicenceKeyFormModal licenceKey={editing} customers={customers} onSaved={handleUpdated} onHide={() => setEditing(null)} />
      )}

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title={t('Delete licence key')}
        confirmLabel={t('Delete')}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        <Trans
          i18nKey="Delete <b>{{key}}</b>?"
          values={{ key: pendingDelete?.licenceKey }}
          components={{ b: <strong className="font-monospace" /> }}
        />
      </ConfirmModal>
    </>
  )
}

export default LicenceKeySetup
