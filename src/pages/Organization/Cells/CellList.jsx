import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import OrgUserSelect from '@/components/common/OrgUserSelect'
import TablePagination from '@/components/common/TablePagination'
import { PAGE_SIZES } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { deleteUserCell, getUserCells } from '@/services/userCellService'
import { getUserLines } from '@/services/userLineService'
import useOrgUser from '@/hooks/useOrgUser'
import { toast } from '@/utils/toast'
import CellFormModal from './CellFormModal'
import CellRow from './CellRow'

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
  // '' = the logged-in user; an admin can pick another user (OrgUserSelect)
  const { userId } = useOrgUser()

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

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return cells.filter(
      (cell) => (!lineFilter || String(cell.userLineId) === lineFilter) && (!term || matchesSearch(cell, term)),
    )
  }, [cells, search, lineFilter])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Every cell belongs to a line
  const canAdd = lines.length > 0
  const openAdd = () => setEditing({ cell: null })

  const handleEdit = useCallback((cell) => setEditing({ cell }), [])

  const handleSaved = (saved) => {
    setCells((list) => {
      const exists = list.some((cell) => cell.id === saved.id)
      return (exists ? list.map((cell) => (cell.id === saved.id ? saved : cell)) : [...list, saved]).sort(byName)
    })
    setEditing(null)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteUserCell(pendingDelete.id, userId)
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
              <Button size="sm" onClick={openAdd}>
                Add the first cell
              </Button>
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

        {filtered.length ? (
          <div className="ts-table-panel">
            <Table hover responsive className="mb-0">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Cell</th>
                  <th scope="col">Line</th>
                  <th scope="col">Updated</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
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
          <div className="ts-empty">No cells match these filters.</div>
        )}
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Masters · Cells</div>
          <h1>Cells</h1>
          <p className="ts-page-subtitle">Your cells and the line each belongs to.</p>
        </div>
        <div className="ts-page-actions">
          <OrgUserSelect
            disabled={loading}
            onChange={() => {
              setLineFilter('')
              setSearch('')
              setPage(1)
            }}
          />
          <Button onClick={openAdd} disabled={loading || Boolean(error) || !canAdd}>
            <i className="bi bi-plus-lg me-2" aria-hidden="true" />
            Add Cell
          </Button>
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
