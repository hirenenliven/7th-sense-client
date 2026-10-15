import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
import { MANAGERS, PAGE_SIZES, SUPERADMIN_ONLY } from '@/constants/app'
import useAuth from '@/hooks/useAuth'
import { deleteClientele, getClienteles } from '@/services/clienteleService'
import { toast } from '@/utils/toast'
import ClienteleFormModal from './ClienteleFormModal'
import ClienteleRow from './ClienteleRow'

const matchesSearch = (clientele, term) =>
  [clientele.id, clientele.clientCode, clientele.name, clientele.email, clientele.contactNumber, clientele.city, clientele.stateName, clientele.countryName, clientele.customerName]
    .some((value) => String(value ?? '').toLowerCase().includes(term))

// Masters › Clientele. The superadmin sees every customer's clienteles (filter by customer);
// everyone else their company's. Managers (superadmin, customer, admin) add (Add Clientele) and edit
// (a row's Edit) in the Clientele modal, and delete.
function ClienteleList() {
  const { hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)
  const canManage = hasRole(MANAGERS)

  const [clienteles, setClienteles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [search, setSearch] = useState('')
  const [customerFilter, setCustomerFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  // Add / Edit modal: `editingId` is the clientele being edited (null = adding)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getClienteles()
      .then((list) => active && setClienteles(list))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  // Customer filter options: the customers that have clienteles
  const customers = useMemo(() => {
    const byId = new Map()
    clienteles.forEach((clientele) => byId.set(clientele.userId, clientele.customerName || `Customer #${clientele.userId}`))
    return [...byId].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name))
  }, [clienteles])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return clienteles.filter(
      (clientele) =>
        (!customerFilter || String(clientele.userId) === customerFilter) && (!term || matchesSearch(clientele, term)),
    )
  }, [clienteles, search, customerFilter])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleAdd = () => {
    setEditingId(null)
    setShowForm(true)
  }

  const handleEdit = useCallback((clientele) => {
    setEditingId(clientele.id)
    setShowForm(true)
  }, [])

  // List rows carry names (customer, state, country) the save response doesn't: reload the list
  const handleSaved = () => {
    setShowForm(false)
    setReloadKey((key) => key + 1)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteClientele(pendingDelete.id)
      setClienteles((list) => list.filter((clientele) => clientele.id !== pendingDelete.id))
      toast.success(`${pendingDelete.name} has been deleted.`, { title: 'Clientele deleted' })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not delete clientele' })
    } finally {
      setDeleting(false)
    }
  }

  const columns = ['ID', 'Client ID', 'Client Name', ...(isSuperadmin ? ['Customer'] : []), 'Contact', 'City', 'Status', ...(canManage ? ['Actions'] : [])]

  const renderBody = () => {
    if (loading) return <Loader text="Loading clienteles…" />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load clienteles.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }

    if (!clienteles.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-person-vcard ts-empty-icon" aria-hidden="true" />
          <p className="mb-2">No clienteles yet.</p>
          {canManage && (
            <Button size="sm" onClick={handleAdd}>
              Add the first clientele
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
              placeholder="Search ID, client ID, name, email, phone, city…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search clienteles"
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
                {pageRows.map((clientele) => (
                  <ClienteleRow
                    key={clientele.id}
                    clientele={clientele}
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
          <div className="ts-empty">No clienteles match these filters.</div>
        )}
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Masters · Clientele</div>
          <h1>Clientele</h1>
          <p className="ts-page-subtitle">
            {isSuperadmin ? 'Every customer’s clients and how to reach them.' : 'Your clients and how to reach them.'}
          </p>
        </div>
        {canManage && (
          <div className="ts-page-actions">
            <Button onClick={handleAdd} disabled={loading || Boolean(error)}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              Add Clientele
            </Button>
          </div>
        )}
      </header>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      {canManage && <ClienteleFormModal show={showForm} clienteleId={editingId} onSaved={handleSaved} onHide={() => setShowForm(false)} />}

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title="Delete clientele"
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        Delete <strong>{pendingDelete?.name}</strong> ({pendingDelete?.clientCode})? A clientele that parts use cannot be deleted.
      </ConfirmModal>
    </>
  )
}

export default ClienteleList
