import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
import { PAGE_SIZES } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { deleteUserBranch, getUserBranches } from '@/services/userBranchService'
import { getUserCities } from '@/services/userCityService'
import { toast } from '@/utils/toast'
import BranchFormModal from './BranchFormModal'
import BranchRow from './BranchRow'

const matchesSearch = (branch, term) =>
  [branch.id, branch.name, branch.cityName].some((value) => String(value ?? '').toLowerCase().includes(term))

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })

// Masters › Branches: the logged-in user's branches with search, city filter,
// paging, add / edit and delete.
function BranchList() {
  const [branches, setBranches] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  // Form modal: { branch: null } adds, { branch } edits; null = closed
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Load the branches and the city options on open (and on Retry)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    Promise.all([getUserBranches(), getUserCities()])
      .then(([list, cityList]) => {
        if (!active) return
        setBranches(list)
        setCities(cityList)
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return branches.filter(
      (branch) => (!cityFilter || String(branch.userCityId) === cityFilter) && (!term || matchesSearch(branch, term)),
    )
  }, [branches, search, cityFilter])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Every branch belongs to a city
  const canAdd = cities.length > 0
  const openAdd = () => setEditing({ branch: null })

  const handleEdit = useCallback((branch) => setEditing({ branch }), [])

  const handleSaved = (saved) => {
    setBranches((list) => {
      const exists = list.some((branch) => branch.id === saved.id)
      return (exists ? list.map((branch) => (branch.id === saved.id ? saved : branch)) : [...list, saved]).sort(byName)
    })
    setEditing(null)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteUserBranch(pendingDelete.id)
      setBranches((list) => list.filter((branch) => branch.id !== pendingDelete.id))
      toast.success(`${pendingDelete.name} has been deleted.`, { title: 'Branch deleted' })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not delete branch' })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text="Loading branches…" />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load branches.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }

    if (!branches.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-diagram-3 ts-empty-icon" aria-hidden="true" />
          {canAdd ? (
            <>
              <p className="mb-2">No branches yet.</p>
              <Button size="sm" onClick={openAdd}>
                Add the first branch
              </Button>
            </>
          ) : (
            <>
              <p className="mb-2">Every branch belongs to a city. Add a city first.</p>
              <Button as={Link} to={ROUTES.ORG_CITIES} size="sm" variant="ghost">
                Go to Cities
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
              placeholder="Search ID, branch, city…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search branches"
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
          <Form.Select
            className="w-auto"
            value={cityFilter}
            onChange={(event) => {
              setCityFilter(event.target.value)
              setPage(1)
            }}
            aria-label="Filter by city"
          >
            <option value="">All cities</option>
            {cities.map((option) => (
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
                  <th scope="col">Branch</th>
                  <th scope="col">City</th>
                  <th scope="col">Updated</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((branch) => (
                  <BranchRow
                    key={branch.id}
                    branch={branch}
                    onEdit={handleEdit}
                    onDelete={setPendingDelete}
                  />
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div className="ts-empty">No branches match these filters.</div>
        )}

        <TablePagination page={currentPage} pageSize={pageSize} totalCount={filtered.length} onPageChange={setPage} />
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Masters · Branches</div>
          <h1>Branches</h1>
          <p className="ts-page-subtitle">Your branches and the city each belongs to.</p>
        </div>
        <div className="ts-page-actions">
          <Button onClick={openAdd} disabled={loading || Boolean(error) || !canAdd}>
            <i className="bi bi-plus-lg me-2" aria-hidden="true" />
            Add Branch
          </Button>
        </div>
      </header>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      <BranchFormModal
        show={Boolean(editing)}
        branch={editing?.branch ?? null}
        cities={cities}
        defaultCityId={cityFilter}
        onSaved={handleSaved}
        onHide={() => setEditing(null)}
      />

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title="Delete branch"
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        Delete <strong>{pendingDelete?.name}</strong>?
        {' '}A branch that still has locations cannot be deleted — delete those first.
      </ConfirmModal>
    </>
  )
}

export default BranchList
