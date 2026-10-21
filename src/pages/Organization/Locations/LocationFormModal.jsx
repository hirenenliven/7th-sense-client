import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@/i18n/zodResolver'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { createUserLocation, updateUserLocation } from '@/services/userLocationService'
import OrgCustomerField from '@/components/common/OrgCustomerField'
import useOrgUser from '@/hooks/useOrgUser'
import { ownedBy, ownerOf, withCustomer } from '@/utils/orgCustomer'
import { toast } from '@/utils/toast'
import { INITIAL_VALUES, NAME_MAX_LENGTH, locationSchema, toLocationPayload, toFormValues } from './locationForm'
import { useTranslation } from 'react-i18next'

// Add / edit a location: its branch and name. `location` = the location being edited, null when adding.
function LocationFormModal({ show, location, branches, defaultBranchId, onSaved, onHide }) {
  const { t } = useTranslation()
  const isEdit = Boolean(location)

  // The superadmin picks the customer on the form; others always save to their own company
  const { canPickUser, userId } = useOrgUser()
  const schema = useMemo(() => withCustomer(locationSchema, canPickUser), [canPickUser])

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
      location
        ? { ...toFormValues(location), customerId: String(location.userId) }
        : { ...INITIAL_VALUES, customerId: ownerOf(branches, defaultBranchId, 'customerId'), branchId: defaultBranchId },
    )
  }, [show, location, defaultBranchId, branches, reset])

  // Parents of the picked customer only; a new customer clears the picked parent
  const customerId = watch('customerId')
  const parentOptions = useMemo(() => ownedBy(branches, canPickUser, customerId, 'customerId'), [branches, canPickUser, customerId])

  const onSubmit = async (values) => {
    try {
      const ownerId = canPickUser ? values.customerId : userId
      const payload = toLocationPayload(values)
      const saved = isEdit ? await updateUserLocation(location.id, payload, ownerId) : await createUserLocation(payload, ownerId)
      toast.success(isEdit ? t('{{name}} has been updated.', { name: saved.name }) : t('{{name}} has been added.', { name: saved.name }), {
        title: isEdit ? t('Location updated') : t('Location added'),
      })
      onSaved(saved)
    } catch (error) {
      toast.error(error.message, { title: t('Could not save location') })
    }
  }

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? t('Edit location') : t('Add location')}>
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>{isEdit ? t('Edit Location') : t('Add Location')}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <OrgCustomerField
            id="location-customer"
            registration={register('customerId', { onChange: () => setValue('branchId', '') })}
            locked={isEdit}
            disabled={isSubmitting}
            error={errors.customerId?.message}
          />
          <Form.Group controlId="location-branch" className="mb-3">
            <Form.Label className="required">{t('Branch')}</Form.Label>
            <Form.Select {...register('branchId')} isInvalid={Boolean(errors.branchId)}>
              <option value="">{t('Select branch')}</option>
              {parentOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.city ? `${option.name} · ${option.city}` : option.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.branchId?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="location-name">
            <Form.Label className="required">{t('Location Name')}</Form.Label>
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

LocationFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    branchId: PropTypes.number,
  }),
  branches: PropTypes.arrayOf(recordShape).isRequired,
  defaultBranchId: PropTypes.string,
  onSaved: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default LocationFormModal
