import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@/i18n/zodResolver'
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { HOLIDAY_TYPES, SHIFT_STATUS, WEEKDAYS } from '@/constants/shifts'
import { createHoliday, updateHoliday } from '@/services/holidayService'
import { toast } from '@/utils/toast'
import DatePicker from '@/components/common/DatePicker'
import FieldLabel from '@/components/common/FieldLabel'
import StatusToggle from '@/components/common/StatusToggle'
import { customerName } from '@/pages/Customers/customerFormat'
import { INITIAL_VALUES, MAX_LENGTH, holidaySchema, toFormValues, toHolidayPayload } from './holidayForm'
import { FIELD_HELP } from './holidayHelp'
import { useTranslation } from 'react-i18next'
import { tk } from '@/i18n/tk'

const KINDS = [
  { value: HOLIDAY_TYPES.HOLIDAY, label: tk('Holiday') },
  { value: HOLIDAY_TYPES.WEEK_OFF, label: tk('Week Off') },
]

// Whole sentences per kind (languages with grammatical gender cannot build them from one noun)
const KIND_TEXT = {
  [HOLIDAY_TYPES.HOLIDAY]: {
    added: tk('Holiday has been added.'),
    updated: tk('Holiday has been updated.'),
    createdTitle: tk('Holiday created'),
    updatedTitle: tk('Holiday updated'),
    saveFailed: tk('Could not save holiday'),
    add: tk('Add Holiday'),
    edit: tk('Edit Holiday'),
    save: tk('Save Holiday'),
    update: tk('Update Holiday'),
  },
  [HOLIDAY_TYPES.WEEK_OFF]: {
    added: tk('Week off has been added.'),
    updated: tk('Week off has been updated.'),
    createdTitle: tk('Week off created'),
    updatedTitle: tk('Week off updated'),
    saveFailed: tk('Could not save week off'),
    add: tk('Add Week Off'),
    edit: tk('Edit Week Off'),
    save: tk('Save Week Off'),
    update: tk('Update Week Off'),
  },
}

// Add / Edit Holiday or Week Off modal: adds one, or edits `holiday` (a list row). The superadmin picks the
// customer; a customer or admin always saves to their own company.
function HolidayFormModal({ show, holiday, customers, canPickCustomer, ownCompanyId, onSaved, onHide }) {
  const { t } = useTranslation()
  const isEdit = Boolean(holiday)
  const emptyValues = canPickCustomer ? INITIAL_VALUES : { ...INITIAL_VALUES, userId: ownCompanyId ? String(ownCompanyId) : '' }

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(holidaySchema), defaultValues: emptyValues })
  const [holidayType, startDate] = useWatch({ control, name: ['holidayType', 'startDate'] })
  const isWeekOff = holidayType === HOLIDAY_TYPES.WEEK_OFF
  const text = KIND_TEXT[isWeekOff ? HOLIDAY_TYPES.WEEK_OFF : HOLIDAY_TYPES.HOLIDAY]

  // Fresh values every time the modal opens: the row being edited, or an empty form
  useEffect(() => {
    if (show) reset(holiday ? toFormValues(holiday) : emptyValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- emptyValues is rebuilt every render
  }, [show, holiday, reset])

  const onSubmit = async (values) => {
    try {
      const payload = toHolidayPayload(values, isEdit)
      const saved = isEdit ? await updateHoliday(holiday.id, payload) : await createHoliday(payload)
      toast.success(t(isEdit ? text.updated : text.added), { title: t(isEdit ? text.updatedTitle : text.createdTitle) })
      onSaved(saved, isEdit)
    } catch (error) {
      toast.error(error.message, { title: t(text.saveFailed) })
    }
  }

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={t(isEdit ? text.edit : text.add)}>
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>{t(isEdit ? text.edit : text.add)}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="g-3">
            {canPickCustomer && (
              <Form.Group as={Col} xs={12} controlId="holiday-userId">
                <FieldLabel required help={FIELD_HELP.userId}>
                  {t('Customer Name')}
                </FieldLabel>
                <Form.Select {...register('userId')} isInvalid={Boolean(errors.userId)}>
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

            <Form.Group as={Col} xs={12}>
              <FieldLabel required help={FIELD_HELP.holidayType}>
                {t('Type')}
              </FieldLabel>
              <div role="radiogroup" className="ts-radio-group" aria-label={t('Holiday or week off')}>
                {KINDS.map((kind) => (
                  <Form.Check
                    key={kind.value}
                    inline
                    type="radio"
                    id={`holiday-type-${kind.value}`}
                    label={t(kind.label)}
                    value={kind.value}
                    {...register('holidayType')}
                  />
                ))}
              </div>
            </Form.Group>

            {isWeekOff ? (
              <>
                <Form.Group as={Col} sm={6} controlId="holiday-weekDay">
                  <Form.Label className="required">{t('Day')}</Form.Label>
                  <Form.Select {...register('weekDay')} isInvalid={Boolean(errors.weekDay)}>
                    <option value="">{t('Select Day')}</option>
                    {WEEKDAYS.map((day) => (
                      <option key={day.id} value={day.id}>
                        {t(day.label)}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.weekDay?.message}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} sm={6} controlId="holiday-name">
                  <Form.Label>{t('Name')}</Form.Label>
                  <Form.Control {...register('name')} autoComplete="off" maxLength={MAX_LENGTH.name} placeholder={t('Week off')} isInvalid={Boolean(errors.name)} />
                  <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                </Form.Group>
              </>
            ) : (
              <>
                <Form.Group as={Col} xs={12} controlId="holiday-name">
                  <Form.Label className="required">{t('Holiday Name')}</Form.Label>
                  <Form.Control {...register('name')} autoComplete="off" maxLength={MAX_LENGTH.name} placeholder={t('Diwali')} isInvalid={Boolean(errors.name)} />
                  <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} sm={6} controlId="holiday-startDate">
                  <Form.Label className="required">{t('Start Date')}</Form.Label>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => <DatePicker {...field} id="holiday-startDate" isInvalid={Boolean(errors.startDate)} />}
                  />
                  {errors.startDate && <div className="invalid-feedback d-block">{errors.startDate.message}</div>}
                </Form.Group>
                <Form.Group as={Col} sm={6} controlId="holiday-endDate">
                  <Form.Label className="required">{t('End Date')}</Form.Label>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker {...field} id="holiday-endDate" min={startDate || undefined} isInvalid={Boolean(errors.endDate)} />
                    )}
                  />
                  {errors.endDate && <div className="invalid-feedback d-block">{errors.endDate.message}</div>}
                </Form.Group>
              </>
            )}

            {isEdit && (
              <Form.Group as={Col} xs={12}>
                <Form.Label className="required">{t('Status')}</Form.Label>
                <StatusToggle
                  id="holiday-status"
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
                {t(isEdit ? text.update : text.save)}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

HolidayFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  holiday: PropTypes.object,
  customers: PropTypes.array.isRequired,
  canPickCustomer: PropTypes.bool.isRequired,
  ownCompanyId: PropTypes.number,
  onSaved: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default HolidayFormModal
