import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
import TableNoResults from '@/components/common/TableNoResults'
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

const matchesSearch = (cell, term) =>
  [cell.id, cell.name, cell.lineName].some((value) => String(value ?? '').toLowerCase().includes(term))

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })

// Masters › Cells: the logged-in user's cells with search, line filter,
// paging, add / edit and delete.
function CellList() {
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
    { label: 'ID', sort: (row) => row.id },
    { label: 'Cell', sort: (row) => row.name },
    { label: 'Line', sort: (row) => row.lineName },
    { label: 'Customer', sort: (row) => customerLabel(row.userId) },
    { label: 'Updated', sort: (row) => row.updatedAt },
    ...(canEdit ? ['Actions'] : []),
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // No results: Clear filters goes back to the whole list
  const clearFilters = () => {
    setSearch('')
    setLineFilter('')
    setPage(1)
  }

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
      toast.success(`${pendingDelete.name} has been deleted.`, { title: 'Cell deleted' })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not delete cell' })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text="Loading cells…" />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load cells.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
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
              <p className="mb-2">No cells yet.</p>
              {canEdit && (
                <Button size="sm" onClick={openAdd}>
                  Add the first cell
                </Button>
              )}
            </>
          ) : (
            <>
              <p className="mb-2">Every cell belongs to a line. Add a line first.</p>
              <Button as={Link} to={ROUTES.ORG_LINES} size="sm" variant="ghost">
                Go to Lines
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
              placeholder="Search ID, cell, line…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search cells"
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
            aria-label="Filter by line"
          >
            <option value="">All lines</option>
            {lines.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </Form.Select>
        </div>

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
              {!pageRows.length && (
                <TableNoResults colSpan={columns.length} message="No cells match these filters." onClear={clearFilters} />
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

  return (
    <>
      <div className="ts-tab-header">
        <div>
          <h2 className="ts-section-title">Cells</h2>
          <p className="ts-note mb-0">Your cells and the line each belongs to.</p>
        </div>
        <div className="ts-page-actions">
          {canEdit && (
            <Button onClick={openAdd} disabled={loading || Boolean(error) || !canAdd}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              Add Cell
            </Button>
          )}
        </div>
      </div>

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
        title="Delete cell"
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        Delete <strong>{pendingDelete?.name}</strong>?
        {' '}A cell that still has supervisors cannot be deleted — delete those first.
      </ConfirmModal>
    </>
  )
}

export default CellList
