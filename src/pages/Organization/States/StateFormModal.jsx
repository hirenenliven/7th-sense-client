import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { getLibraryStateNames } from '@/constants/countryLibrary'
import { createUserState } from '@/services/userStateService'
import MultiSelectPicker from '@/components/common/MultiSelectPicker'
import OrgUserNote from '@/components/common/OrgUserNote'
import useOrgUser from '@/hooks/useOrgUser'
import { toast } from '@/utils/toast'
import { INITIAL_VALUES, stateSchema, toStatePayloads } from './stateForm'

const NOUN = { one: 'state', many: 'states' }

const sameName = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase()

// Add states: pick one of the user's countries, then any number of its states from the country
// library (constants/countryLibrary.js); each is saved as its own user_state row. States already
// added to that country are hidden; a new country clears the picked states.
// onSaved(addedStates) gets the rows that were saved.
function StateFormModal({ show, states, countries, defaultCountryId, onSaved, onHide }) {
  const { userId } = useOrgUser()

  const {
    control,
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

  const options = useMemo(() => {
    const countryName = countries.find((country) => String(country.id) === userCountryId)?.name ?? ''
    const taken = states.filter((state) => String(state.userCountryId) === userCountryId)
    return getLibraryStateNames(countryName)
      .filter((name) => !taken.some((state) => sameName(state.name, name)))
      .map((name) => ({ value: name, label: name }))
  }, [countries, states, userCountryId])

  const onSubmit = async (values) => {
    // One request per state, in order, so a failure names the state it is about
    const added = []
    for (const payload of toStatePayloads(values)) {
      try {
        added.push(await createUserState(payload, userId))
      } catch (error) {
        toast.error(`${payload.name}: ${error.message}`, { title: 'Could not save state' })
      }
    }
    if (!added.length) return
    const names = added.length === 1 ? `${added[0].name} has` : `${added.length} states have`
    toast.success(`${names} been added.`, { title: 'States added' })
    onSaved(added)
  }

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label="Add states">
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>Add States</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <OrgUserNote />
          <Form.Group controlId="state-country" className="mb-3">
            <Form.Label className="required">Country</Form.Label>
            <Form.Select
              {...register('userCountryId', { onChange: () => setValue('names', []) })}
              disabled={isSubmitting}
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

          <Form.Group controlId="state-names">
            <Form.Label className="required">States</Form.Label>
            <Controller
              name="names"
              control={control}
              render={({ field }) => (
                <MultiSelectPicker
                  id="state-names"
                  options={options}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  noun={NOUN}
                  placeholder="Select states"
                  emptyText={userCountryId ? 'Every state is already added' : 'Select a country first'}
                  disabled={isSubmitting || !userCountryId}
                  isInvalid={Boolean(errors.names)}
                />
              )}
            />
            {errors.names && <div className="invalid-feedback d-block">{errors.names.message}</div>}
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
