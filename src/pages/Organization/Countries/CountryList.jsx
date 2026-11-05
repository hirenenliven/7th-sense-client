import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
import TableNoResults from '@/components/common/TableNoResults'
import { PAGE_SIZES } from '@/constants/app'
import { deleteUserCountry, getUserCountries } from '@/services/userCountryService'
import useOrgUser from '@/hooks/useOrgUser'
import useTableSort from '@/hooks/useTableSort'
import SortableHead from '@/components/common/SortableHead'
import { toast } from '@/utils/toast'
import CountryFormModal from './CountryFormModal'
import CountryRow from './CountryRow'
import { newestFirst } from '@/utils/helpers'

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })

const matchesSearch = (country, term) =>
  [country.id, country.name].some((value) => String(value ?? '').toLowerCase().includes(term))

// Masters › Countries: the countries assigned to the company with search and paging.
// The superadmin adds them customer-wise (several at once) and deletes.
function CountryList() {
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  // The superadmin lists every customer's rows (Customer column) and picks the customer on the form
  const { userId, canAssign, customerLabel } = useOrgUser()

  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  const [adding, setAdding] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Load the countries on open (and on Retry)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getUserCountries(userId)
      .then((list) => active && setCountries(list))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey, userId])

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return term ? countries.filter((country) => matchesSearch(country, term)) : countries
  }, [countries, search])
  // Latest entry first (a row just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  // Stay on a valid page when the list shrinks (search, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const columns = [
    { label: 'ID', sort: (row) => row.id },
    { label: 'Country', sort: (row) => row.name },
    { label: 'Customer', sort: (row) => customerLabel(row.userId) },
    { label: 'Updated', sort: (row) => row.updatedAt },
    ...(canAssign ? ['Actions'] : []),
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // No results: Clear filters goes back to the whole list
  const clearFilters = () => {
    setSearch('')
    setPage(1)
  }

  const handleSaved = (added) => {
    setPage(1) // the new rows are on top of page 1
    setCountries((list) => [...list, ...added].sort(byName))
    setAdding(false)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteUserCountry(pendingDelete.id, pendingDelete.userId)
      setCountries((list) => list.filter((country) => country.id !== pendingDelete.id))
      toast.success(`${pendingDelete.name} has been deleted.`, { title: 'Country deleted' })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not delete country' })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text="Loading countries…" />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load countries.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }

    if (!countries.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-globe2 ts-empty-icon" aria-hidden="true" />
          <p className="mb-2">{canAssign ? 'No countries assigned yet.' : 'No countries have been assigned to your company yet.'}</p>
          {canAssign && (
            <Button size="sm" onClick={() => setAdding(true)}>
              Add countries
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
              placeholder="Search ID, country…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search countries"
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
        </div>

        <div className="ts-table-panel">
          <Table hover responsive className="mb-0">
            <SortableHead columns={columns} sort={sort} onSort={onSort} />
            <tbody>
              {pageRows.map((country) => (
                <CountryRow key={country.id} country={country} onDelete={setPendingDelete} />
              ))}
              {!pageRows.length && (
                <TableNoResults colSpan={columns.length} message={`No countries match “${search.trim()}”.`} onClear={clearFilters} />
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
          <h2 className="ts-section-title">Countries</h2>
          <p className="ts-note mb-0">The countries assigned to your organization.</p>
        </div>
        <div className="ts-page-actions">
          {canAssign && (
            <Button onClick={() => setAdding(true)} disabled={loading || Boolean(error)}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              Add Countries
            </Button>
          )}
        </div>
      </div>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      <CountryFormModal show={adding} countries={countries} onSaved={handleSaved} onHide={() => setAdding(false)} />

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title="Delete country"
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        Delete <strong>{pendingDelete?.name}</strong>? A country that still has states cannot be deleted — delete those first.
      </ConfirmModal>
    </>
  )
}

export default CountryList
