import { memo, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Col, Form, InputGroup, Modal, Row, Spinner, Table } from 'react-bootstrap'
import PropTypes from 'prop-types'
import ConfirmModal from '@/components/common/ConfirmModal'
import DatePicker from '@/components/common/DatePicker'
import IconAction from '@/components/common/IconAction'
import SortableHead from '@/components/common/SortableHead'
import TableNoResults from '@/components/common/TableNoResults'
import TablePagination from '@/components/common/TablePagination'
import TimePicker from '@/components/common/TimePicker'
import { PAGE_SIZES } from '@/constants/app'
import { ACTION_ICONS } from '@/constants/icons'
import useLoad from '@/hooks/useLoad'
import useTableSort from '@/hooks/useTableSort'
import { REASON_PAGES } from '@/pages/Reasons/reasonPages'
import {
  createMachineModeReason,
  deleteMachineModeReason,
  getMachineModeReasons,
  updateMachineModeReason,
} from '@/services/machineModeReasonService'
import { toast } from '@/utils/toast'
import {
  formatClock,
  formatDay,
  formatPeriod,
  modeReasonSchema,
  newFormValues,
  spansDays,
  toFormValues,
  toReasonPayload,
} from './modeReasonForm'

const REASON_ACTIVE = 'active'
const reasonLabel = ({ reasonCode, reason }) => (reasonCode ? `${reasonCode} - ${reason}` : reason)

// Update Downtime / Idle Reason popup of a finished Gantt bar. `loaded` is GET /machine-mode-reasons
// for the bar: the whole period (the bar may be clipped to the chart window), the list its reasons
// come from (reasonType, the machine's customer) and the reasons so far. A form adds one for all or
// a part of the period; the table below edits (loads the row into the form) and deletes them.
function ModeReasonModal({ loaded, onHide }) {
  const { period, reasonType, customerId } = loaded
  const page = REASON_PAGES[reasonType]
  const fieldLabel = page.singular.replace(' Reason', '')
  const multiDay = spansDays(period)

  const [reasons, setReasons] = useState(loaded.reasons)
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [currentPageNo, setPage] = useState(1)

  const master = useLoad(() => page.list(customerId ?? undefined), `${reasonType}|${customerId}`)
  // New picks come from the active reasons; a row being edited keeps the one it has, even if that
  // has since been made inactive or deleted
  const options = useMemo(() => {
    const active = (master.data ?? []).filter((reason) => reason.status === REASON_ACTIVE)
    const keepsOwn = editing && !active.some((reason) => reason.id === editing.reasonId)
    return keepsOwn ? [{ id: editing.reasonId, reasonCode: editing.reasonCode, reason: editing.reason }, ...active] : active
  }, [master.data, editing])

  const others = useMemo(() => reasons.filter((reason) => reason.id !== editing?.id), [reasons, editing])
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(modeReasonSchema(period, others)),
    defaultValues: newFormValues(period, loaded.reasons),
  })

  const reloadReasons = async () => {
    const fresh = await getMachineModeReasons(period.id)
    setReasons(fresh.reasons)
    return fresh.reasons
  }

  const startNew = (list) => {
    setEditing(null)
    reset(newFormValues(period, list))
  }

  const onSubmit = async (values) => {
    try {
      const payload = toReasonPayload(values, period)
      if (editing) await updateMachineModeReason(editing.id, payload)
      else await createMachineModeReason({ periodId: period.id, ...payload })
      toast.success(`${page.singular} has been ${editing ? 'updated' : 'added'}.`, { title: `${page.singular} saved` })
      startNew(await reloadReasons())
    } catch (error) {
      toast.error(error.message, { title: `Could not save ${page.noun}` })
    }
  }

  const handleEdit = (reason) => {
    setEditing(reason)
    reset(toFormValues(reason))
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteMachineModeReason(pendingDelete.id)
      toast.success(`${pendingDelete.reason} has been removed.`, { title: `${page.singular} deleted` })
      const list = await reloadReasons()
      if (editing?.id === pendingDelete.id) startNew(list)
      setPendingDelete(null)
    } catch (error) {
      toast.error(error.message, { title: `Could not delete ${page.noun}` })
    } finally {
      setDeleting(false)
    }
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return reasons
    return reasons.filter((reason) =>
      [reason.reasonCode, reason.reason, formatDay(reason.startedAt), formatClock(reason.startedAt), formatClock(reason.endedAt)].some(
        (value) => value.toLowerCase().includes(term),
      ),
    )
  }, [reasons, search])

  const columns = [
    'Sr. No.',
    { label: page.singular, sort: (row) => row.reason },
    { label: `${fieldLabel} Date`, sort: (row) => row.startedAt },
    { label: 'Start Time', sort: (row) => row.startedAt },
    { label: 'End Time', sort: (row) => row.endedAt },
    'Actions',
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(currentPageNo, pageCount)
  const firstRow = (currentPage - 1) * pageSize
  const pageRows = sortedRows.slice(firstRow, firstRow + pageSize)

  const renderPicker = (name, Picker, label, column) => (
    <Form.Group as={Col} xs={12} md={column}>
      <Form.Label htmlFor={`mode-reason-${name}`} className="required">
        {label}
      </Form.Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => <Picker {...field} id={`mode-reason-${name}`} isInvalid={Boolean(errors[name])} />}
      />
      {errors[name] && <div className="invalid-feedback d-block">{errors[name].message}</div>}
    </Form.Group>
  )

  const renderForm = () => (
    <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={`${editing ? 'Edit' : 'Add'} ${page.noun}`}>
      <Row className="g-3">
        {multiDay && renderPicker('startDate', DatePicker, `${fieldLabel} Start Date`, 3)}
        {renderPicker('startTime', TimePicker, `${fieldLabel} Start Time`, 3)}
        {multiDay && renderPicker('endDate', DatePicker, `${fieldLabel} End Date`, 3)}
        {renderPicker('endTime', TimePicker, `${fieldLabel} End Time`, 3)}
        <Form.Group as={Col} xs={12} md={multiDay ? 12 : 6} controlId="mode-reason-reasonId">
          <Form.Label className="required">{page.singular}</Form.Label>
          {/* Controlled: the options load after the popup opens */}
          <Controller
            name="reasonId"
            control={control}
            render={({ field }) => (
              <Form.Select {...field} isInvalid={Boolean(errors.reasonId)} disabled={master.loading}>
                <option value="">{master.loading ? 'Loading reasons…' : 'Select Reason'}</option>
                {options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {reasonLabel(option)}
                  </option>
                ))}
              </Form.Select>
            )}
          />
          <Form.Control.Feedback type="invalid">{errors.reasonId?.message}</Form.Control.Feedback>
          {master.error && <div className="invalid-feedback d-block">{master.error}</div>}
          {!master.loading && !master.error && !options.length && (
            <Form.Text>No {page.plural} yet: add them in Masters › Downtime.</Form.Text>
          )}
        </Form.Group>
      </Row>

      <div className="d-flex gap-2 mt-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" />
          ) : (
            <i className="bi bi-send me-2" aria-hidden="true" />
          )}
          {editing ? 'Update' : 'Submit'}
        </Button>
        {editing && (
          <Button variant="ghost" disabled={isSubmitting} onClick={() => startNew(reasons)}>
            Cancel
          </Button>
        )}
      </div>
    </Form>
  )

  const renderTable = () => {
    if (!reasons.length) {
      return (
        <div className="ts-empty">
          <i className={`bi ${page.icon} ts-empty-icon`} aria-hidden="true" />
          <p className="mb-0">No {page.plural} added for this period yet.</p>
        </div>
      )
    }
    return (
      <>
        <div className="ts-toolbar">
          <InputGroup className="flex-grow-1 w-auto">
            <Form.Control
              type="search"
              placeholder="Search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label={`Search ${page.plural}`}
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
              {pageRows.map((reason, index) => (
                <tr key={reason.id} className={editing?.id === reason.id ? 'table-active' : undefined}>
                  <td className="font-tabular">{firstRow + index + 1}</td>
                  <td className="fw-semibold">{reasonLabel(reason)}</td>
                  <td className="font-tabular text-nowrap">{formatDay(reason.startedAt)}</td>
                  <td className="font-tabular text-nowrap">{formatClock(reason.startedAt)}</td>
                  <td className="font-tabular text-nowrap">{formatClock(reason.endedAt)}</td>
                  <td className="border-start">
                    <div className="d-flex gap-1">
                      <IconAction icon={ACTION_ICONS.edit} label={`Edit ${reason.reason}`} onClick={() => handleEdit(reason)} />
                      <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${reason.reason}`} onClick={() => setPendingDelete(reason)} />
                    </div>
                  </td>
                </tr>
              ))}
              {!pageRows.length && (
                <TableNoResults colSpan={columns.length} message={`No ${page.plural} match this search.`} onClear={() => setSearch('')} />
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
      <Modal show size="lg" centered scrollable onHide={isSubmitting ? undefined : onHide} backdrop={isSubmitting ? 'static' : true}>
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title className="d-flex flex-wrap align-items-center gap-3">
            Update {page.singular}
            <small className="fs-6 fw-normal text-body-secondary font-tabular">
              <i className="bi bi-clock text-primary me-2" aria-hidden="true" />
              {formatPeriod(period)}
            </small>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column gap-4">
          {renderForm()}
          <div>{renderTable()}</div>
        </Modal.Body>
      </Modal>

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title={`Delete ${page.noun}`}
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        Delete <strong>{pendingDelete?.reason}</strong>
        {pendingDelete ? ` (${formatClock(pendingDelete.startedAt)} — ${formatClock(pendingDelete.endedAt)})` : ''}?
      </ConfirmModal>
    </>
  )
}

ModeReasonModal.propTypes = {
  loaded: PropTypes.shape({
    period: PropTypes.shape({
      id: PropTypes.number.isRequired,
      startedAt: PropTypes.string.isRequired,
      endedAt: PropTypes.string.isRequired,
    }).isRequired,
    reasonType: PropTypes.oneOf(Object.keys(REASON_PAGES)).isRequired,
    customerId: PropTypes.number,
    reasons: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  onHide: PropTypes.func.isRequired,
}

export default memo(ModeReasonModal)
