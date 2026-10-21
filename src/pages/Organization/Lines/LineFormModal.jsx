import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@/i18n/zodResolver'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { createUserLine, updateUserLine } from '@/services/userLineService'
import OrgCustomerField from '@/components/common/OrgCustomerField'
import useOrgUser from '@/hooks/useOrgUser'
import { ownedBy, ownerOf, withCustomer } from '@/utils/orgCustomer'
import { toast } from '@/utils/toast'
import { INITIAL_VALUES, NAME_MAX_LENGTH, lineSchema, toLinePayload, toFormValues } from './lineForm'
import { useTranslation } from 'react-i18next'

// Add / edit a line: its shop and name. `line` = the line being edited, null when adding.
function LineFormModal({ show, line, shops, defaultShopId, onSaved, onHide }) {
  const { t } = useTranslation()
  const isEdit = Boolean(line)

  // The superadmin picks the customer on the form; others always save to their own company
  const { canPickUser, userId } = useOrgUser()
  const schema = useMemo(() => withCustomer(lineSchema, canPickUser), [canPickUser])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: INITIAL_VALUES,
  })

  // Fresh values every time the modal opens
  useEffect(() => {
    if (!show) return
    reset(
      line
        ? { ...toFormValues(line), customerId: String(line.userId) }
        : { ...INITIAL_VALUES, customerId: ownerOf(shops, defaultShopId, 'userId'), userShopId: defaultShopId },
    )
  }, [show, line, defaultShopId, shops, reset])

  // Parents of the picked customer only; a new customer clears the picked parent
  const customerId = watch('customerId')
  const parentOptions = useMemo(() => ownedBy(shops, canPickUser, customerId, 'userId'), [shops, canPickUser, customerId])

  const onSubmit = async (values) => {
    try {
      const ownerId = canPickUser ? values.customerId : userId
      const payload = toLinePayload(values)
      const saved = isEdit ? await updateUserLine(line.id, payload, ownerId) : await createUserLine(payload, ownerId)
      toast.success(isEdit ? t('{{name}} has been updated.', { name: saved.name }) : t('{{name}} has been added.', { name: saved.name }), {
        title: isEdit ? t('Line updated') : t('Line added'),
      })
      onSaved(saved)
    } catch (error) {
      toast.error(error.message, { title: t('Could not save line') })
    }
  }

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? t('Edit line') : t('Add line')}>
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>{isEdit ? t('Edit Line') : t('Add Line')}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <OrgCustomerField
            id="line-customer"
            registration={register('customerId', { onChange: () => setValue('userShopId', '') })}
            locked={isEdit}
            disabled={isSubmitting}
            error={errors.customerId?.message}
          />
          <Form.Group controlId="line-shop" className="mb-3">
            <Form.Label className="required">{t('Shop')}</Form.Label>
            <Form.Select {...register('userShopId')} isInvalid={Boolean(errors.userShopId)}>
              <option value="">{t('Select shop')}</option>
              {parentOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.locationName ? `${option.name} · ${option.locationName}` : option.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.userShopId?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="line-name">
            <Form.Label className="required">{t('Line Name')}</Form.Label>
            <Form.Control {...register('name')} maxLength={NAME_MAX_LENGTH} autoComplete="off" autoFocus isInvalid={Boolean(errors.name)} />
            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
          </Form.Group>
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
                {isEdit ? t('Update') : t('Save')}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

const recordShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
})

LineFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  line: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    userShopId: PropTypes.number,
  }),
  shops: PropTypes.arrayOf(recordShape).isRequired,
  defaultShopId: PropTypes.string,
  onSaved: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default LineFormModal
