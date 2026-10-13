import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import OrgUserSelect from '@/components/common/OrgUserSelect'
import TablePagination from '@/components/common/TablePagination'
import { PAGE_SIZES } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { deleteUserCity, getUserCities } from '@/services/userCityService'
import { getUserStates } from '@/services/userStateService'
import useOrgUser from '@/hooks/useOrgUser'
import { toast } from '@/utils/toast'
import CityFormModal from './CityFormModal'
import CityRow from './CityRow'

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
  // '' = the logged-in user; an admin can pick another user (OrgUserSelect)
  const { userId } = useOrgUser()

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

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return cities.filter(
      (city) => (!stateFilter || String(city.userStateId) === stateFilter) && (!term || matchesSearch(city, term)),
    )
  }, [cities, search, stateFilter])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Every city belongs to a state
  const canAdd = states.length > 0
  const openAdd = () => setEditing({ city: null })

  const handleEdit = useCallback((city) => setEditing({ city }), [])

  const handleSaved = (saved) => {
    setCities((list) => {
      const exists = list.some((city) => city.id === saved.id)
      return (exists ? list.map((city) => (city.id === saved.id ? saved : city)) : [...list, saved]).sort(byName)
    })
    setEditing(null)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteUserCity(pendingDelete.id, userId)
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
              <Button size="sm" onClick={openAdd}>
                Add the first city
              </Button>
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
          <Form.Select
            className="w-auto"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value))
              setPage(1)
            }}
            aria-label="Rows per page"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
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
                  <th scope="col">City</th>
                  <th scope="col">State</th>
                  <th scope="col">Updated</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((city) => (
                  <CityRow
                    key={city.id}
                    city={city}
                    onEdit={handleEdit}
                    onDelete={setPendingDelete}
                  />
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div className="ts-empty">No cities match these filters.</div>
        )}

        <TablePagination page={currentPage} pageSize={pageSize} totalCount={filtered.length} onPageChange={setPage} />
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Masters · Cities</div>
          <h1>Cities</h1>
          <p className="ts-page-subtitle">Your cities and the state each belongs to.</p>
        </div>
        <div className="ts-page-actions">
          <OrgUserSelect
            disabled={loading}
            onChange={() => {
              setStateFilter('')
              setSearch('')
              setPage(1)
            }}
          />
          <Button onClick={openAdd} disabled={loading || Boolean(error) || !canAdd}>
            <i className="bi bi-plus-lg me-2" aria-hidden="true" />
            Add City
          </Button>
        </div>
      </header>

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
