import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
import { PAGE_SIZES } from '@/constants/app'
import { deleteController, getBrands, getControllers } from '@/services/catalogService'
import { toast } from '@/utils/toast'
import ControllerFormModal from './ControllerFormModal'
import ControllerRow from './ControllerRow'

const matchesSearch = (controller, term) =>
  [controller.id, controller.name, controller.brandName, controller.description].some((value) =>
    String(value ?? '').toLowerCase().includes(term),
  )

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
const byBrandThenName = (a, b) =>
  (a.brandName ?? '').localeCompare(b.brandName ?? '', undefined, { sensitivity: 'base' }) || byName(a, b)

// Masters › Machine Catalog › Controllers (superadmin): the controllers of each brand with
// search, brand filter, paging, add / edit and delete. Every user sees them in the machine form.
function ControllerList() {
  const [controllers, setControllers] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [search, setSearch] = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  // Form modal: { controller: null } adds, { controller } edits; null = closed
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Load the controllers and the brand options on open (and on Retry)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    Promise.all([getControllers(), getBrands()])
      .then(([list, brandList]) => {
        if (!active) return
        setControllers(list)
        setBrands([...brandList].sort(byName))
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return controllers.filter(
      (controller) =>
        (!brandFilter || String(controller.brandId) === brandFilter) && (!term || matchesSearch(controller, term)),
    )
  }, [controllers, search, brandFilter])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Every controller belongs to a brand
  const canAdd = brands.length > 0
  const openAdd = () => setEditing({ controller: null })

  const handleEdit = useCallback((controller) => setEditing({ controller }), [])

  const handleSaved = (saved) => {
    setControllers((list) => {
      const exists = list.some((controller) => controller.id === saved.id)
      return (exists ? list.map((controller) => (controller.id === saved.id ? saved : controller)) : [...list, saved]).sort(
        byBrandThenName,
      )
    })
    setEditing(null)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteController(pendingDelete.id)
      setControllers((list) => list.filter((controller) => controller.id !== pendingDelete.id))
      toast.success(`${pendingDelete.name} has been deleted.`, { title: 'Controller deleted' })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not delete controller' })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text="Loading controllers…" />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load controllers.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }

    if (!controllers.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-motherboard ts-empty-icon" aria-hidden="true" />
          {canAdd ? (
            <>
              <p className="mb-2">No controllers yet.</p>
              <Button size="sm" onClick={openAdd}>
                Add the first controller
              </Button>
            </>
          ) : (
            <p className="mb-0">Every controller belongs to a brand, and no brands exist yet.</p>
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
              placeholder="Search ID, controller, brand, description…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search controllers"
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
          <Form.Select
            className="w-auto"
            value={brandFilter}
            onChange={(event) => {
              setBrandFilter(event.target.value)
              setPage(1)
            }}
            aria-label="Filter by brand"
          >
            <option value="">All brands</option>
            {brands.map((option) => (
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
                  <th scope="col">Controller</th>
                  <th scope="col">Brand</th>
                  <th scope="col">Updated</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((controller) => (
                  <ControllerRow key={controller.id} controller={controller} onEdit={handleEdit} onDelete={setPendingDelete} />
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
          <div className="ts-empty">No controllers match these filters.</div>
        )}
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Masters · Machine Catalog</div>
          <h1>Controllers</h1>
          <p className="ts-page-subtitle">CNC controllers of each brand, offered in the machine form.</p>
        </div>
        <div className="ts-page-actions">
          <Button onClick={openAdd} disabled={loading || Boolean(error) || !canAdd}>
            <i className="bi bi-plus-lg me-2" aria-hidden="true" />
            Add Controller
          </Button>
        </div>
      </header>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      <ControllerFormModal
        show={Boolean(editing)}
        controller={editing?.controller ?? null}
        brands={brands}
        defaultBrandId={brandFilter}
        onSaved={handleSaved}
        onHide={() => setEditing(null)}
      />

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title="Delete controller"
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        Delete <strong>{pendingDelete?.name}</strong>?
        {' '}A controller that still has models, or that machines use, cannot be deleted.
      </ConfirmModal>
    </>
  )
}

export default ControllerList
