import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import OrgUserSelect from '@/components/common/OrgUserSelect'
import TablePagination from '@/components/common/TablePagination'
import { PAGE_SIZES } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { deleteUserShop, getUserShops } from '@/services/userShopService'
import { getUserLocations } from '@/services/userLocationService'
import useOrgUser from '@/hooks/useOrgUser'
import { toast } from '@/utils/toast'
import ShopFormModal from './ShopFormModal'
import ShopRow from './ShopRow'

const matchesSearch = (shop, term) =>
  [shop.id, shop.name, shop.locationName].some((value) => String(value ?? '').toLowerCase().includes(term))

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })

// Masters › Shops: the logged-in user's shops with search, location filter,
// paging, add / edit and delete.
function ShopList() {
  const [shops, setShops] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  // '' = the logged-in user; an admin can pick another user (OrgUserSelect)
  const { userId } = useOrgUser()

  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  // Form modal: { shop: null } adds, { shop } edits; null = closed
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Load the shops and the location options on open (and on Retry)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    Promise.all([getUserShops(null, userId), getUserLocations(null, userId)])
      .then(([list, locationList]) => {
        if (!active) return
        setShops(list)
        setLocations(locationList)
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey, userId])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return shops.filter(
      (shop) => (!locationFilter || String(shop.userLocationId) === locationFilter) && (!term || matchesSearch(shop, term)),
    )
  }, [shops, search, locationFilter])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Every shop belongs to a location
  const canAdd = locations.length > 0
  const openAdd = () => setEditing({ shop: null })

  const handleEdit = useCallback((shop) => setEditing({ shop }), [])

  const handleSaved = (saved) => {
    setShops((list) => {
      const exists = list.some((shop) => shop.id === saved.id)
      return (exists ? list.map((shop) => (shop.id === saved.id ? saved : shop)) : [...list, saved]).sort(byName)
    })
    setEditing(null)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteUserShop(pendingDelete.id, userId)
      setShops((list) => list.filter((shop) => shop.id !== pendingDelete.id))
      toast.success(`${pendingDelete.name} has been deleted.`, { title: 'Shop deleted' })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not delete shop' })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text="Loading shops…" />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load shops.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }

    if (!shops.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-shop ts-empty-icon" aria-hidden="true" />
          {canAdd ? (
            <>
              <p className="mb-2">No shops yet.</p>
              <Button size="sm" onClick={openAdd}>
                Add the first shop
              </Button>
            </>
          ) : (
            <>
              <p className="mb-2">Every shop belongs to a location. Add a location first.</p>
              <Button as={Link} to={ROUTES.ORG_LOCATIONS} size="sm" variant="ghost">
                Go to Locations
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
              placeholder="Search ID, shop, location…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search shops"
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
          <Form.Select
            className="w-auto"
            value={locationFilter}
            onChange={(event) => {
              setLocationFilter(event.target.value)
              setPage(1)
            }}
            aria-label="Filter by location"
          >
            <option value="">All locations</option>
            {locations.map((option) => (
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
                  <th scope="col">Shop</th>
                  <th scope="col">Location</th>
                  <th scope="col">Updated</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((shop) => (
                  <ShopRow
                    key={shop.id}
                    shop={shop}
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
          <div className="ts-empty">No shops match these filters.</div>
        )}
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Masters · Shops</div>
          <h1>Shops</h1>
          <p className="ts-page-subtitle">Your shops and the location each belongs to.</p>
        </div>
        <div className="ts-page-actions">
          <OrgUserSelect
            disabled={loading}
            onChange={() => {
              setLocationFilter('')
              setSearch('')
              setPage(1)
            }}
          />
          <Button onClick={openAdd} disabled={loading || Boolean(error) || !canAdd}>
            <i className="bi bi-plus-lg me-2" aria-hidden="true" />
            Add Shop
          </Button>
        </div>
      </header>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      <ShopFormModal
        show={Boolean(editing)}
        shop={editing?.shop ?? null}
        locations={locations}
        defaultLocationId={locationFilter}
        onSaved={handleSaved}
        onHide={() => setEditing(null)}
      />

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title="Delete shop"
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        Delete <strong>{pendingDelete?.name}</strong>?
        {' '}A shop that still has lines cannot be deleted — delete those first.
      </ConfirmModal>
    </>
  )
}

export default ShopList
