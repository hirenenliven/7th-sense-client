import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@/i18n/zodResolver'
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Trans, useTranslation } from 'react-i18next'
import { CUSTOMER_ROLE_ID, ROLES, SUPERADMIN_ONLY } from '@/constants/app'
import { getUsers } from '@/services/customerService'
import useAuth from '@/hooks/useAuth'
import i18n from '@/i18n'
import { toast } from '@/utils/toast'
import FieldLabel from '@/components/common/FieldLabel'
import Loader from '@/components/common/Loader'
import StatusToggle from '@/components/common/StatusToggle'
import { customerName } from '@/pages/Customers/customerFormat'
import { INITIAL_VALUES, MAX_LENGTH, REASON_STATUS, reasonSchema, toFormValues, toReasonPayload } from './reasonForm'
import { FIELD_HELP } from './reasonHelp'
import { REASON_PAGES } from './reasonPages'

// Add / Edit Downtime or Idle Reason modal (managers only): adds one, or edits `reason` (the list
// row, which carries every field). The superadmin picks the customer; a customer or admin always
// adds to their own company (the server enforces it).
function ReasonFormModal({ kind, show, reason = null, onSaved, onHide }) {
  const page = REASON_PAGES[kind]
  const { t } = useTranslation()
  const isEdit = Boolean(reason)
  const { user, hasRole } = useAuth()
  const canPickCustomer = hasRole(SUPERADMIN_ONLY)
  const ownCompanyId = user?.role === ROLES.CUSTOMER ? user.id : user?.companyId
  const emptyValues = canPickCustomer ? INITIAL_VALUES : { ...INITIAL_VALUES, userId: ownCompanyId ? String(ownCompanyId) : '' }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(reasonSchema), defaultValues: emptyValues })

  // Superadmin: the customers to pick from, loaded the first time the modal opens
  const [customers, setCustomers] = useState({ items: [], loaded: false })
  const customersRequested = useRef(false)
  useEffect(() => {
    if (!show || !canPickCustomer || customersRequested.current) return
    customersRequested.current = true
    getUsers()
      .then((users) => setCustomers({ items: users.filter((option) => option.roleId === CUSTOMER_ROLE_ID), loaded: true }))
      .catch((error) => {
        setCustomers({ items: [], loaded: true })
        toast.error(error.message, { title: i18n.t('Could not load customers') })
      })
  }, [show, canPickCustomer])

  // The customer select gets its saved value only when its options exist: wait for them
  const ready = !canPickCustomer || customers.loaded

  // Every open starts fresh: an empty form, or the row loaded into it
  useEffect(() => {
    if (!show || !ready) return
    reset(reason ? toFormValues(reason) : emptyValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- emptyValues is rebuilt every render
  }, [show, ready, reason, reset])

  const onSubmit = async (values) => {
    try {
      const payload = toReasonPayload(values, isEdit)
      if (isEdit) {
        await page.update(reason.id, payload)
        toast.success(t('{{name}} has been updated.', { name: payload.reason }), { title: t(page.text.updated) })
      } else {
        await page.create(payload)
        toast.success(t('{{name}} has been added.', { name: payload.reason }), { title: t(page.text.created) })
      }
      onSaved()
    } catch (error) {
      toast.error(error.message, { title: t(page.text.saveFailed) })
    }
  }

  const renderFields = () => (
    <Row className="g-3">
      {canPickCustomer && (
        <Form.Group as={Col} xs={12} controlId={`${kind}-reason-userId`}>
          <FieldLabel required help={FIELD_HELP.userId}>
            {t('Customer Name')}
          </FieldLabel>
          <Form.Select {...register('userId')} isInvalid={Boolean(errors.userId)}>
            <option value="">{customers.items.length ? t('Select Customer') : t('No customers yet')}</option>
            {customers.items.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customerName(customer) === '—' ? customer.username : `${customerName(customer)} (${customer.username})`}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errors.userId?.message}</Form.Control.Feedback>
        </Form.Group>
      )}

      <Form.Group as={Col} xs={12} controlId={`${kind}-reason-reasonCode`}>
        <FieldLabel help={FIELD_HELP.reasonCode}>{t('Reason Code')}</FieldLabel>
        <Form.Control
          {...register('reasonCode')}
          autoComplete="off"
          maxLength={MAX_LENGTH.reasonCode}
          isInvalid={Boolean(errors.reasonCode)}
        />
        <Form.Control.Feedback type="invalid">{errors.reasonCode?.message}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group as={Col} xs={12} controlId={`${kind}-reason-reason`}>
        <Form.Label className="required">{t('Reason')}</Form.Label>
        <Form.Control {...register('reason')} autoComplete="off" maxLength={MAX_LENGTH.reason} isInvalid={Boolean(errors.reason)} />
        <Form.Control.Feedback type="invalid">{errors.reason?.message}</Form.Control.Feedback>
      </Form.Group>

      {isEdit && (
        <Form.Group as={Col} xs={12}>
          <Form.Label className="required">{t('Status')}</Form.Label>
          <StatusToggle
            id={`${kind}-reason-status`}
            {...register('status')}
            activeValue={REASON_STATUS.ACTIVE}
            inactiveValue={REASON_STATUS.INACTIVE}
          />
        </Form.Group>
      )}
    </Row>
  )

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered scrollable backdrop={isSubmitting ? 'static' : true}>
      <Form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        aria-label={isEdit ? t(page.text.edit) : t(page.text.add)}
        className="ts-modal-form"
      >
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>{isEdit ? t(page.text.edit) : t(page.text.add)}</Modal.Title>
        </Modal.Header>

        <Modal.Body>{ready ? renderFields() : <Loader text={t('Loading options…')} />}</Modal.Body>

        <Modal.Footer>
          <span className="me-auto small text-body-secondary">
            <Trans i18nKey="Fields marked <r>*</r> are required." components={{ r: <span className="text-danger" /> }} />
          </span>
          <Button variant="ghost" onClick={onHide} disabled={isSubmitting}>
            {t('Cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting || !ready}>
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" />
                {t('Saving…')}
              </>
            ) : (
              <>
                <i className="bi bi-check2 me-2" aria-hidden="true" />
                {isEdit ? t('Update') : t('Save')}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

ReasonFormModal.propTypes = {
  kind: PropTypes.oneOf(Object.keys(REASON_PAGES)).isRequired,
  show: PropTypes.bool.isRequired,
  reason: PropTypes.shape({
    id: PropTypes.number.isRequired,
    userId: PropTypes.number,
    reasonCode: PropTypes.string,
    reason: PropTypes.string,
    status: PropTypes.string,
  }),
  onSaved: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default ReasonFormModal
