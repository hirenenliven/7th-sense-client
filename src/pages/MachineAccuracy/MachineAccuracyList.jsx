import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Col, Form, InputGroup, Row, Table } from 'react-bootstrap'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import SortableHead from '@/components/common/SortableHead'
import TableNoResults from '@/components/common/TableNoResults'
import TablePagination from '@/components/common/TablePagination'
import { PAGE_SIZES } from '@/constants/app'
import useTableSort from '@/hooks/useTableSort'
import { deleteMachineAccuracy, getMachineAccuracies } from '@/services/machineAccuracyService'
import { newestFirst } from '@/utils/helpers'
import { toast } from '@/utils/toast'
import MachineAccuracyEditor from './MachineAccuracyEditor'
import MachineAccuracyRow from './MachineAccuracyRow'
import { usageLabel } from './machineAccuracyForm'

// Account Center › Machine Accuracy (superadmin only, server ADR 0017): the accuracy levels the
// machine and part forms offer, one list for every customer (nothing per customer). Add / Edit
// beside the list; an accuracy in use cannot be deleted.
function MachineAccuracyList() {
  const [accuracies, setAccuracies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [currentPageNo, setPage] = useState(1)

  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getMachineAccuracies()
      .then((list) => active && setAccuracies(list))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return accuracies.filter((accuracy) => !term || [accuracy.id, accuracy.name].some((value) => String(value).toLowerCase().includes(term)))
  }, [accuracies, search])
  // Latest entry first (an accuracy just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(currentPageNo, pageCount)
  const columns = [
    { label: 'Accuracy ID', sort: (row) => row.id },
    { label: 'Accuracy', sort: (row) => row.name },
    { label: 'Used By', sort: (row) => row.usageCount },
    'Actions',
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const clearFilters = () => {
    setSearch('')
    setPage(1)
  }

  const handleSaved = useCallback((saved, wasEdit) => {
    if (wasEdit) {
      setAccuracies((list) => list.map((accuracy) => (accuracy.id === saved.id ? saved : accuracy)))
      setEditing(null)
    } else {
      setAccuracies((list) => [...list, saved])
      setPage(1) // a new row is on top of page 1
    }
  }, [])

  const inUse = Boolean(pendingDelete?.usageCount)

  const confirmDelete = async () => {
    if (inUse) {
      setPendingDelete(null)
      return
    }
    setBusy(true)
    try {
      await deleteMachineAccuracy(pendingDelete.id)
      setAccuracies((list) => list.filter((accuracy) => accuracy.id !== pendingDelete.id))
      toast.success(`${pendingDelete.name} has been deleted.`, { title: 'Machine accuracy deleted' })
      if (editing?.id === pendingDelete.id) setEditing(null)
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not delete machine accuracy' })
    } finally {
      setBusy(false)
    }
  }

  const deleteModalText = () => {
    if (!pendingDelete) return ''
    if (!inUse) return `${pendingDelete.name} will be removed from the machine and part forms of every customer.`
    return `${pendingDelete.name} is used by ${usageLabel(pendingDelete.usageCount).toLowerCase()}, so it cannot be deleted. Change their accuracy first.`
  }

  const renderList = () => {
    if (loading) return <Loader text="Loading machine accuracies…" />
    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load machine accuracies.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }
    if (!accuracies.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-bullseye ts-empty-icon" aria-hidden="true" />
          <p className="mb-0">No machine accuracies yet. Add the first one with the form.</p>
        </div>
      )
    }
    return (
      <>
        <div className="ts-toolbar">
          <InputGroup className="flex-grow-1 w-auto">
            <Form.Control
              type="search"
              placeholder="Search ID, accuracy…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search machine accuracies"
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
              {pageRows.map((accuracy) => (
                <MachineAccuracyRow key={accuracy.id} accuracy={accuracy} isEditing={editing?.id === accuracy.id} onEdit={setEditing} onDelete={setPendingDelete} />
              ))}
              {!pageRows.length && <TableNoResults colSpan={columns.length} message="No machine accuracies match this search." onClear={clearFilters} />}
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
          <h2 className="ts-section-title">Machine Accuracy</h2>
          <p className="ts-note mb-0">The accuracy levels the machine and part forms offer, the same for every customer.</p>
        </div>
      </div>

      <Row className="g-3">
        <Col lg={5} xl={4} xxl={3}>
          <MachineAccuracyEditor editing={editing} onSaved={handleSaved} onCancel={() => setEditing(null)} />
        </Col>
        <Col lg={7} xl={8} xxl={9}>
          <Card>
            <Card.Body>{renderList()}</Card.Body>
          </Card>
        </Col>
      </Row>

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title={inUse ? 'Machine accuracy is in use' : 'Delete machine accuracy?'}
        confirmLabel={inUse ? 'OK' : 'Delete'}
        confirmVariant={inUse ? 'primary' : 'danger'}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        {deleteModalText()}
      </ConfirmModal>
    </>
  )
}

export default MachineAccuracyList
