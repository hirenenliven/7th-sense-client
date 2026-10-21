import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
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

// Masters › Machine Catalog › Models (superadmin): the machine models of each controller with
// search, controller filter, paging, add / edit and delete. Every user sees them in the machine form.
function ModelList() {
  const { t } = useTranslation()
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
    { label: t('ID'), sort: (row) => row.id },
    { label: t('Model'), sort: (row) => row.name },
    { label: t('Controller'), sort: (row) => row.controllerName },
    { label: t('Brand'), sort: (row) => row.brandName },
    { label: t('Updated'), sort: (row) => row.updatedAt },
    t('Actions'),
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
      toast.success(t('{{name}} has been deleted.', { name: pendingDelete.name }), { title: t('Model deleted') })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: t('Could not delete model') })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text={t('Loading models…')} />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>{t('Could not load models.')}</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            {t('Retry')}
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
              <p className="mb-2">{t('No models yet.')}</p>
              <Button size="sm" onClick={openAdd}>
                {t('Add the first model')}
              </Button>
            </>
          ) : (
            <>
              <p className="mb-2">{t('Every model belongs to a controller. Add a controller first.')}</p>
              <Button as={Link} to={ROUTES.CONTROLLERS} size="sm" variant="ghost">
                {t('Go to Controllers')}
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
              placeholder={t('Search ID, model, controller, brand…')}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label={t('Search models')}
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
            aria-label={t('Filter by controller')}
          >
            <option value="">{t('All controllers')}</option>
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
          <div className="ts-empty">{t('No models match these filters.')}</div>
        )}
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">{t('Masters · Machine Catalog')}</div>
          <h1>{t('Models')}</h1>
          <p className="ts-page-subtitle">{t('Machine models of each controller, offered in the machine form.')}</p>
        </div>
        <div className="ts-page-actions">
          <Button onClick={openAdd} disabled={loading || Boolean(error) || !canAdd}>
            <i className="bi bi-plus-lg me-2" aria-hidden="true" />
            {t('Add Model')}
          </Button>
        </div>
      </header>

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
        title={t('Delete model')}
        confirmLabel={t('Delete')}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        <Trans
          i18nKey="Delete <b>{{name}}</b>? A model that machines use cannot be deleted."
          values={{ name: pendingDelete?.name }}
          components={{ b: <strong /> }}
        />
      </ConfirmModal>
    </>
  )
}

export default ModelList
