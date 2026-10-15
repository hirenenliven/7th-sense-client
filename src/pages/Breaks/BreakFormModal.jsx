import { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { BREAK_NAME_SUGGESTIONS, SHIFT_STATUS } from '@/constants/shifts'
import { createBreak, updateBreak } from '@/services/breakService'
import { getShifts } from '@/services/shiftService'
import { formatClock12, minutesBetween } from '@/utils/dateTime'
import { toast } from '@/utils/toast'
import FieldLabel from '@/components/common/FieldLabel'
import TimePicker from '@/components/common/TimePicker'
import StatusToggle from '@/components/common/StatusToggle'
import { customerName } from '@/pages/Customers/customerFormat'
import { INITIAL_VALUES, MAX_LENGTH, breakSchema, toBreakPayload, toFormValues } from './breakForm'
import { FIELD_HELP } from './breakHelp'

const NAME_SUGGESTIONS_ID = 'break-name-suggestions'

// Add / Edit Break modal: adds a break, or edits `shiftBreak` (a list row). The superadmin picks the
// customer; a customer or admin always saves to their own company. The shift is optional: one of
// the customer's shifts, or none (picked later on Add / Manage Shift).
function BreakFormModal({ show, shiftBreak, customers, canPickCustomer, ownCompanyId, onSaved, onHide }) {
  const isEdit = Boolean(shiftBreak)
  const emptyValues = canPickCustomer ? INITIAL_VALUES : { ...INITIAL_VALUES, userId: ownCompanyId ? String(ownCompanyId) : '' }

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(breakSchema), defaultValues: emptyValues })
  const [userId, startTime, endTime] = useWatch({ control, name: ['userId', 'startTime', 'endTime'] })

  // The customer's shifts, for the Shift select
  const [shifts, setShifts] = useState({ items: [], loading: false })
  useEffect(() => {
    if (!userId) {
      setShifts({ items: [], loading: false })
      return undefined
    }
    let active = true
    setShifts((previous) => ({ ...previous, loading: true }))
    getShifts(canPickCustomer ? userId : undefined)
      .then((list) => active && setShifts({ items: list, loading: false }))
      .catch((error) => {
        if (!active) return
        setShifts({ items: [], loading: false })
        toast.error(error.message, { title: 'Could not load shifts' })
      })
    return () => {
      active = false
    }
  }, [userId, canPickCustomer])

  let shiftPlaceholder = 'No shift (pick it later)'
  if (!userId) shiftPlaceholder = 'Select a customer first'
  else if (shifts.loading) shiftPlaceholder = 'Loading shifts…'

  // Fresh values every time the modal opens: the row being edited, or an empty form
  useEffect(() => {
    if (show) reset(shiftBreak ? toFormValues(shiftBreak) : emptyValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- emptyValues is rebuilt every render
  }, [show, shiftBreak, reset])

  const onSubmit = async (values) => {
    try {
      const payload = toBreakPayload(values, isEdit)
      const saved = isEdit ? await updateBreak(shiftBreak.id, payload) : await createBreak(payload)
      toast.success(`${payload.name} has been ${isEdit ? 'updated' : 'added'}.`, { title: isEdit ? 'Break updated' : 'Break created' })
      onSaved(saved, isEdit)
    } catch (error) {
      toast.error(error.message, { title: 'Could not save break' })
    }
  }

  const length = startTime && endTime && startTime !== endTime ? minutesBetween(startTime, endTime) : null

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? 'Edit break' : 'Add break'}>
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>{isEdit ? `Edit Break · ${shiftBreak.name}` : 'Add Break'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="g-3">
            {canPickCustomer && (
              <Form.Group as={Col} xs={12} controlId="break-userId">
                <FieldLabel required help={FIELD_HELP.userId}>
                  Customer Name
                </FieldLabel>
                {/* Shifts belong to one customer: a new customer starts with none picked */}
                <Form.Select {...register('userId', { onChange: () => setValue('shiftId', '') })} isInvalid={Boolean(errors.userId)}>
                  <option value="">{customers.length ? 'Select Customer' : 'No customers yet'}</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customerName(customer) === '—' ? customer.username : `${customerName(customer)} (${customer.username})`}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.userId?.message}</Form.Control.Feedback>
              </Form.Group>
            )}

            <Form.Group as={Col} xs={12} controlId="break-shiftId">
              <FieldLabel help={FIELD_HELP.shiftId}>Shift</FieldLabel>
              {/* Controlled: the options load after the customer is known */}
              <Controller
                name="shiftId"
                control={control}
                render={({ field }) => (
                  <Form.Select {...field} disabled={!userId || shifts.loading} isInvalid={Boolean(errors.shiftId)}>
                    <option value="">{shiftPlaceholder}</option>
                    {shifts.items.map((shift) => (
                      <option key={shift.id} value={shift.id}>
                        {`${shift.name} · ${formatClock12(shift.startTime)} to ${formatClock12(shift.endTime)}`}
                      </option>
                    ))}
                  </Form.Select>
                )}
              />
              <Form.Control.Feedback type="invalid">{errors.shiftId?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} xs={12} controlId="break-name">
              <Form.Label className="required">Break Name</Form.Label>
              <Form.Control
                {...register('name')}
                list={NAME_SUGGESTIONS_ID}
                autoComplete="off"
                maxLength={MAX_LENGTH.name}
                placeholder="Lunch"
                isInvalid={Boolean(errors.name)}
              />
              <datalist id={NAME_SUGGESTIONS_ID}>
                {BREAK_NAME_SUGGESTIONS.map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
              <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} sm={6} controlId="break-startTime">
              <FieldLabel required help={FIELD_HELP.times}>
                Start Time
              </FieldLabel>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => <TimePicker {...field} id="break-startTime" isInvalid={Boolean(errors.startTime)} />}
              />
              {errors.startTime && <div className="invalid-feedback d-block">{errors.startTime.message}</div>}
            </Form.Group>

            <Form.Group as={Col} sm={6} controlId="break-endTime">
              <Form.Label className="required">End Time</Form.Label>
              <Controller
                name="endTime"
                control={control}
                render={({ field }) => <TimePicker {...field} id="break-endTime" isInvalid={Boolean(errors.endTime)} />}
              />
              {errors.endTime && <div className="invalid-feedback d-block">{errors.endTime.message}</div>}
              {length !== null && (
                <Form.Text>
                  {length} min{endTime < startTime ? ' · ends next day' : ''}
                </Form.Text>
              )}
            </Form.Group>

            {isEdit && (
              <Form.Group as={Col} xs={12}>
                <Form.Label className="required">Status</Form.Label>
                <StatusToggle
                  id="break-status"
                  {...register('status')}
                  activeValue={SHIFT_STATUS.ACTIVE}
                  inactiveValue={SHIFT_STATUS.INACTIVE}
                />
              </Form.Group>
            )}
          </Row>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="ghost" onClick={onHide} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" />
                Saving…
              </>
            ) : (
              <>
                <i className="bi bi-check2 me-2" aria-hidden="true" />
                {isEdit ? 'Update Break' : 'Save Break'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

BreakFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  shiftBreak: PropTypes.object,
  customers: PropTypes.array.isRequired,
  canPickCustomer: PropTypes.bool.isRequired,
  ownCompanyId: PropTypes.number,
  onSaved: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default BreakFormModal
