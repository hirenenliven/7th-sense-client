import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
import { PAGE_SIZES } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { deleteModel, getControllers, getModels } from '@/services/catalogService'
import { toast } from '@/utils/toast'
import ControllerOptions from './ControllerOptions'
import ModelFormModal from './ModelFormModal'
import ModelRow from './ModelRow'
import useTableSort from '@/hooks/useTableSort'
import SortableHead from '@/components/common/SortableHead'
import { newestFirst } from '@/utils/helpers'

const matchesSearch = (model, term) =>
  [model.id, model.name, model.controllerName, model.brandName].some((value) => String(value ?? '').toLowerCase().includes(term))

const compareText = (a, b) => (a ?? '').localeCompare(b ?? '', undefined, { sensitivity: 'base' })
// Same order as the server: brand, controller, name
const byBrandControllerName = (a, b) =>
  compareText(a.brandName, b.brandName) || compareText(a.controllerName, b.controllerName) || compareText(a.name, b.name)

// Account Center › Machine Catalog › Models (superadmin): the machine models of each controller with
// search, controller filter, paging, add / edit and delete. Every user sees them in the machine form.
function ModelList() {
  const [models, setModels] = useState([])
  const [controllers, setControllers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [search, setSearch] = useState('')
  const [controllerFilter, setControllerFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  // Form modal: { model: null } adds, { model } edits; null = closed
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Load the models and the controller options on open (and on Retry)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    Promise.all([getModels(), getControllers()])
      .then(([list, controllerList]) => {
        if (!active) return
        setModels(list)
        setControllers(controllerList)
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return models.filter(
      (model) => (!controllerFilter || String(model.controllerId) === controllerFilter) && (!term || matchesSearch(model, term)),
    )
  }, [models, search, controllerFilter])
  // Latest entry first (a row just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const columns = [
    { label: 'ID', sort: (row) => row.id },
    { label: 'Model', sort: (row) => row.name },
    { label: 'Controller', sort: (row) => row.controllerName },
    { label: 'Brand', sort: (row) => row.brandName },
    { label: 'Updated', sort: (row) => row.updatedAt },
    'Actions',
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Every model belongs to a controller
  const canAdd = controllers.length > 0
  const openAdd = () => setEditing({ model: null })

  const handleEdit = useCallback((model) => setEditing({ model }), [])

  const handleSaved = (saved) => {
    if (!models.some((row) => row.id === saved.id)) setPage(1) // a new row is on top of page 1
    setModels((list) => {
      const exists = list.some((model) => model.id === saved.id)
      return (exists ? list.map((model) => (model.id === saved.id ? saved : model)) : [...list, saved]).sort(byBrandControllerName)
    })
    setEditing(null)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteModel(pendingDelete.id)
      setModels((list) => list.filter((model) => model.id !== pendingDelete.id))
      toast.success(`${pendingDelete.name} has been deleted.`, { title: 'Model deleted' })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not delete model' })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text="Loading models…" />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load models.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }

    if (!models.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-boxes ts-empty-icon" aria-hidden="true" />
          {canAdd ? (
            <>
              <p className="mb-2">No models yet.</p>
              <Button size="sm" onClick={openAdd}>
                Add the first model
              </Button>
            </>
          ) : (
            <>
              <p className="mb-2">Every model belongs to a controller. Add a controller first.</p>
              <Button as={Link} to={ROUTES.CONTROLLERS} size="sm" variant="ghost">
                Go to Controllers
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
              placeholder="Search ID, model, controller, brand…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search models"
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
          <Form.Select
            className="w-auto"
            value={controllerFilter}
            onChange={(event) => {
              setControllerFilter(event.target.value)
              setPage(1)
            }}
            aria-label="Filter by controller"
          >
            <option value="">All controllers</option>
            <ControllerOptions controllers={controllers} />
          </Form.Select>
        </div>

        {filtered.length ? (
          <div className="ts-table-panel">
            <Table hover responsive className="mb-0">
              <SortableHead columns={columns} sort={sort} onSort={onSort} />
              <tbody>
                {pageRows.map((model) => (
                  <ModelRow key={model.id} model={model} onEdit={handleEdit} onDelete={setPendingDelete} />
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
          <div className="ts-empty">No models match these filters.</div>
        )}
      </>
    )
  }

  return (
    <>
      <div className="ts-tab-header">
        <div>
          <h2 className="ts-section-title">Models</h2>
          <p className="ts-note mb-0">Machine models of each controller, offered in the machine form.</p>
        </div>
        <div className="ts-page-actions">
          <Button onClick={openAdd} disabled={loading || Boolean(error) || !canAdd}>
            <i className="bi bi-plus-lg me-2" aria-hidden="true" />
            Add Model
          </Button>
        </div>
      </div>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      <ModelFormModal
        show={Boolean(editing)}
        model={editing?.model ?? null}
        controllers={controllers}
        defaultControllerId={controllerFilter}
        onSaved={handleSaved}
        onHide={() => setEditing(null)}
      />

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title="Delete model"
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        Delete <strong>{pendingDelete?.name}</strong>?
        {' '}A model that machines use cannot be deleted.
      </ConfirmModal>
    </>
  )
}

export default ModelList
