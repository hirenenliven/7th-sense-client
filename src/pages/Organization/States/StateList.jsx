import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
import { PAGE_SIZES } from '@/constants/app'
import { deleteUserState, getUserStates } from '@/services/userStateService'
import { getUserCountries } from '@/services/userCountryService'
import useOrgUser from '@/hooks/useOrgUser'
import useTableSort from '@/hooks/useTableSort'
import SortableHead from '@/components/common/SortableHead'
import { toast } from '@/utils/toast'
import StateFormModal from './StateFormModal'
import StateRow from './StateRow'
import { newestFirst } from '@/utils/helpers'

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })

const matchesSearch = (state, term) =>
  [state.id, state.name, state.countryName].some((value) => String(value ?? '').toLowerCase().includes(term))

// Masters › States: the states assigned to the company with search, country filter and
// paging. The superadmin adds them customer-wise (a country, then several of its states) and deletes.
function StateList() {
  const [states, setStates] = useState([])
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  // The superadmin lists every customer's rows (Customer column) and picks the customer on the form
  const { userId, canAssign, customerLabel } = useOrgUser()

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

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return states.filter(
      (state) => (!countryFilter || String(state.userCountryId) === countryFilter) && (!term || matchesSearch(state, term)),
    )
  }, [states, search, countryFilter])
  // Latest entry first (a row just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const columns = [
    { label: 'ID', sort: (row) => row.id },
    { label: 'State', sort: (row) => row.name },
    { label: 'Country', sort: (row) => row.countryName },
    { label: 'Customer', sort: (row) => customerLabel(row.userId) },
    { label: 'Updated', sort: (row) => row.updatedAt },
    ...(canAssign ? ['Actions'] : []),
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const openAdd = () => setAdding(true)

  const handleSaved = (added) => {
    setPage(1) // the new rows are on top of page 1
    setStates((list) => [...list, ...added].sort(byName))
    setAdding(false)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteUserState(pendingDelete.id, pendingDelete.userId)
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
          <p className="mb-2">
            {canAssign
              ? countries.length
                ? 'No states added yet.'
                : 'Every state belongs to a country. Add a country first.'
              : 'No states have been assigned to your company yet.'}
          </p>
          {canAssign && countries.length > 0 && (
            <Button size="sm" onClick={openAdd}>
              Add states
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
        </div>

        {filtered.length ? (
          <div className="ts-table-panel">
            <Table hover responsive className="mb-0">
              <SortableHead columns={columns} sort={sort} onSort={onSort} />
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
          <div className="ts-empty">No states match these filters.</div>
        )}
      </>
    )
  }

  return (
    <>
      <div className="ts-tab-header">
        <div>
          <h2 className="ts-section-title">States</h2>
          <p className="ts-note mb-0">The states assigned to your organization and the country each belongs to.</p>
        </div>
        <div className="ts-page-actions">
          {canAssign && (
            <Button onClick={openAdd} disabled={loading || Boolean(error) || !countries.length}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              Add States
            </Button>
          )}
        </div>
      </div>

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
