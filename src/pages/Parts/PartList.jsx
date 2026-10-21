import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { Link, generatePath, useNavigate } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
import { MANAGERS, PAGE_SIZES, SUPERADMIN_ONLY } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'
import { deletePart, getParts } from '@/services/partService'
import { toast } from '@/utils/toast'
import PartRow from './PartRow'
import useTableSort from '@/hooks/useTableSort'
import SortableHead from '@/components/common/SortableHead'
import { newestFirst } from '@/utils/helpers'
import { Trans, useTranslation } from 'react-i18next'

const matchesSearch = (part, term) =>
  [part.id, part.partNo, part.partName, part.clienteleName, part.customerName].some((value) => String(value ?? '').toLowerCase().includes(term))

// Masters › Parts › Part List. The superadmin sees every customer's parts (filter by customer);
// everyone else their company's. Managers (superadmin, customer, admin) add, edit and delete.
function PartList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)
  const canManage = hasRole(MANAGERS)

  const [parts, setParts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [search, setSearch] = useState('')
  const [customerFilter, setCustomerFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getParts()
      .then((list) => active && setParts(list))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  // Customer filter options: the customers that have parts
  const customers = useMemo(() => {
    const byId = new Map()
    parts.forEach((part) => byId.set(part.userId, part.customerName || `Customer #${part.userId}`))
    return [...byId].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name))
  }, [parts])

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return parts.filter(
      (part) => (!customerFilter || String(part.userId) === customerFilter) && (!term || matchesSearch(part, term)),
    )
  }, [parts, search, customerFilter])
  // Latest entry first (a row just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const columns = [
    { label: t('ID'), sort: (row) => row.id },
    { label: t('Part No.'), sort: (row) => row.partNo },
    { label: t('Part Name'), sort: (row) => row.partName },
    ...(isSuperadmin ? [{ label: t('Customer'), sort: (row) => row.customerName }] : []),
    { label: t('Processes'), sort: (row) => row.processCount },
    { label: t('Part Count'), sort: (row) => row.partCount },
    { label: t('Production Time'), sort: (row) => row.productionTime },
    { label: t('Status'), sort: (row) => row.status },
    { label: t('Created'), sort: (row) => row.createdAt },
    ...(canManage ? [t('Actions')] : []),
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleEdit = useCallback((part) => navigate(generatePath(ROUTES.PART_EDIT, { id: String(part.id) })), [navigate])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deletePart(pendingDelete.id)
      setParts((list) => list.filter((part) => part.id !== pendingDelete.id))
      toast.success(t('{{name}} has been deleted.', { name: pendingDelete.partName }), { title: t('Part deleted') })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: t('Could not delete part') })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text={t('Loading parts…')} />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>{t('Could not load parts.')}</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            {t('Retry')}
          </Button>
        </Alert>
      )
    }

    if (!parts.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-rocket-takeoff ts-empty-icon" aria-hidden="true" />
          <p className="mb-2">{t('No parts yet.')}</p>
          {canManage && (
            <Button as={Link} to={ROUTES.PART_ADD} size="sm">
              {t('Add the first part')}
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
              placeholder={t('Search ID, part no., part name, clientele, customer…')}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label={t('Search parts')}
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
                {pageRows.map((part) => (
                  <PartRow
                    key={part.id}
                    part={part}
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
          <div className="ts-empty">{t('No parts match these filters.')}</div>
        )}
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">{t('Masters · Parts')}</div>
          <h1>{t('Part List')}</h1>
          <p className="ts-page-subtitle">
            {isSuperadmin ? t('Every customer’s parts, their processes and production time.') : t('Your parts, their processes and production time.')}
          </p>
        </div>
        {canManage && (
          <div className="ts-page-actions">
            <Button as={Link} to={ROUTES.PART_ADD}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              {t('Add Part')}
            </Button>
          </div>
        )}
      </header>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title={t('Delete part')}
        confirmLabel={t('Delete')}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        <Trans
          i18nKey="Delete <b>{{name}}</b> ({{code}})? It will no longer be offered for production."
          values={{ name: pendingDelete?.partName, code: pendingDelete?.partNo }}
          components={{ b: <strong /> }}
        />
      </ConfirmModal>
    </>
  )
}

export default PartList
