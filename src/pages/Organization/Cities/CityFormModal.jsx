import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { createUserCity, updateUserCity } from '@/services/userCityService'
import OrgCustomerField from '@/components/common/OrgCustomerField'
import useOrgUser from '@/hooks/useOrgUser'
import { ownedBy, ownerOf, withCustomer } from '@/utils/orgCustomer'
import { toast } from '@/utils/toast'
import { INITIAL_VALUES, NAME_MAX_LENGTH, citySchema, toCityPayload, toFormValues } from './cityForm'

// Add / edit a city: its state and name. `city` = the city being edited, null when adding.
function CityFormModal({ show, city, states, defaultStateId, onSaved, onHide }) {
  const isEdit = Boolean(city)

  // The superadmin picks the customer on the form; others always save to their own company
  const { canPickUser, userId } = useOrgUser()
  const schema = useMemo(() => withCustomer(citySchema, canPickUser), [canPickUser])

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
      city
        ? { ...toFormValues(city), customerId: String(city.userId) }
        : { ...INITIAL_VALUES, customerId: ownerOf(states, defaultStateId, 'userId'), userStateId: defaultStateId },
    )
  }, [show, city, defaultStateId, states, reset])

  // Parents of the picked customer only; a new customer clears the picked parent
  const customerId = watch('customerId')
  const parentOptions = useMemo(() => ownedBy(states, canPickUser, customerId, 'userId'), [states, canPickUser, customerId])

  const onSubmit = async (values) => {
    try {
      const ownerId = canPickUser ? values.customerId : userId
      const payload = toCityPayload(values)
      const saved = isEdit ? await updateUserCity(city.id, payload, ownerId) : await createUserCity(payload, ownerId)
      toast.success(`${saved.name} has been ${isEdit ? 'updated' : 'added'}.`, { title: isEdit ? 'City updated' : 'City added' })
      onSaved(saved)
    } catch (error) {
      toast.error(error.message, { title: 'Could not save city' })
    }
  }

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? 'Edit city' : 'Add city'}>
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>{isEdit ? 'Edit City' : 'Add City'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <OrgCustomerField
            id="city-customer"
            registration={register('customerId', { onChange: () => setValue('userStateId', '') })}
            locked={isEdit}
            disabled={isSubmitting}
            error={errors.customerId?.message}
          />
          <Form.Group controlId="city-state" className="mb-3">
            <Form.Label className="required">State</Form.Label>
            <Form.Select {...register('userStateId')} isInvalid={Boolean(errors.userStateId)}>
              <option value="">Select state</option>
              {parentOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.countryName ? `${option.name} · ${option.countryName}` : option.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.userStateId?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="city-name">
            <Form.Label className="required">City Name</Form.Label>
            <Form.Control {...register('name')} maxLength={NAME_MAX_LENGTH} autoComplete="off" autoFocus isInvalid={Boolean(errors.name)} />
            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
          </Form.Group>
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
                {isEdit ? 'Update' : 'Save'}
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

CityFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  city: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    userStateId: PropTypes.number,
  }),
  states: PropTypes.arrayOf(recordShape).isRequired,
  defaultStateId: PropTypes.string,
  onSaved: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default CityFormModal
