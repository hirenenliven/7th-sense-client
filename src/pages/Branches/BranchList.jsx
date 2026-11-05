import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { Link, generatePath, useNavigate } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
import TableNoResults from '@/components/common/TableNoResults'
import { BRANCH_STATUS, PAGE_SIZES, SUPERADMIN_ONLY } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'
import useOrgUser from '@/hooks/useOrgUser'
import { deleteBranch, getBranches, updateBranch } from '@/services/branchService'
import { toast } from '@/utils/toast'
import BranchRow from './BranchRow'
import { toBranchPayload, toFormValues } from './branchForm'
import useTableSort from '@/hooks/useTableSort'
import SortableHead from '@/components/common/SortableHead'
import { newestFirst } from '@/utils/helpers'

const matchesSearch = (branch, term, customerLabel) =>
  [branch.id, branch.code, branch.name, customerLabel(branch.customerId), branch.email, branch.cityName]
    .some((value) => String(value ?? '').toLowerCase().includes(term))

// Branches are shared by every company: everyone reads them, only the superadmin changes them
function BranchList() {
  const navigate = useNavigate()
  const { hasRole } = useAuth()
  const canManage = hasRole(SUPERADMIN_ONLY)
  const { customerLabel } = useOrgUser()

  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  const [statusBusyIds, setStatusBusyIds] = useState(() => new Set())
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Load all branches on open (and on Retry)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getBranches()
      .then((list) => active && setBranches(list))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return term ? branches.filter((branch) => matchesSearch(branch, term, customerLabel)) : branches
  }, [branches, search, customerLabel])
  // Latest entry first (a row just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  // Stay on a valid page when the list shrinks (search, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const columns = [
    { label: 'ID', sort: (row) => row.id },
    { label: 'Code', sort: (row) => row.code },
    { label: 'Name', sort: (row) => row.name },
    { label: 'Customer', sort: (row) => customerLabel(row.customerId) },
    { label: 'Email', sort: (row) => row.email },
    { label: 'City', sort: (row) => row.cityName },
    'Colour',
    { label: 'Status', sort: (row) => row.status },
    ...(canManage ? ['Actions'] : []),
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // No results: Clear filters goes back to the whole list
  const clearFilters = () => {
    setSearch('')
    setPage(1)
  }

  const setBranchStatus = (id, status) =>
    setBranches((list) => list.map((branch) => (branch.id === id ? { ...branch, status } : branch)))

  const setStatusBusy = (id, busy) =>
    setStatusBusyIds((ids) => {
      const next = new Set(ids)
      if (busy) next.add(id)
      else next.delete(id)
      return next
    })

  // PUT replaces every field; list rows are full branch records, so send the row back with the new status.
  // The switch flips immediately and reverts if the update fails.
  const handleToggleStatus = useCallback(async (branch) => {
    const previous = branch.status
    const status = previous === BRANCH_STATUS.INACTIVE ? BRANCH_STATUS.ACTIVE : BRANCH_STATUS.INACTIVE
    setBranchStatus(branch.id, status)
    setStatusBusy(branch.id, true)
    try {
      await updateBranch(branch.id, { ...toBranchPayload(toFormValues(branch), branch), status })
      toast.success(`${branch.name} is now ${status}.`, { title: 'Status updated' })
    } catch (err) {
      setBranchStatus(branch.id, previous)
      toast.error(err.message, { title: 'Could not update status' })
    } finally {
      setStatusBusy(branch.id, false)
    }
  }, [])

  const handleEdit = useCallback(
    (branch) => navigate(generatePath(ROUTES.BRANCH_EDIT, { id: String(branch.id) })),
    [navigate],
  )

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteBranch(pendingDelete.id)
      setBranches((list) => list.filter((branch) => branch.id !== pendingDelete.id))
      toast.success(`${pendingDelete.name} has been deleted.`, { title: 'Branch deleted' })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not delete branch' })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text="Loading branches…" />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load branches.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }

    if (!branches.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-diagram-3 ts-empty-icon" aria-hidden="true" />
          <p className="mb-2">No branches yet.</p>
          {canManage && (
            <Button as={Link} to={ROUTES.BRANCH_ADD} size="sm">
              Add the first branch
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
              placeholder="Search ID, code, name, customer, email, city…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search branches"
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
        </div>

        <div className="ts-table-panel">
          <Table hover responsive className="mb-0">
            <SortableHead columns={columns} sort={sort} onSort={onSort} />
            <tbody>
              {pageRows.map((branch) => (
                <BranchRow
                  key={branch.id}
                  branch={branch}
                  canManage={canManage}
                  statusBusy={statusBusyIds.has(branch.id)}
                  onToggleStatus={handleToggleStatus}
                  onEdit={handleEdit}
                  onDelete={setPendingDelete}
                />
              ))}
              {!pageRows.length && (
                <TableNoResults colSpan={columns.length} message={`No branches match “${search.trim()}”.`} onClear={clearFilters} />
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
          <h2 className="ts-section-title">Branches</h2>
          <p className="ts-note mb-0">All branches, their tax details and owning customers.</p>
        </div>
        {canManage && (
          <div className="ts-page-actions">
            <Button as={Link} to={ROUTES.BRANCH_ADD}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              Add New
            </Button>
          </div>
        )}
      </div>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title="Delete branch"
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        Delete <strong>{pendingDelete?.name}</strong>? Customers assigned to it will need a new branch.
      </ConfirmModal>
    </>
  )
}

export default BranchList
