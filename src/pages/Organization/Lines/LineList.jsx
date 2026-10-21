import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
import { PAGE_SIZES } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { deleteUserLine, getUserLines } from '@/services/userLineService'
import { getUserShops } from '@/services/userShopService'
import useOrgUser from '@/hooks/useOrgUser'
import useTableSort from '@/hooks/useTableSort'
import SortableHead from '@/components/common/SortableHead'
import { toast } from '@/utils/toast'
import LineFormModal from './LineFormModal'
import LineRow from './LineRow'
import { newestFirst } from '@/utils/helpers'
import { Trans, useTranslation } from 'react-i18next'

const matchesSearch = (line, term) =>
  [line.id, line.name, line.shopName].some((value) => String(value ?? '').toLowerCase().includes(term))

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })

// Masters › Lines: the logged-in user's lines with search, shop filter,
// paging, add / edit and delete.
function LineList() {
  const { t } = useTranslation()
  const [lines, setLines] = useState([])
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  // The superadmin lists every customer's rows (Customer column) and picks the customer on the form
  const { userId, canEdit, customerLabel } = useOrgUser()

  const [search, setSearch] = useState('')
  const [shopFilter, setShopFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  // Form modal: { line: null } adds, { line } edits; null = closed
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Load the lines and the shop options on open (and on Retry)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    Promise.all([getUserLines(null, userId), getUserShops(null, userId)])
      .then(([list, shopList]) => {
        if (!active) return
        setLines(list)
        setShops(shopList)
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey, userId])

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return lines.filter(
      (line) => (!shopFilter || String(line.userShopId) === shopFilter) && (!term || matchesSearch(line, term)),
    )
  }, [lines, search, shopFilter])
  // Latest entry first (a row just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const columns = [
    { label: t('ID'), sort: (row) => row.id },
    { label: t('Line'), sort: (row) => row.name },
    { label: t('Shop'), sort: (row) => row.shopName },
    { label: t('Customer'), sort: (row) => customerLabel(row.userId) },
    { label: t('Updated'), sort: (row) => row.updatedAt },
    ...(canEdit ? [t('Actions')] : []),
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Every line belongs to a shop
  const canAdd = shops.length > 0
  const openAdd = () => setEditing({ line: null })

  const handleEdit = useCallback((line) => setEditing({ line }), [])

  const handleSaved = (saved) => {
    if (!lines.some((row) => row.id === saved.id)) setPage(1) // a new row is on top of page 1
    setLines((list) => {
      const exists = list.some((line) => line.id === saved.id)
      return (exists ? list.map((line) => (line.id === saved.id ? saved : line)) : [...list, saved]).sort(byName)
    })
    setEditing(null)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteUserLine(pendingDelete.id, pendingDelete.userId)
      setLines((list) => list.filter((line) => line.id !== pendingDelete.id))
      toast.success(t('{{name}} has been deleted.', { name: pendingDelete.name }), { title: t('Line deleted') })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: t('Could not delete line') })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text={t('Loading lines…')} />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>{t('Could not load lines.')}</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            {t('Retry')}
          </Button>
        </Alert>
      )
    }

    if (!lines.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-distribute-horizontal ts-empty-icon" aria-hidden="true" />
          {canAdd ? (
            <>
              <p className="mb-2">{t('No lines yet.')}</p>
              {canEdit && (
                <Button size="sm" onClick={openAdd}>
                  {t('Add the first line')}
                </Button>
              )}
            </>
          ) : (
            <>
              <p className="mb-2">{t('Every line belongs to a shop. Add a shop first.')}</p>
              <Button as={Link} to={ROUTES.ORG_SHOPS} size="sm" variant="ghost">
                {t('Go to Shops')}
              </Button>
            </>
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
              placeholder={t('Search ID, line, shop…')}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label={t('Search lines')}
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
          <Form.Select
            className="w-auto"
            value={shopFilter}
            onChange={(event) => {
              setShopFilter(event.target.value)
              setPage(1)
            }}
            aria-label={t('Filter by shop')}
          >
            <option value="">{t('All shops')}</option>
            {shops.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </Form.Select>
        </div>

        {filtered.length ? (
          <div className="ts-table-panel">
            <Table hover responsive className="mb-0">
              <SortableHead columns={columns} sort={sort} onSort={onSort} />
              <tbody>
                {pageRows.map((line) => (
                  <LineRow
                    key={line.id}
                    line={line}
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
          <div className="ts-empty">{t('No lines match these filters.')}</div>
        )}
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">{t('Masters · Lines')}</div>
          <h1>{t('Lines')}</h1>
          <p className="ts-page-subtitle">{t('Your lines and the shop each belongs to.')}</p>
        </div>
        <div className="ts-page-actions">
          {canEdit && (
            <Button onClick={openAdd} disabled={loading || Boolean(error) || !canAdd}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              {t('Add Line')}
            </Button>
          )}
        </div>
      </header>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      <LineFormModal
        show={Boolean(editing)}
        line={editing?.line ?? null}
        shops={shops}
        defaultShopId={shopFilter}
        onSaved={handleSaved}
        onHide={() => setEditing(null)}
      />

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title={t('Delete line')}
        confirmLabel={t('Delete')}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        <Trans i18nKey="Delete <b>{{name}}</b>?" values={{ name: pendingDelete?.name }} components={{ b: <strong /> }} />
        {' '}A line that still has cells cannot be deleted — delete those first.
      </ConfirmModal>
    </>
  )
}

export default LineList
