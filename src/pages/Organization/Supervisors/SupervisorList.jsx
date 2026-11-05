import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
import TableNoResults from '@/components/common/TableNoResults'
import { PAGE_SIZES } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { deleteUserSupervisor, getUserSupervisors } from '@/services/userSupervisorService'
import { getUserCells } from '@/services/userCellService'
import useOrgUser from '@/hooks/useOrgUser'
import useTableSort from '@/hooks/useTableSort'
import SortableHead from '@/components/common/SortableHead'
import { toast } from '@/utils/toast'
import SupervisorFormModal from './SupervisorFormModal'
import SupervisorRow from './SupervisorRow'
import { newestFirst } from '@/utils/helpers'

const matchesSearch = (supervisor, term) =>
  [supervisor.id, supervisor.name, supervisor.cellName].some((value) => String(value ?? '').toLowerCase().includes(term))

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })

// Masters › Supervisors: the logged-in user's supervisors with search, cell filter,
// paging, add / edit and delete.
function SupervisorList() {
  const [supervisors, setSupervisors] = useState([])
  const [cells, setCells] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  // The superadmin lists every customer's rows (Customer column) and picks the customer on the form
  const { userId, canEdit, customerLabel } = useOrgUser()

  const [search, setSearch] = useState('')
  const [cellFilter, setCellFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  // Form modal: { supervisor: null } adds, { supervisor } edits; null = closed
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Load the supervisors and the cell options on open (and on Retry)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    Promise.all([getUserSupervisors(null, userId), getUserCells(null, userId)])
      .then(([list, cellList]) => {
        if (!active) return
        setSupervisors(list)
        setCells(cellList)
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey, userId])

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return supervisors.filter(
      (supervisor) => (!cellFilter || String(supervisor.userCellId) === cellFilter) && (!term || matchesSearch(supervisor, term)),
    )
  }, [supervisors, search, cellFilter])
  // Latest entry first (a row just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const columns = [
    { label: 'ID', sort: (row) => row.id },
    { label: 'Supervisor', sort: (row) => row.name },
    { label: 'Cell', sort: (row) => row.cellName },
    { label: 'Customer', sort: (row) => customerLabel(row.userId) },
    { label: 'Updated', sort: (row) => row.updatedAt },
    ...(canEdit ? ['Actions'] : []),
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // No results: Clear filters goes back to the whole list
  const clearFilters = () => {
    setSearch('')
    setCellFilter('')
    setPage(1)
  }

  // Every supervisor belongs to a cell
  const canAdd = cells.length > 0
  const openAdd = () => setEditing({ supervisor: null })

  const handleEdit = useCallback((supervisor) => setEditing({ supervisor }), [])

  const handleSaved = (saved) => {
    if (!supervisors.some((row) => row.id === saved.id)) setPage(1) // a new row is on top of page 1
    setSupervisors((list) => {
      const exists = list.some((supervisor) => supervisor.id === saved.id)
      return (exists ? list.map((supervisor) => (supervisor.id === saved.id ? saved : supervisor)) : [...list, saved]).sort(byName)
    })
    setEditing(null)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteUserSupervisor(pendingDelete.id, pendingDelete.userId)
      setSupervisors((list) => list.filter((supervisor) => supervisor.id !== pendingDelete.id))
      toast.success(`${pendingDelete.name} has been deleted.`, { title: 'Supervisor deleted' })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not delete supervisor' })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text="Loading supervisors…" />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load supervisors.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }

    if (!supervisors.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-person-badge ts-empty-icon" aria-hidden="true" />
          {canAdd ? (
            <>
              <p className="mb-2">No supervisors yet.</p>
              {canEdit && (
                <Button size="sm" onClick={openAdd}>
                  Add the first supervisor
                </Button>
              )}
            </>
          ) : (
            <>
              <p className="mb-2">Every supervisor belongs to a cell. Add a cell first.</p>
              <Button as={Link} to={ROUTES.ORG_CELLS} size="sm" variant="ghost">
                Go to Cells
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
              placeholder="Search ID, supervisor, cell…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search supervisors"
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
          <Form.Select
            className="w-auto"
            value={cellFilter}
            onChange={(event) => {
              setCellFilter(event.target.value)
              setPage(1)
            }}
            aria-label="Filter by cell"
          >
            <option value="">All cells</option>
            {cells.map((option) => (
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
              {pageRows.map((supervisor) => (
                <SupervisorRow
                  key={supervisor.id}
                  supervisor={supervisor}
                  onEdit={handleEdit}
                  onDelete={setPendingDelete}
                />
              ))}
              {!pageRows.length && (
                <TableNoResults colSpan={columns.length} message="No supervisors match these filters." onClear={clearFilters} />
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
          <h2 className="ts-section-title">Supervisors</h2>
          <p className="ts-note mb-0">Your supervisors and the cell each belongs to.</p>
        </div>
        <div className="ts-page-actions">
          {canEdit && (
            <Button onClick={openAdd} disabled={loading || Boolean(error) || !canAdd}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              Add Supervisor
            </Button>
          )}
        </div>
      </div>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      <SupervisorFormModal
        show={Boolean(editing)}
        supervisor={editing?.supervisor ?? null}
        cells={cells}
        defaultCellId={cellFilter}
        onSaved={handleSaved}
        onHide={() => setEditing(null)}
      />

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title="Delete supervisor"
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        Delete <strong>{pendingDelete?.name}</strong>?
      </ConfirmModal>
    </>
  )
}

export default SupervisorList
