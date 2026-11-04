import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Table } from 'react-bootstrap'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
import { PAGE_SIZES } from '@/constants/app'
import { deleteBrand, getBrands } from '@/services/catalogService'
import { toast } from '@/utils/toast'
import BrandFormModal from './BrandFormModal'
import BrandRow from './BrandRow'
import useTableSort from '@/hooks/useTableSort'
import SortableHead from '@/components/common/SortableHead'
import { newestFirst } from '@/utils/helpers'

const matchesSearch = (brand, term) =>
  [brand.id, brand.name, brand.code, brand.description].some((value) => String(value ?? '').toLowerCase().includes(term))

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })

// Account Center › Machine Catalog › Brands (superadmin): the machine brands with search, paging,
// add / edit and delete. Every user picks them in the machine form; controllers belong to a brand.
function BrandList() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  // Form modal: { brand: null } adds, { brand } edits; null = closed
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Load the brands on open (and on Retry)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getBrands()
      .then((list) => active && setBrands([...list].sort(byName)))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return term ? brands.filter((brand) => matchesSearch(brand, term)) : brands
  }, [brands, search])
  // Latest entry first (a row just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  // Stay on a valid page when the list shrinks (search, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const columns = [
    { label: 'ID', sort: (row) => row.id },
    { label: 'Brand', sort: (row) => row.name },
    { label: 'Code', sort: (row) => row.code },
    { label: 'Updated', sort: (row) => row.updatedAt },
    'Actions',
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const openAdd = () => setEditing({ brand: null })

  const handleEdit = useCallback((brand) => setEditing({ brand }), [])

  const handleSaved = (saved) => {
    if (!brands.some((row) => row.id === saved.id)) setPage(1) // a new row is on top of page 1
    setBrands((list) => {
      const exists = list.some((brand) => brand.id === saved.id)
      return (exists ? list.map((brand) => (brand.id === saved.id ? saved : brand)) : [...list, saved]).sort(byName)
    })
    setEditing(null)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteBrand(pendingDelete.id)
      setBrands((list) => list.filter((brand) => brand.id !== pendingDelete.id))
      toast.success(`${pendingDelete.name} has been deleted.`, { title: 'Brand deleted' })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not delete brand' })
    } finally {
      setDeleting(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text="Loading brands…" />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load brands.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }

    if (!brands.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-tags ts-empty-icon" aria-hidden="true" />
          <p className="mb-2">No brands yet.</p>
          <Button size="sm" onClick={openAdd}>
            Add the first brand
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
              placeholder="Search ID, brand, code, description…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search brands"
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
        </div>

        {filtered.length ? (
          <div className="ts-table-panel">
            <Table hover responsive className="mb-0">
              <SortableHead columns={columns} sort={sort} onSort={onSort} />
              <tbody>
                {pageRows.map((brand) => (
                  <BrandRow key={brand.id} brand={brand} onEdit={handleEdit} onDelete={setPendingDelete} />
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
          <div className="ts-empty">No brands match this search.</div>
        )}
      </>
    )
  }

  return (
    <>
      <div className="ts-tab-header">
        <div>
          <h2 className="ts-section-title">Brands</h2>
          <p className="ts-note mb-0">Machine brands, offered in the machine form; each controller belongs to one.</p>
        </div>
        <div className="ts-page-actions">
          <Button onClick={openAdd} disabled={loading || Boolean(error)}>
            <i className="bi bi-plus-lg me-2" aria-hidden="true" />
            Add Brand
          </Button>
        </div>
      </div>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      <BrandFormModal
        show={Boolean(editing)}
        brand={editing?.brand ?? null}
        onSaved={handleSaved}
        onHide={() => setEditing(null)}
      />

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title="Delete brand"
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        Delete <strong>{pendingDelete?.name}</strong>?
        {' '}A brand that still has controllers, or that machines use, cannot be deleted.
      </ConfirmModal>
    </>
  )
}

export default BrandList
