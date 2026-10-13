import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { createUserCity, updateUserCity } from '@/services/userCityService'
import { toast } from '@/utils/toast'
import { INITIAL_VALUES, NAME_MAX_LENGTH, citySchema, toCityPayload, toFormValues } from './cityForm'

// Add / edit a city: its state and name. `city` = the city being edited, null when adding.
function CityFormModal({ show, city, states, defaultStateId, onSaved, onHide }) {
  const isEdit = Boolean(city)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(citySchema),
    defaultValues: INITIAL_VALUES,
  })

  // Fresh values every time the modal opens
  useEffect(() => {
    if (show) reset(city ? toFormValues(city) : { ...INITIAL_VALUES, userStateId: defaultStateId })
  }, [show, city, defaultStateId, reset])

  const onSubmit = async (values) => {
    try {
      const payload = toCityPayload(values)
      const saved = isEdit ? await updateUserCity(city.id, payload) : await createUserCity(payload)
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
          <Form.Group controlId="city-state" className="mb-3">
            <Form.Label className="required">State</Form.Label>
            <Form.Select {...register('userStateId')} isInvalid={Boolean(errors.userStateId)}>
              <option value="">Select state</option>
              {states.map((option) => (
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
