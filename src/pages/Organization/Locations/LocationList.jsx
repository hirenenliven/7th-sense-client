import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import OrgUserSelect from '@/components/common/OrgUserSelect'
import TablePagination from '@/components/common/TablePagination'
import { PAGE_SIZES } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { deleteUserLocation, getUserLocations } from '@/services/userLocationService'
import { getBranches } from '@/services/branchService'
import useOrgUser from '@/hooks/useOrgUser'
import { toast } from '@/utils/toast'
import LocationFormModal from './LocationFormModal'
import LocationRow from './LocationRow'

const matchesSearch = (location, term) =>
  [location.id, location.name, location.branchName].some((value) => String(value ?? '').toLowerCase().includes(term))

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })

// Masters › Locations: the logged-in user's locations with search, branch filter,
// paging, add / edit and delete.
function LocationList() {
  const [locations, setLocations] = useState([])
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  // '' = the logged-in user's company; the superadmin can pick another user (OrgUserSelect)
  const { userId, canEdit } = useOrgUser()

  const [search, setSearch] = useState('')
  const [branchFilter, setBranchFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  // Form modal: { location: null } adds, { location } edits; null = closed
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Load the locations and the branch options on open (and on Retry)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    Promise.all([getUserLocations(null, userId), getBranches()])
      .then(([list, branchList]) => {
        if (!active) return
        setLocations(list)
        setBranches(branchList)
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey, userId])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return locations.filter(
      (location) => (!branchFilter || String(location.branchId) === branchFilter) && (!term || matchesSearch(location, term)),
    )
  }, [locations, search, branchFilter])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Every location belongs to a branch
  const canAdd = branches.length > 0
  const openAdd = () => setEditing({ location: null })

  const handleEdit = useCallback((location) => setEditing({ location }), [])

  const handleSaved = (saved) => {
    setLocations((list) => {
      const exists = list.some((location) => location.id === saved.id)
      return (exists ? list.map((location) => (location.id === saved.id ? saved : location)) : [...list, saved]).sort(byName)
    })
    setEditing(null)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteUserLocation(pendingDelete.id, userId)
      setLocations((list) => list.filter((location) => location.id !== pendingDelete.id))
      toast.success(`${pendingDelete.name} has been deleted.`, { title: 'Location deleted' })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not delete location' })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text="Loading locations…" />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load locations.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }

    if (!locations.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-geo-alt ts-empty-icon" aria-hidden="true" />
          {canAdd ? (
            <>
              <p className="mb-2">No locations yet.</p>
              {canEdit && (
                <Button size="sm" onClick={openAdd}>
                  Add the first location
                </Button>
              )}
            </>
          ) : (
            <>
              <p className="mb-2">Every location belongs to a branch. Add a branch first.</p>
              <Button as={Link} to={ROUTES.BRANCHES} size="sm" variant="ghost">
                Go to Branches
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
              placeholder="Search ID, location, branch…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search locations"
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
          <Form.Select
            className="w-auto"
            value={branchFilter}
            onChange={(event) => {
              setBranchFilter(event.target.value)
              setPage(1)
            }}
            aria-label="Filter by branch"
          >
            <option value="">All branches</option>
            {branches.map((option) => (
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
                  <th scope="col">Location</th>
                  <th scope="col">Branch</th>
                  <th scope="col">Updated</th>
                  {canEdit && <th scope="col">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((location) => (
                  <LocationRow
                    key={location.id}
                    location={location}
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
          <div className="ts-empty">No locations match these filters.</div>
        )}
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Masters · Locations</div>
          <h1>Locations</h1>
          <p className="ts-page-subtitle">Your locations and the branch each belongs to.</p>
        </div>
        <div className="ts-page-actions">
          <OrgUserSelect
            disabled={loading}
            onChange={() => {
              setBranchFilter('')
              setSearch('')
              setPage(1)
            }}
          />
          {canEdit && (
            <Button onClick={openAdd} disabled={loading || Boolean(error) || !canAdd}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              Add Location
            </Button>
          )}
        </div>
      </header>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      <LocationFormModal
        show={Boolean(editing)}
        location={editing?.location ?? null}
        branches={branches}
        defaultBranchId={branchFilter}
        onSaved={handleSaved}
        onHide={() => setEditing(null)}
      />

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title="Delete location"
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        Delete <strong>{pendingDelete?.name}</strong>?
        {' '}A location that still has shops cannot be deleted — delete those first.
      </ConfirmModal>
    </>
  )
}

export default LocationList
