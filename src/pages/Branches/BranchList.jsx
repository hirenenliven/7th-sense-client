import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { Link, generatePath, useNavigate } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
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
import { Trans, useTranslation } from 'react-i18next'

const matchesSearch = (branch, term, customerLabel) =>
  [branch.id, branch.code, branch.name, customerLabel(branch.customerId), branch.email, branch.cityName]
    .some((value) => String(value ?? '').toLowerCase().includes(term))

// Branches are shared by every company: everyone reads them, only the superadmin changes them
function BranchList() {
  const { t } = useTranslation()
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
    { label: t('ID'), sort: (row) => row.id },
    { label: t('Code'), sort: (row) => row.code },
    { label: t('Name'), sort: (row) => row.name },
    { label: t('Customer'), sort: (row) => customerLabel(row.customerId) },
    { label: t('Email'), sort: (row) => row.email },
    { label: t('City'), sort: (row) => row.cityName },
    'Colour',
    { label: t('Status'), sort: (row) => row.status },
    ...(canManage ? [t('Actions')] : []),
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

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
      toast.success(
        status === BRANCH_STATUS.ACTIVE ? t('{{name}} is now active.', { name: branch.name }) : t('{{name}} is now inactive.', { name: branch.name }),
        { title: t('Status updated') },
      )
    } catch (err) {
      setBranchStatus(branch.id, previous)
      toast.error(err.message, { title: t('Could not update status') })
    } finally {
      setStatusBusy(branch.id, false)
    }
  }, [t])

  const handleEdit = useCallback(
    (branch) => navigate(generatePath(ROUTES.BRANCH_EDIT, { id: String(branch.id) })),
    [navigate],
  )

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteBranch(pendingDelete.id)
      setBranches((list) => list.filter((branch) => branch.id !== pendingDelete.id))
      toast.success(t('{{name}} has been deleted.', { name: pendingDelete.name }), { title: t('Branch deleted') })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: t('Could not delete branch') })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text={t('Loading branches…')} />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>{t('Could not load branches.')}</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            {t('Retry')}
          </Button>
        </Alert>
      )
    }

    if (!branches.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-diagram-3 ts-empty-icon" aria-hidden="true" />
          <p className="mb-2">{t('No branches yet.')}</p>
          {canManage && (
            <Button as={Link} to={ROUTES.BRANCH_ADD} size="sm">
              {t('Add the first branch')}
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
              placeholder={t('Search ID, code, name, customer, email, city…')}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label={t('Search branches')}
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
        </div>

        {filtered.length ? (
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
          <div className="ts-empty">{t('No branches match “{{search}}”.', { search: search.trim() })}</div>
        )}
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">{t('Masters · Branches')}</div>
          <h1>{t('Manage Branch')}</h1>
          <p className="ts-page-subtitle">{t('All branches, their tax details and owning customers.')}</p>
        </div>
        {canManage && (
          <div className="ts-page-actions">
            <Button as={Link} to={ROUTES.BRANCH_ADD}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              {t('Add New')}
            </Button>
          </div>
        )}
      </header>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title={t('Delete branch')}
        confirmLabel={t('Delete')}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        <Trans
          i18nKey="Delete <b>{{name}}</b>? Customers assigned to it will need a new branch."
          values={{ name: pendingDelete?.name }}
          components={{ b: <strong /> }}
        />
      </ConfirmModal>
    </>
  )
}

export default BranchList
