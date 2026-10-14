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

const matchesSearch = (part, term) =>
  [part.id, part.partNo, part.partName, part.customerName].some((value) => String(value ?? '').toLowerCase().includes(term))

// Masters › Parts › Part List. The superadmin sees every customer's parts (filter by customer);
// everyone else their company's. Managers (superadmin, customer, admin) add, edit and delete.
function PartList() {
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

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return parts.filter(
      (part) => (!customerFilter || String(part.userId) === customerFilter) && (!term || matchesSearch(part, term)),
    )
  }, [parts, search, customerFilter])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleEdit = useCallback((part) => navigate(generatePath(ROUTES.PART_EDIT, { id: String(part.id) })), [navigate])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deletePart(pendingDelete.id)
      setParts((list) => list.filter((part) => part.id !== pendingDelete.id))
      toast.success(`${pendingDelete.partName} has been deleted.`, { title: 'Part deleted' })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not delete part' })
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    'ID',
    'Part No.',
    'Part Name',
    ...(isSuperadmin ? ['Customer'] : []),
    'Processes',
    'Part Count',
    'Production Time',
    'Status',
    'Created',
    ...(canManage ? ['Actions'] : []),
  ]

  const renderBody = () => {
    if (loading) return <Loader text="Loading parts…" />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load parts.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }

    if (!parts.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-rocket-takeoff ts-empty-icon" aria-hidden="true" />
          <p className="mb-2">No parts yet.</p>
          {canManage && (
            <Button as={Link} to={ROUTES.PART_ADD} size="sm">
              Add the first part
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
              placeholder="Search ID, part no., part name, customer…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search parts"
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
              aria-label="Filter by customer"
            >
              <option value="">All customers</option>
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
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
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
          <div className="ts-empty">No parts match these filters.</div>
        )}
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Masters · Parts</div>
          <h1>Part List</h1>
          <p className="ts-page-subtitle">
            {isSuperadmin ? 'Every customer’s parts, their processes and production time.' : 'Your parts, their processes and production time.'}
          </p>
        </div>
        {canManage && (
          <div className="ts-page-actions">
            <Button as={Link} to={ROUTES.PART_ADD}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              Add Part
            </Button>
          </div>
        )}
      </header>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title="Delete part"
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        Delete <strong>{pendingDelete?.partName}</strong> ({pendingDelete?.partNo})? It will no longer be offered for production.
      </ConfirmModal>
    </>
  )
}

export default PartList
