import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Col, Form, InputGroup, Row, Table } from 'react-bootstrap'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import SortableHead from '@/components/common/SortableHead'
import TableNoResults from '@/components/common/TableNoResults'
import TablePagination from '@/components/common/TablePagination'
import { PAGE_SIZES } from '@/constants/app'
import useTableSort from '@/hooks/useTableSort'
import { deleteMaintenanceTask, getMaintenanceTasks, updateMaintenanceTask } from '@/services/operatorTaskService'
import { newestFirst } from '@/utils/helpers'
import { toast } from '@/utils/toast'
import TaskListEditor from './TaskListEditor'
import TaskListRow from './TaskListRow'
import { TASK_STATUS } from './operatorTaskForm'
import { usageLabel } from './taskListForm'

// Account Center › Operator Task › Task List (superadmin only, server ADR 0015): the shared list of
// tasks the Operator Tasks form picks from. Add / Edit beside the list; a task in use cannot be
// deleted, so its Delete offers Make inactive instead.
function TaskList() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [currentPageNo, setPage] = useState(1)

  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getMaintenanceTasks()
      .then((list) => active && setTasks(list))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return tasks.filter(
      (task) =>
        (!statusFilter || task.status === statusFilter) &&
        (!term || [task.id, task.description].some((value) => String(value).toLowerCase().includes(term))),
    )
  }, [tasks, search, statusFilter])
  // Latest entry first (a task just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(currentPageNo, pageCount)
  const columns = [
    { label: 'ID', sort: (row) => row.id },
    { label: 'Task', sort: (row) => row.description },
    { label: 'Used By', sort: (row) => row.usageCount },
    { label: 'Status', sort: (row) => row.status },
    'Actions',
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('')
    setPage(1)
  }

  const replaceTask = (saved) => setTasks((list) => list.map((task) => (task.id === saved.id ? saved : task)))

  const handleSaved = useCallback((saved, wasEdit) => {
    if (wasEdit) {
      setTasks((list) => list.map((task) => (task.id === saved.id ? saved : task)))
      setEditing(null)
    } else {
      setTasks((list) => [...list, saved])
      setPage(1) // a new row is on top of page 1
    }
  }, [])

  const inUse = Boolean(pendingDelete?.usageCount)
  const canDeactivate = inUse && pendingDelete?.status !== TASK_STATUS.INACTIVE

  // Delete, or for a task in use: make it inactive (or just close when it already is)
  const confirmPending = async () => {
    if (inUse && !canDeactivate) {
      setPendingDelete(null)
      return
    }
    setBusy(true)
    try {
      if (canDeactivate) {
        const saved = await updateMaintenanceTask(pendingDelete.id, { description: pendingDelete.description, status: TASK_STATUS.INACTIVE })
        replaceTask(saved)
        toast.success(`${saved.description} is inactive and no longer offered for new operator tasks.`, { title: 'Task made inactive' })
      } else {
        await deleteMaintenanceTask(pendingDelete.id)
        setTasks((list) => list.filter((task) => task.id !== pendingDelete.id))
        toast.success(`${pendingDelete.description} has been deleted.`, { title: 'Task deleted' })
      }
      if (editing?.id === pendingDelete.id) setEditing(null)
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: canDeactivate ? 'Could not update task' : 'Could not delete task' })
    } finally {
      setBusy(false)
    }
  }

  const deleteModalText = () => {
    if (!pendingDelete) return ''
    if (!inUse) return `${pendingDelete.description} will be removed from the task list.`
    const used = `${pendingDelete.description} is used by ${usageLabel(pendingDelete.usageCount).toLowerCase()}, so it cannot be deleted.`
    return canDeactivate
      ? `${used} Make it inactive instead: it stays on those operator tasks but is no longer offered for new ones.`
      : `${used} It is already inactive. Remove it from those operator tasks first to delete it.`
  }

  const renderList = () => {
    if (loading) return <Loader text="Loading tasks…" />
    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load tasks.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }
    if (!tasks.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-list-check ts-empty-icon" aria-hidden="true" />
          <p className="mb-0">No tasks yet. Add the first one with the form.</p>
        </div>
      )
    }
    return (
      <>
        <div className="ts-toolbar">
          <InputGroup className="flex-grow-1 w-auto">
            <Form.Control
              type="search"
              placeholder="Search ID, task…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search tasks"
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
          <Form.Select
            className="w-auto"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value)
              setPage(1)
            }}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            <option value={TASK_STATUS.ACTIVE}>Active</option>
            <option value={TASK_STATUS.INACTIVE}>Inactive</option>
          </Form.Select>
        </div>

        <div className="ts-table-panel">
          <Table hover responsive className="mb-0">
            <SortableHead columns={columns} sort={sort} onSort={onSort} />
            <tbody>
              {pageRows.map((task) => (
                <TaskListRow key={task.id} task={task} isEditing={editing?.id === task.id} onEdit={setEditing} onDelete={setPendingDelete} />
              ))}
              {!pageRows.length && <TableNoResults colSpan={columns.length} message="No tasks match these filters." onClear={clearFilters} />}
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
          <h2 className="ts-section-title">Task List</h2>
          <p className="ts-note mb-0">The tasks Operator Tasks picks from, shared by every customer.</p>
        </div>
      </div>

      <Row className="g-3">
        <Col lg={5} xl={4} xxl={3}>
          <TaskListEditor editing={editing} onSaved={handleSaved} onCancel={() => setEditing(null)} />
        </Col>
        <Col lg={7} xl={8} xxl={9}>
          <Card>
            <Card.Body>{renderList()}</Card.Body>
          </Card>
        </Col>
      </Row>

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title={inUse ? 'Task is in use' : 'Delete task?'}
        confirmLabel={inUse ? (canDeactivate ? 'Make inactive' : 'OK') : 'Delete'}
        confirmVariant={inUse ? 'primary' : 'danger'}
        busy={busy}
        onConfirm={confirmPending}
        onCancel={() => setPendingDelete(null)}
      >
        {deleteModalText()}
      </ConfirmModal>
    </>
  )
}

export default TaskList
