import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import OrgUserSelect from '@/components/common/OrgUserSelect'
import TablePagination from '@/components/common/TablePagination'
import { PAGE_SIZES } from '@/constants/app'
import { deleteUserCountry, getUserCountries } from '@/services/userCountryService'
import useOrgUser from '@/hooks/useOrgUser'
import { toast } from '@/utils/toast'
import CountryFormModal from './CountryFormModal'
import CountryRow from './CountryRow'

const matchesSearch = (country, term) =>
  [country.id, country.name].some((value) => String(value ?? '').toLowerCase().includes(term))

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })

// Masters › Countries: the logged-in user's countries with search, paging,
// add (picked from the country library) and delete.
function CountryList() {
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  // '' = the logged-in user; an admin can pick another user (OrgUserSelect)
  const { userId } = useOrgUser()

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

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return term ? countries.filter((country) => matchesSearch(country, term)) : countries
  }, [countries, search])

  // Stay on a valid page when the list shrinks (search, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleSaved = (saved) => {
    setCountries((list) => [...list, saved].sort(byName))
    setAdding(false)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteUserCountry(pendingDelete.id, userId)
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
          <p className="mb-2">No countries yet.</p>
          <Button size="sm" onClick={() => setAdding(true)}>
            Add the first country
          </Button>
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
                  <th scope="col">Country</th>
                  <th scope="col">Updated</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((country) => (
                  <CountryRow key={country.id} country={country} onDelete={setPendingDelete} />
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div className="ts-empty">No countries match “{search.trim()}”.</div>
        )}

        <TablePagination page={currentPage} pageSize={pageSize} totalCount={filtered.length} onPageChange={setPage} />
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Masters · Countries</div>
          <h1>Countries</h1>
          <p className="ts-page-subtitle">The countries your organization works in.</p>
        </div>
        <div className="ts-page-actions">
          <OrgUserSelect
            disabled={loading}
            onChange={() => {
              setSearch('')
              setPage(1)
            }}
          />
          <Button onClick={() => setAdding(true)} disabled={loading || Boolean(error)}>
            <i className="bi bi-plus-lg me-2" aria-hidden="true" />
            Add Country
          </Button>
        </div>
      </header>

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
