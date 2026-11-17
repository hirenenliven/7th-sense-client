import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Col, Form, InputGroup, Row, Table } from 'react-bootstrap'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import SortableHead from '@/components/common/SortableHead'
import TableNoResults from '@/components/common/TableNoResults'
import TablePagination from '@/components/common/TablePagination'
import { PAGE_SIZES, ROLES } from '@/constants/app'
import useOrgUser from '@/hooks/useOrgUser'
import useTableSort from '@/hooks/useTableSort'
import { getModels } from '@/services/catalogService'
import { getUsers } from '@/services/customerService'
import { deleteOperatorTask, getMaintenanceTasks, getOperatorTasks } from '@/services/operatorTaskService'
import { newestFirst } from '@/utils/helpers'
import { toast } from '@/utils/toast'
import OperatorTaskEditor from './OperatorTaskEditor'
import OperatorTaskRow from './OperatorTaskRow'
import { machineTypeDetail, machineTypeLabel } from './operatorTaskForm'

const matchesSearch = (operatorTask, term, customerLabel) =>
  [operatorTask.id, customerLabel(operatorTask.userId), machineTypeLabel(operatorTask), machineTypeDetail(operatorTask), operatorTask.task].some(
    (value) => String(value ?? '').toLowerCase().includes(term),
  )

// Account Center › Operator Task (superadmin only, server ADR 0015): the checks an operator does on
// a customer's machines of a model. The Add / Edit form sits beside the list (Edit loads a row
// into it); the Task field can add a new task to the shared master list.
function OperatorTaskSetup() {
  const { customerLabel } = useOrgUser()

  const [operatorTasks, setOperatorTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // Form options; each may fail alone (the form then shows fewer choices and a toast)
  const [customers, setCustomers] = useState([])
  const [models, setModels] = useState([])
  const [tasks, setTasks] = useState([])

  const [search, setSearch] = useState('')
  const [customerFilter, setCustomerFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [currentPageNo, setPage] = useState(1)

  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getOperatorTasks()
      .then((list) => active && setOperatorTasks(list))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  useEffect(() => {
    let active = true
    const load = (request, setter, what) =>
      request()
        .then((list) => active && setter(list))
        .catch((err) => active && toast.error(err.message, { title: `Could not load ${what}` }))
    load(() => getUsers({ filterRole: ROLES.CUSTOMER }), setCustomers, 'customers')
    load(() => getModels(), setModels, 'machine types')
    load(getMaintenanceTasks, setTasks, 'tasks')
    return () => {
      active = false
    }
  }, [])

  // Customers that have operator tasks, for the filter
  const filterCustomers = useMemo(() => {
    const ids = [...new Set(operatorTasks.map((operatorTask) => operatorTask.userId))]
    return ids.map((id) => ({ id, name: customerLabel(id) })).sort((a, b) => a.name.localeCompare(b.name))
  }, [operatorTasks, customerLabel])

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return operatorTasks.filter(
      (operatorTask) =>
        (!customerFilter || String(operatorTask.userId) === customerFilter) && (!term || matchesSearch(operatorTask, term, customerLabel)),
    )
  }, [operatorTasks, search, customerFilter, customerLabel])
  // Latest entry first (a row just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(currentPageNo, pageCount)
  const columns = [
    { label: 'ID', sort: (row) => row.id },
    { label: 'Customer', sort: (row) => customerLabel(row.userId) },
    { label: 'Machine Type', sort: machineTypeLabel },
    { label: 'Task', sort: (row) => row.task },
    'Actions',
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const clearFilters = () => {
    setSearch('')
    setCustomerFilter('')
    setPage(1)
  }

  const handleSaved = useCallback((saved, wasEdit) => {
    setOperatorTasks((list) => (wasEdit ? list.map((row) => (row.id === saved.id ? saved : row)) : [...list, saved]))
    if (wasEdit) setEditing(null)
    else setPage(1) // a new row is on top of page 1
  }, [])

  const handleTaskAdded = useCallback(
    (task) => setTasks((list) => [...list, task].sort((a, b) => a.description.localeCompare(b.description))),
    [],
  )

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteOperatorTask(pendingDelete.id)
      setOperatorTasks((list) => list.filter((row) => row.id !== pendingDelete.id))
      if (editing?.id === pendingDelete.id) setEditing(null)
      toast.success(`${pendingDelete.task} has been deleted.`, { title: 'Operator task deleted' })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not delete operator task' })
    } finally {
      setDeleting(false)
    }
  }

  const renderList = () => {
    if (loading) return <Loader text="Loading operator tasks…" />
    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load operator tasks.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }
    if (!operatorTasks.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-clipboard-check ts-empty-icon" aria-hidden="true" />
          <p className="mb-0">No operator tasks yet. Add the first one with the form.</p>
        </div>
      )
    }
    return (
      <>
        <div className="ts-toolbar">
          <InputGroup className="flex-grow-1 w-auto">
            <Form.Control
              type="search"
              placeholder="Search ID, customer, machine type, task…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search operator tasks"
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
          <Form.Select
            className="w-auto"
            value={customerFilter}
            onChange={(event) => {
              setCustomerFilter(event.target.value)
              setPage(1)
            }}
            aria-label="Filter by customer"
          >
            <option value="">All customers</option>
            {filterCustomers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="ts-table-panel">
          <Table hover responsive className="mb-0">
            <SortableHead columns={columns} sort={sort} onSort={onSort} />
            <tbody>
              {pageRows.map((operatorTask) => (
                <OperatorTaskRow
                  key={operatorTask.id}
                  operatorTask={operatorTask}
                  isEditing={editing?.id === operatorTask.id}
                  customerLabel={customerLabel}
                  onEdit={setEditing}
                  onDelete={setPendingDelete}
                />
              ))}
              {!pageRows.length && (
                <TableNoResults colSpan={columns.length} message="No operator tasks match these filters." onClear={clearFilters} />
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
          <h2 className="ts-section-title">Operator Tasks</h2>
          <p className="ts-note mb-0">The checks an operator does on a customer’s machines, per machine type.</p>
        </div>
      </div>

      <Row className="g-3">
        <Col lg={5} xl={4} xxl={3}>
          <OperatorTaskEditor
            customers={customers}
            models={models}
            tasks={tasks}
            editing={editing}
            onSaved={handleSaved}
            onCancel={() => setEditing(null)}
            onTaskAdded={handleTaskAdded}
          />
        </Col>
        <Col lg={7} xl={8} xxl={9}>
          <Card>
            <Card.Body>{renderList()}</Card.Body>
          </Card>
        </Col>
      </Row>

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title="Delete operator task?"
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        {pendingDelete
          ? `${pendingDelete.task} will no longer apply to ${customerLabel(pendingDelete.userId)} (${machineTypeLabel(pendingDelete)}). The task stays in the task list.`
          : ''}
      </ConfirmModal>
    </>
  )
}

export default OperatorTaskSetup
