import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { getCountryCode, getStates } from '@/constants/locations'
import { createUserState } from '@/services/userStateService'
import { toast } from '@/utils/toast'
import { INITIAL_VALUES, NAME_MAX_LENGTH, stateSchema, toStatePayload } from './stateForm'

const sameName = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase()

// Add a state: pick one of the user's countries, then a state of that country from the
// country library (constants/locations.js). States already added to that country are hidden.
// A country the library has no states for gets a free-text name.
function StateFormModal({ show, states, countries, defaultCountryId, onSaved, onHide }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(stateSchema),
    defaultValues: INITIAL_VALUES,
  })

  // Fresh values every time the modal opens
  useEffect(() => {
    if (show) reset({ ...INITIAL_VALUES, userCountryId: defaultCountryId })
  }, [show, defaultCountryId, reset])

  const userCountryId = watch('userCountryId')

  const libraryStates = useMemo(() => {
    const countryName = countries.find((country) => String(country.id) === userCountryId)?.name ?? ''
    return getStates(getCountryCode(countryName)).map((state) => state.name)
  }, [countries, userCountryId])

  const stateOptions = useMemo(() => {
    const taken = states.filter((state) => String(state.userCountryId) === userCountryId)
    return libraryStates.filter((name) => !taken.some((state) => sameName(state.name, name)))
  }, [libraryStates, states, userCountryId])

  const typeName = Boolean(userCountryId) && !libraryStates.length

  const onSubmit = async (values) => {
    try {
      const saved = await createUserState(toStatePayload(values))
      toast.success(`${saved.name} has been added.`, { title: 'State added' })
      onSaved(saved)
    } catch (error) {
      toast.error(error.message, { title: 'Could not save state' })
    }
  }

  const placeholder = !userCountryId
    ? 'Select a country first'
    : stateOptions.length
      ? 'Select state'
      : 'Every state is already added'

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label="Add state">
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>Add State</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group controlId="state-country" className="mb-3">
            <Form.Label className="required">Country</Form.Label>
            <Form.Select
              {...register('userCountryId', { onChange: () => setValue('name', '') })}
              isInvalid={Boolean(errors.userCountryId)}
            >
              <option value="">Select country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.userCountryId?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="state-name">
            <Form.Label className="required">State</Form.Label>
            {typeName ? (
              <Form.Control {...register('name')} maxLength={NAME_MAX_LENGTH} autoComplete="off" isInvalid={Boolean(errors.name)} />
            ) : (
              <Form.Select {...register('name')} disabled={!userCountryId} isInvalid={Boolean(errors.name)}>
                <option value="">{placeholder}</option>
                {stateOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Form.Select>
            )}
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
                Save
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

StateFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  states: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      userCountryId: PropTypes.number,
    }),
  ).isRequired,
  countries: PropTypes.arrayOf(recordShape).isRequired,
  defaultCountryId: PropTypes.string,
  onSaved: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default StateFormModal
