import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { getLibraryStateNames } from '@/constants/countryLibrary'
import { createUserState } from '@/services/userStateService'
import MultiSelectPicker from '@/components/common/MultiSelectPicker'
import OrgCustomerField from '@/components/common/OrgCustomerField'
import useOrgUser from '@/hooks/useOrgUser'
import { ownedBy, withCustomer } from '@/utils/orgCustomer'
import { toast } from '@/utils/toast'
import { INITIAL_VALUES, keepStatesOf, stateSchema, toStateKey, toStatePayloads } from './stateForm'

const NOUN = { one: 'state', many: 'states' }
const COUNTRY_NOUN = { one: 'country', many: 'countries' }

const sameName = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase()

// Add states: pick any of the user's countries, then any number of their states from the country
// library (constants/countryLibrary.js), listed under a heading per country; each is saved as its
// own user_state row. States already added are hidden; dropping a country drops its picked states.
// onSaved(addedStates) gets the rows that were saved.
function StateFormModal({ show, states, countries, defaultCountryId, onSaved, onHide }) {
  // The superadmin picks the customer on the form; others always save to their own company
  const { canPickUser, userId } = useOrgUser()
  const schema = useMemo(() => withCustomer(stateSchema, canPickUser), [canPickUser])

  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
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
    const owner = countries.find((country) => String(country.id) === defaultCountryId)?.userId
    reset({
      ...INITIAL_VALUES,
      customerId: owner ? String(owner) : '',
      userCountryIds: defaultCountryId ? [defaultCountryId] : [],
    })
  }, [show, defaultCountryId, countries, reset])

  const userCountryIds = watch('userCountryIds')
  const customerId = watch('customerId')
  // The picked customer's countries only
  const customerCountries = useMemo(() => ownedBy(countries, canPickUser, customerId), [countries, canPickUser, customerId])

  const countryOptions = useMemo(
    () => customerCountries.map((country) => ({ value: String(country.id), label: country.name })),
    [customerCountries],
  )

  // The picked countries' library states not added yet, grouped by country (in country order)
  const options = useMemo(
    () =>
      customerCountries
        .filter((country) => userCountryIds.includes(String(country.id)))
        .flatMap((country) => {
          const taken = states.filter((state) => state.userCountryId === country.id)
          return getLibraryStateNames(country.name)
            .filter((name) => !taken.some((state) => sameName(state.name, name)))
            .map((name) => ({ value: toStateKey(country.id, name), label: name, group: country.name }))
        }),
    [customerCountries, states, userCountryIds],
  )

  const handleCountriesChange = (next) => {
    setValue('userCountryIds', next, { shouldValidate: true })
    setValue('states', keepStatesOf(getValues('states'), next))
  }

  // A new customer has other countries: clear the picked countries and states
  const handleCustomerChange = () => {
    setValue('userCountryIds', [])
    setValue('states', [])
  }

  const onSubmit = async (values) => {
    const ownerId = canPickUser ? values.customerId : userId
    // One request per state, in order, so a failure names the state it is about
    const added = []
    for (const payload of toStatePayloads(values)) {
      try {
        added.push(await createUserState(payload, ownerId))
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
          <OrgCustomerField
            id="state-customer"
            registration={register('customerId', { onChange: handleCustomerChange })}
            disabled={isSubmitting}
            error={errors.customerId?.message}
          />
          <Form.Group controlId="state-countries" className="mb-3">
            <Form.Label className="required">Countries</Form.Label>
            <Controller
              name="userCountryIds"
              control={control}
              render={({ field }) => (
                <MultiSelectPicker
                  id="state-countries"
                  options={countryOptions}
                  value={field.value}
                  onChange={handleCountriesChange}
                  onBlur={field.onBlur}
                  noun={COUNTRY_NOUN}
                  placeholder="Select countries"
                  emptyText="Add countries first"
                  disabled={isSubmitting}
                  isInvalid={Boolean(errors.userCountryIds)}
                />
              )}
            />
            {errors.userCountryIds && <div className="invalid-feedback d-block">{errors.userCountryIds.message}</div>}
          </Form.Group>

          <Form.Group controlId="state-names">
            <Form.Label className="required">States</Form.Label>
            <Controller
              name="states"
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
                  emptyText={userCountryIds.length ? 'Every state is already added' : 'Select a country first'}
                  disabled={isSubmitting || !userCountryIds.length}
                  isInvalid={Boolean(errors.states)}
                />
              )}
            />
            {errors.states && <div className="invalid-feedback d-block">{errors.states.message}</div>}
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
