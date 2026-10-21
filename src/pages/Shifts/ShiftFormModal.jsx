import { useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@/i18n/zodResolver'
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { SHIFT_STATUS, SHIFT_TYPES, WEEKDAYS } from '@/constants/shifts'
import { ACTION_ICONS } from '@/constants/icons'
import { ROUTES } from '@/constants/routes'
import { getBreaks } from '@/services/breakService'
import { createShift, updateShift } from '@/services/shiftService'
import { formatClock12, formatHoursMinutes, minutesBetween } from '@/utils/dateTime'
import i18n from '@/i18n'
import { toast } from '@/utils/toast'
import FieldLabel from '@/components/common/FieldLabel'
import IconAction from '@/components/common/IconAction'
import TimePicker from '@/components/common/TimePicker'
import StatusToggle from '@/components/common/StatusToggle'
import { customerName } from '@/pages/Customers/customerFormat'
import { EMPTY_BREAK_ROW, INITIAL_VALUES, MAX_BREAKS, MAX_LENGTH, shiftSchema, toFormValues, toShiftPayload } from './shiftForm'
import { FIELD_HELP } from './shiftHelp'
import { Trans, useTranslation } from 'react-i18next'

const breakTime = (shiftBreak) => (shiftBreak ? `${formatClock12(shiftBreak.startTime)} to ${formatClock12(shiftBreak.endTime)}` : '')

// Add / Edit Shift modal: adds a shift, or edits `shift` (a list row; it carries its breaks).
// The superadmin picks the customer; a customer or admin always saves to their own company.
// Breaks are picked from the customer's breaks (Masters › Shifts › Breaks).
function ShiftFormModal({ show, shift, customers, canPickCustomer, ownCompanyId, onSaved, onHide }) {
  const { t } = useTranslation()
  const isEdit = Boolean(shift)
  const emptyValues = canPickCustomer ? INITIAL_VALUES : { ...INITIAL_VALUES, userId: ownCompanyId ? String(ownCompanyId) : '' }

  // The customer's breaks: the options of "Shift Break Type" and what the schema checks the picks against
  const [breaks, setBreaks] = useState({ items: [], loading: false })
  const breaksById = useMemo(() => new Map(breaks.items.map((shiftBreak) => [shiftBreak.id, shiftBreak])), [breaks.items])
  const schema = useMemo(() => shiftSchema(breaksById), [breaksById])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: emptyValues })
  const { fields, append, remove } = useFieldArray({ control, name: 'breaks' })
  const [userId, startTime, endTime, breakRows] = useWatch({ control, name: ['userId', 'startTime', 'endTime', 'breaks'] })

  // A break belongs to one shift: offer the breaks no shift takes and this shift's own. Reloaded each
  // time the modal opens, so breaks given to another shift meanwhile are not offered.
  const editedShiftId = shift?.id
  useEffect(() => {
    if (!show || !userId) {
      setBreaks({ items: [], loading: false })
      return undefined
    }
    let active = true
    setBreaks((previous) => ({ ...previous, loading: true }))
    getBreaks(canPickCustomer ? userId : undefined)
      .then(
        (list) =>
          active &&
          setBreaks({ items: list.filter((option) => !option.shiftId || option.shiftId === editedShiftId), loading: false }),
      )
      .catch((error) => {
        if (!active) return
        setBreaks({ items: [], loading: false })
        toast.error(error.message, { title: i18n.t('Could not load breaks') })
      })
    return () => {
      active = false
    }
  }, [show, userId, canPickCustomer, editedShiftId])

  // Fresh values every time the modal opens: the shift being edited, or an empty form
  useEffect(() => {
    if (show) reset(shift ? toFormValues(shift) : emptyValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- emptyValues is rebuilt every render
  }, [show, shift, reset])

  const onSubmit = async (values) => {
    try {
      const payload = toShiftPayload(values, isEdit)
      const saved = isEdit ? await updateShift(shift.id, payload) : await createShift(payload)
      toast.success(isEdit ? t('{{name}} has been updated.', { name: payload.name }) : t('{{name}} has been added.', { name: payload.name }), {
        title: isEdit ? t('Shift updated') : t('Shift created'),
      })
      onSaved(saved, isEdit)
    } catch (error) {
      toast.error(error.message, { title: t('Could not save shift') })
    }
  }

  const shiftLength = startTime && endTime && startTime !== endTime ? minutesBetween(startTime, endTime) : null

  return (
    <Modal
      show={show}
      onHide={isSubmitting ? undefined : onHide}
      size="lg"
      centered
      scrollable
      backdrop={isSubmitting ? 'static' : true}
    >
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? t('Edit shift') : t('Add shift')} className="ts-modal-form">
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>{isEdit ? `Edit Shift · ${shift.name}` : 'Add Shift'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="g-3">
            {canPickCustomer && (
              <Form.Group as={Col} xs={12} controlId="shift-userId">
                <FieldLabel required help={FIELD_HELP.userId}>
                  {t('Customer Name')}
                </FieldLabel>
                {/* Breaks belong to one customer: a new customer starts with none picked */}
                <Form.Select {...register('userId', { onChange: () => setValue('breaks', []) })} isInvalid={Boolean(errors.userId)}>
                  <option value="">{customers.length ? t('Select Customer') : t('No customers yet')}</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customerName(customer) === '—' ? customer.username : `${customerName(customer)} (${customer.username})`}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.userId?.message}</Form.Control.Feedback>
              </Form.Group>
            )}

            <Form.Group as={Col} md={6} controlId="shift-name">
              <Form.Label className="required">{t('Shift Name')}</Form.Label>
              <Form.Control {...register('name')} autoComplete="off" maxLength={MAX_LENGTH.name} placeholder="A" isInvalid={Boolean(errors.name)} />
              <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={6} controlId="shift-shiftType">
              <Form.Label className="required">{t('Shift Type')}</Form.Label>
              <Form.Select {...register('shiftType')} isInvalid={Boolean(errors.shiftType)}>
                <option value="">{t('Select Shift Type')}</option>
                {SHIFT_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.shiftType?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} sm={6} controlId="shift-startTime">
              <FieldLabel required help={FIELD_HELP.times}>
                {t('Shift Start Time')}
              </FieldLabel>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => <TimePicker {...field} id="shift-startTime" isInvalid={Boolean(errors.startTime)} />}
              />
              {errors.startTime && <div className="invalid-feedback d-block">{errors.startTime.message}</div>}
            </Form.Group>

            <Form.Group as={Col} sm={6} controlId="shift-endTime">
              <Form.Label className="required">{t('Shift End Time')}</Form.Label>
              <Controller
                name="endTime"
                control={control}
                render={({ field }) => <TimePicker {...field} id="shift-endTime" isInvalid={Boolean(errors.endTime)} />}
              />
              {errors.endTime && <div className="invalid-feedback d-block">{errors.endTime.message}</div>}
              {shiftLength !== null && (
                <Form.Text>
                  {formatHoursMinutes(shiftLength)} hours{endTime < startTime ? ' · ends next day' : ''}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group as={Col} xs={12}>
              <FieldLabel required help={FIELD_HELP.workingDays}>
                {t('Working Days')}
              </FieldLabel>
              <Controller
                name="workingDays"
                control={control}
                render={({ field }) => (
                  <div className="ts-radio-group" role="group" aria-label={t('Working days')}>
                    {WEEKDAYS.map((day) => (
                      <Form.Check
                        key={day.id}
                        inline
                        type="checkbox"
                        id={`shift-day-${day.id}`}
                        label={t(day.label)}
                        checked={field.value.includes(day.id)}
                        isInvalid={Boolean(errors.workingDays)}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? [...field.value, day.id] : field.value.filter((id) => id !== day.id))
                        }
                      />
                    ))}
                  </div>
                )}
              />
              {errors.workingDays && <div className="invalid-feedback d-block">{errors.workingDays.message}</div>}
            </Form.Group>

            {isEdit && (
              <Form.Group as={Col} md={6}>
                <Form.Label className="required">{t('Status')}</Form.Label>
                <StatusToggle
                  id="shift-status"
                  {...register('status')}
                  activeValue={SHIFT_STATUS.ACTIVE}
                  inactiveValue={SHIFT_STATUS.INACTIVE}
                />
              </Form.Group>
            )}
          </Row>

          {/* Breaks this shift takes: the customer's breaks */}
          <div className="ts-shift-breaks">
            {fields.length > 0 && (
              <Row className="g-2 mb-1" aria-hidden="true">
                <Col xs={6}>
                  <FieldLabel help={FIELD_HELP.breaks}>{t('Shift Break Type')}</FieldLabel>
                </Col>
                <Col xs={5}>
                  <Form.Label className="mb-0">{t('Break Time')}</Form.Label>
                </Col>
              </Row>
            )}
            {fields.map((field, index) => {
              const rowError = errors.breaks?.[index]?.breakId
              const picked = breaksById.get(Number(breakRows?.[index]?.breakId))
              return (
                <Row key={field.id} className="g-2 align-items-start mb-2">
                  <Col xs={6}>
                    {/* Controlled: the options load after the customer is known */}
                    <Controller
                      name={`breaks.${index}.breakId`}
                      control={control}
                      render={({ field: selectField }) => (
                        <Form.Select
                          {...selectField}
                          aria-label={t('Break {{n}}', { n: index + 1 })}
                          disabled={!userId || breaks.loading}
                          isInvalid={Boolean(rowError)}
                        >
                          <option value="">{breaks.loading ? t('Loading breaks…') : t('Select Shift Break')}</option>
                          {breaks.items.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </Form.Select>
                      )}
                    />
                    {rowError && <div className="invalid-feedback d-block">{rowError.message}</div>}
                  </Col>
                  <Col xs={5}>
                    <Form.Control value={breakTime(picked)} readOnly tabIndex={-1} aria-label={t('Break {{n}} time', { n: index + 1 })} />
                  </Col>
                  <Col xs={1} className="d-flex justify-content-end">
                    <IconAction danger icon={ACTION_ICONS.remove} label={t('Remove break {{n}}', { n: index + 1 })} onClick={() => remove(index)} />
                  </Col>
                </Row>
              )
            })}
            {userId && !breaks.loading && !breaks.items.length ? (
              <p className="small text-body-secondary mb-0">
                <Trans
                  i18nKey="No free breaks for this customer: each break belongs to one shift. Add more in <l>Breaks</l>."
                  components={{ l: <Link to={ROUTES.BREAKS} /> }}
                />
              </p>
            ) : (
              <Button
                size="sm"
                onClick={() => append({ ...EMPTY_BREAK_ROW })}
                disabled={!userId || fields.length >= MAX_BREAKS || fields.length >= breaks.items.length}
              >
                <i className="bi bi-plus-lg me-1" aria-hidden="true" />
                {fields.length ? t('Add More Breaks') : t('Add Break')}
              </Button>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="ghost" onClick={onHide} disabled={isSubmitting}>
            {t('Cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" />
                {t('Saving…')}
              </>
            ) : (
              <>
                <i className="bi bi-check2 me-2" aria-hidden="true" />
                {isEdit ? t('Update Shift') : t('Save Shift')}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

ShiftFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  shift: PropTypes.object,
  customers: PropTypes.array.isRequired,
  canPickCustomer: PropTypes.bool.isRequired,
  ownCompanyId: PropTypes.number,
  onSaved: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default ShiftFormModal
