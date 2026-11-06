import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import SortableHead from '@/components/common/SortableHead'
import TableNoResults from '@/components/common/TableNoResults'
import TablePagination from '@/components/common/TablePagination'
import { PAGE_SIZES } from '@/constants/app'
import { ORG_LEVEL } from '@/constants/organization'
import useOrgUser from '@/hooks/useOrgUser'
import useTableSort from '@/hooks/useTableSort'
import { newestFirst } from '@/utils/helpers'
import { toast } from '@/utils/toast'
import OrgLevelFormModal from './OrgLevelFormModal'
import OrgLevelRow from './OrgLevelRow'
import { ORG_LEVELS } from './orgLevels'

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })

// Masters › Organization › City, Location, Shop, Line, Cell or Supervisor (`level`, config in
// orgLevels.js): the user's rows with search, a filter by parent, paging, add / edit and delete.
function OrgLevelList({ level: levelKey }) {
  const level = ORG_LEVELS[levelKey]
  const { parent, one, many, title, titlePlural } = level

  const [rows, setRows] = useState([])
  const [parents, setParents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  // The superadmin lists every customer's rows (Customer column) and picks the customer on the form
  const { canEdit, customerLabel } = useOrgUser()

  const [search, setSearch] = useState('')
  const [parentFilter, setParentFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  // Form modal: { row: null } adds, { row } edits; null = closed
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Load the rows and the parent options on open (and on Retry)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    Promise.all([level.list(), level.parent.list()])
      .then(([list, parentList]) => {
        if (!active) return
        setRows(list)
        setParents(parentList)
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey, level])

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return rows.filter(
      (row) =>
        (!parentFilter || String(row[parent.key]) === parentFilter) &&
        (!term || [row.id, row.name, row[parent.nameField]].some((value) => String(value ?? '').toLowerCase().includes(term))),
    )
  }, [rows, search, parentFilter, parent])
  // Latest entry first (a row just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const columns = [
    { label: 'ID', sort: (row) => row.id },
    { label: title, sort: (row) => row.name },
    { label: parent.title, sort: (row) => row[parent.nameField] },
    { label: 'Customer', sort: (row) => customerLabel(row.userId) },
    { label: 'Updated', sort: (row) => row.updatedAt },
    ...(canEdit ? ['Actions'] : []),
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // No results: Clear filters goes back to the whole list
  const clearFilters = () => {
    setSearch('')
    setParentFilter('')
    setPage(1)
  }

  // Every row belongs to a parent
  const canAdd = parents.length > 0
  const openAdd = () => setEditing({ row: null })

  const handleEdit = useCallback((row) => setEditing({ row }), [])

  const handleSaved = (saved) => {
    if (!rows.some((row) => row.id === saved.id)) setPage(1) // a new row is on top of page 1
    setRows((list) => {
      const exists = list.some((row) => row.id === saved.id)
      return (exists ? list.map((row) => (row.id === saved.id ? saved : row)) : [...list, saved]).sort(byName)
    })
    setEditing(null)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await level.remove(pendingDelete.id, pendingDelete.userId)
      setRows((list) => list.filter((row) => row.id !== pendingDelete.id))
      toast.success(`${pendingDelete.name} has been deleted.`, { title: `${title} deleted` })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: `Could not delete ${one}` })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text={`Loading ${many}…`} />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load {many}.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }

    if (!rows.length) {
      return (
        <div className="ts-empty">
          <i className={`bi ${level.icon} ts-empty-icon`} aria-hidden="true" />
          {canAdd ? (
            <>
              <p className="mb-2">No {many} yet.</p>
              {canEdit && (
                <Button size="sm" onClick={openAdd}>
                  Add the first {one}
                </Button>
              )}
            </>
          ) : (
            <>
              <p className="mb-2">
                Every {one} belongs to a {parent.one}. Add a {parent.one} first.
              </p>
              <Button as={Link} to={parent.route} size="sm" variant="ghost">
                Go to {parent.many.charAt(0).toUpperCase() + parent.many.slice(1)}
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
              placeholder={`Search ID, ${one}, ${parent.one}…`}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label={`Search ${many}`}
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
          <Form.Select
            className="w-auto"
            value={parentFilter}
            onChange={(event) => {
              setParentFilter(event.target.value)
              setPage(1)
            }}
            aria-label={`Filter by ${parent.one}`}
          >
            <option value="">All {parent.many}</option>
            {parents.map((option) => (
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
              {pageRows.map((row) => (
                <OrgLevelRow key={row.id} row={row} parentNameField={parent.nameField} onEdit={handleEdit} onDelete={setPendingDelete} />
              ))}
              {!pageRows.length && (
                <TableNoResults colSpan={columns.length} message={`No ${many} match these filters.`} onClear={clearFilters} />
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
          <h2 className="ts-section-title">{titlePlural}</h2>
          <p className="ts-note mb-0">
            Your {many} and the {parent.one} each belongs to.
          </p>
        </div>
        <div className="ts-page-actions">
          {canEdit && (
            <Button onClick={openAdd} disabled={loading || Boolean(error) || !canAdd}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              Add {title}
            </Button>
          )}
        </div>
      </div>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      <OrgLevelFormModal
        level={level}
        show={Boolean(editing)}
        row={editing?.row ?? null}
        parents={parents}
        defaultParentId={parentFilter}
        onSaved={handleSaved}
        onHide={() => setEditing(null)}
      />

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title={`Delete ${one}`}
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        Delete <strong>{pendingDelete?.name}</strong>?{level.deleteNote ? ` ${level.deleteNote}` : ''}
      </ConfirmModal>
    </>
  )
}

OrgLevelList.propTypes = { level: PropTypes.oneOf(Object.values(ORG_LEVEL)).isRequired }

export default OrgLevelList
