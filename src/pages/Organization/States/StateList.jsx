import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import OrgUserSelect from '@/components/common/OrgUserSelect'
import TablePagination from '@/components/common/TablePagination'
import { PAGE_SIZES } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { deleteUserState, getUserStates } from '@/services/userStateService'
import { getUserCountries } from '@/services/userCountryService'
import useOrgUser from '@/hooks/useOrgUser'
import { toast } from '@/utils/toast'
import StateFormModal from './StateFormModal'
import StateRow from './StateRow'

const matchesSearch = (state, term) =>
  [state.id, state.name, state.countryName].some((value) => String(value ?? '').toLowerCase().includes(term))

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })

// Masters › States: the logged-in user's states with search, country filter,
// paging, add and delete.
function StateList() {
  const [states, setStates] = useState([])
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  // '' = the logged-in user; an admin can pick another user (OrgUserSelect)
  const { userId } = useOrgUser()

  const [search, setSearch] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  // Form modal open
  const [adding, setAdding] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Load the states and the country options on open (and on Retry)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    Promise.all([getUserStates(null, userId), getUserCountries(userId)])
      .then(([list, countryList]) => {
        if (!active) return
        setStates(list)
        setCountries(countryList)
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey, userId])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return states.filter(
      (state) => (!countryFilter || String(state.userCountryId) === countryFilter) && (!term || matchesSearch(state, term)),
    )
  }, [states, search, countryFilter])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Every state belongs to a country
  const canAdd = countries.length > 0
  const openAdd = () => setAdding(true)

  const handleSaved = (saved) => {
    setStates((list) => {
      const exists = list.some((state) => state.id === saved.id)
      return (exists ? list.map((state) => (state.id === saved.id ? saved : state)) : [...list, saved]).sort(byName)
    })
    setAdding(false)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteUserState(pendingDelete.id, userId)
      setStates((list) => list.filter((state) => state.id !== pendingDelete.id))
      toast.success(`${pendingDelete.name} has been deleted.`, { title: 'State deleted' })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not delete state' })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text="Loading states…" />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load states.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }

    if (!states.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-map ts-empty-icon" aria-hidden="true" />
          {canAdd ? (
            <>
              <p className="mb-2">No states yet.</p>
              <Button size="sm" onClick={openAdd}>
                Add the first state
              </Button>
            </>
          ) : (
            <>
              <p className="mb-2">Every state belongs to a country. Add a country first.</p>
              <Button as={Link} to={ROUTES.ORG_COUNTRIES} size="sm" variant="ghost">
                Go to Countries
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
              placeholder="Search ID, state, country…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search states"
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
          <Form.Select
            className="w-auto"
            value={countryFilter}
            onChange={(event) => {
              setCountryFilter(event.target.value)
              setPage(1)
            }}
            aria-label="Filter by country"
          >
            <option value="">All countries</option>
            {countries.map((option) => (
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
                  <th scope="col">State</th>
                  <th scope="col">Country</th>
                  <th scope="col">Updated</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((state) => (
                  <StateRow
                    key={state.id}
                    state={state}
                    onDelete={setPendingDelete}
                  />
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div className="ts-empty">No states match these filters.</div>
        )}

        <TablePagination page={currentPage} pageSize={pageSize} totalCount={filtered.length} onPageChange={setPage} />
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Masters · States</div>
          <h1>States</h1>
          <p className="ts-page-subtitle">Your states and the country each belongs to.</p>
        </div>
        <div className="ts-page-actions">
          <OrgUserSelect
            disabled={loading}
            onChange={() => {
              setCountryFilter('')
              setSearch('')
              setPage(1)
            }}
          />
          <Button onClick={openAdd} disabled={loading || Boolean(error) || !canAdd}>
            <i className="bi bi-plus-lg me-2" aria-hidden="true" />
            Add State
          </Button>
        </div>
      </header>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      <StateFormModal
        show={adding}
        states={states}
        countries={countries}
        defaultCountryId={countryFilter}
        onSaved={handleSaved}
        onHide={() => setAdding(false)}
      />

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title="Delete state"
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        Delete <strong>{pendingDelete?.name}</strong>?
        {' '}A state that still has cities cannot be deleted — delete those first.
      </ConfirmModal>
    </>
  )
}

export default StateList
