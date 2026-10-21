import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
import { PAGE_SIZES } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { deleteUserCell, getUserCells } from '@/services/userCellService'
import { getUserLines } from '@/services/userLineService'
import useOrgUser from '@/hooks/useOrgUser'
import useTableSort from '@/hooks/useTableSort'
import SortableHead from '@/components/common/SortableHead'
import { toast } from '@/utils/toast'
import CellFormModal from './CellFormModal'
import CellRow from './CellRow'
import { newestFirst } from '@/utils/helpers'
import { Trans, useTranslation } from 'react-i18next'

const matchesSearch = (cell, term) =>
  [cell.id, cell.name, cell.lineName].some((value) => String(value ?? '').toLowerCase().includes(term))

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })

// Masters › Cells: the logged-in user's cells with search, line filter,
// paging, add / edit and delete.
function CellList() {
  const { t } = useTranslation()
  const [cells, setCells] = useState([])
  const [lines, setLines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  // The superadmin lists every customer's rows (Customer column) and picks the customer on the form
  const { userId, canEdit, customerLabel } = useOrgUser()

  const [search, setSearch] = useState('')
  const [lineFilter, setLineFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  // Form modal: { cell: null } adds, { cell } edits; null = closed
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Load the cells and the line options on open (and on Retry)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    Promise.all([getUserCells(null, userId), getUserLines(null, userId)])
      .then(([list, lineList]) => {
        if (!active) return
        setCells(list)
        setLines(lineList)
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey, userId])

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return cells.filter(
      (cell) => (!lineFilter || String(cell.userLineId) === lineFilter) && (!term || matchesSearch(cell, term)),
    )
  }, [cells, search, lineFilter])
  // Latest entry first (a row just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const columns = [
    { label: t('ID'), sort: (row) => row.id },
    { label: t('Cell'), sort: (row) => row.name },
    { label: t('Line'), sort: (row) => row.lineName },
    { label: t('Customer'), sort: (row) => customerLabel(row.userId) },
    { label: t('Updated'), sort: (row) => row.updatedAt },
    ...(canEdit ? [t('Actions')] : []),
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Every cell belongs to a line
  const canAdd = lines.length > 0
  const openAdd = () => setEditing({ cell: null })

  const handleEdit = useCallback((cell) => setEditing({ cell }), [])

  const handleSaved = (saved) => {
    if (!cells.some((row) => row.id === saved.id)) setPage(1) // a new row is on top of page 1
    setCells((list) => {
      const exists = list.some((cell) => cell.id === saved.id)
      return (exists ? list.map((cell) => (cell.id === saved.id ? saved : cell)) : [...list, saved]).sort(byName)
    })
    setEditing(null)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteUserCell(pendingDelete.id, pendingDelete.userId)
      setCells((list) => list.filter((cell) => cell.id !== pendingDelete.id))
      toast.success(t('{{name}} has been deleted.', { name: pendingDelete.name }), { title: t('Cell deleted') })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: t('Could not delete cell') })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text={t('Loading cells…')} />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>{t('Could not load cells.')}</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            {t('Retry')}
          </Button>
        </Alert>
      )
    }

    if (!cells.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-grid-3x3-gap ts-empty-icon" aria-hidden="true" />
          {canAdd ? (
            <>
              <p className="mb-2">{t('No cells yet.')}</p>
              {canEdit && (
                <Button size="sm" onClick={openAdd}>
                  {t('Add the first cell')}
                </Button>
              )}
            </>
          ) : (
            <>
              <p className="mb-2">{t('Every cell belongs to a line. Add a line first.')}</p>
              <Button as={Link} to={ROUTES.ORG_LINES} size="sm" variant="ghost">
                {t('Go to Lines')}
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
              placeholder={t('Search ID, cell, line…')}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label={t('Search cells')}
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
          <Form.Select
            className="w-auto"
            value={lineFilter}
            onChange={(event) => {
              setLineFilter(event.target.value)
              setPage(1)
            }}
            aria-label={t('Filter by line')}
          >
            <option value="">{t('All lines')}</option>
            {lines.map((option) => (
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
                {pageRows.map((cell) => (
                  <CellRow
                    key={cell.id}
                    cell={cell}
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
          <div className="ts-empty">{t('No cells match these filters.')}</div>
        )}
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">{t('Masters · Cells')}</div>
          <h1>{t('Cells')}</h1>
          <p className="ts-page-subtitle">{t('Your cells and the line each belongs to.')}</p>
        </div>
        <div className="ts-page-actions">
          {canEdit && (
            <Button onClick={openAdd} disabled={loading || Boolean(error) || !canAdd}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              {t('Add Cell')}
            </Button>
          )}
        </div>
      </header>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      <CellFormModal
        show={Boolean(editing)}
        cell={editing?.cell ?? null}
        lines={lines}
        defaultLineId={lineFilter}
        onSaved={handleSaved}
        onHide={() => setEditing(null)}
      />

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title={t('Delete cell')}
        confirmLabel={t('Delete')}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        <Trans i18nKey="Delete <b>{{name}}</b>?" values={{ name: pendingDelete?.name }} components={{ b: <strong /> }} />
        {' '}A cell that still has supervisors cannot be deleted — delete those first.
      </ConfirmModal>
    </>
  )
}

export default CellList
