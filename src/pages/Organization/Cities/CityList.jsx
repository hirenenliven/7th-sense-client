import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
import TableNoResults from '@/components/common/TableNoResults'
import { PAGE_SIZES } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { deleteUserCity, getUserCities } from '@/services/userCityService'
import { getUserStates } from '@/services/userStateService'
import useOrgUser from '@/hooks/useOrgUser'
import useTableSort from '@/hooks/useTableSort'
import SortableHead from '@/components/common/SortableHead'
import { toast } from '@/utils/toast'
import CityFormModal from './CityFormModal'
import CityRow from './CityRow'
import { newestFirst } from '@/utils/helpers'

const matchesSearch = (city, term) =>
  [city.id, city.name, city.stateName].some((value) => String(value ?? '').toLowerCase().includes(term))

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })

// Masters › Cities: the logged-in user's cities with search, state filter,
// paging, add / edit and delete.
function CityList() {
  const [cities, setCities] = useState([])
  const [states, setStates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  // The superadmin lists every customer's rows (Customer column) and picks the customer on the form
  const { userId, canEdit, customerLabel } = useOrgUser()

  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  // Form modal: { city: null } adds, { city } edits; null = closed
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Load the cities and the state options on open (and on Retry)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    Promise.all([getUserCities(null, userId), getUserStates(null, userId)])
      .then(([list, stateList]) => {
        if (!active) return
        setCities(list)
        setStates(stateList)
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey, userId])

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return cities.filter(
      (city) => (!stateFilter || String(city.userStateId) === stateFilter) && (!term || matchesSearch(city, term)),
    )
  }, [cities, search, stateFilter])
  // Latest entry first (a row just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const columns = [
    { label: 'ID', sort: (row) => row.id },
    { label: 'City', sort: (row) => row.name },
    { label: 'State', sort: (row) => row.stateName },
    { label: 'Customer', sort: (row) => customerLabel(row.userId) },
    { label: 'Updated', sort: (row) => row.updatedAt },
    ...(canEdit ? ['Actions'] : []),
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // No results: Clear filters goes back to the whole list
  const clearFilters = () => {
    setSearch('')
    setStateFilter('')
    setPage(1)
  }

  // Every city belongs to a state
  const canAdd = states.length > 0
  const openAdd = () => setEditing({ city: null })

  const handleEdit = useCallback((city) => setEditing({ city }), [])

  const handleSaved = (saved) => {
    if (!cities.some((row) => row.id === saved.id)) setPage(1) // a new row is on top of page 1
    setCities((list) => {
      const exists = list.some((city) => city.id === saved.id)
      return (exists ? list.map((city) => (city.id === saved.id ? saved : city)) : [...list, saved]).sort(byName)
    })
    setEditing(null)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteUserCity(pendingDelete.id, pendingDelete.userId)
      setCities((list) => list.filter((city) => city.id !== pendingDelete.id))
      toast.success(`${pendingDelete.name} has been deleted.`, { title: 'City deleted' })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not delete city' })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text="Loading cities…" />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load cities.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }

    if (!cities.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-buildings ts-empty-icon" aria-hidden="true" />
          {canAdd ? (
            <>
              <p className="mb-2">No cities yet.</p>
              {canEdit && (
                <Button size="sm" onClick={openAdd}>
                  Add the first city
                </Button>
              )}
            </>
          ) : (
            <>
              <p className="mb-2">Every city belongs to a state. Add a state first.</p>
              <Button as={Link} to={ROUTES.ORG_STATES} size="sm" variant="ghost">
                Go to States
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
              placeholder="Search ID, city, state…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search cities"
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
          <Form.Select
            className="w-auto"
            value={stateFilter}
            onChange={(event) => {
              setStateFilter(event.target.value)
              setPage(1)
            }}
            aria-label="Filter by state"
          >
            <option value="">All states</option>
            {states.map((option) => (
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
              {pageRows.map((city) => (
                <CityRow
                  key={city.id}
                  city={city}
                  onEdit={handleEdit}
                  onDelete={setPendingDelete}
                />
              ))}
              {!pageRows.length && (
                <TableNoResults colSpan={columns.length} message="No cities match these filters." onClear={clearFilters} />
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
          <h2 className="ts-section-title">Cities</h2>
          <p className="ts-note mb-0">Your cities and the state each belongs to.</p>
        </div>
        <div className="ts-page-actions">
          {canEdit && (
            <Button onClick={openAdd} disabled={loading || Boolean(error) || !canAdd}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              Add City
            </Button>
          )}
        </div>
      </div>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      <CityFormModal
        show={Boolean(editing)}
        city={editing?.city ?? null}
        states={states}
        defaultStateId={stateFilter}
        onSaved={handleSaved}
        onHide={() => setEditing(null)}
      />

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title="Delete city"
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        Delete <strong>{pendingDelete?.name}</strong>?
        {' '}A city that still has branches cannot be deleted — delete those first.
      </ConfirmModal>
    </>
  )
}

export default CityList
