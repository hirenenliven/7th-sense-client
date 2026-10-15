import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { ALL_COUNTRIES } from '@/constants/countryLibrary'
import { createUserCountry } from '@/services/userCountryService'
import MultiSelectPicker from '@/components/common/MultiSelectPicker'
import OrgUserNote from '@/components/common/OrgUserNote'
import useOrgUser from '@/hooks/useOrgUser'
import { toast } from '@/utils/toast'
import { INITIAL_VALUES, countrySchema, toCountryPayloads } from './countryForm'

const NOUN = { one: 'country', many: 'countries' }

const sameName = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase()

// Add countries: pick any number from the full country library (constants/countryLibrary.js);
// each is saved as its own user_country row. Countries the user already added are hidden.
// onSaved(addedCountries) gets the rows that were saved.
function CountryFormModal({ show, countries, onSaved, onHide }) {
  const { userId } = useOrgUser()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(countrySchema),
    defaultValues: INITIAL_VALUES,
  })

  // Fresh values every time the modal opens
  useEffect(() => {
    if (show) reset(INITIAL_VALUES)
  }, [show, reset])

  const options = useMemo(
    () =>
      ALL_COUNTRIES.filter((country) => !countries.some((saved) => sameName(saved.name, country.name))).map((country) => ({
        value: country.name,
        label: country.name,
      })),
    [countries],
  )

  const onSubmit = async (values) => {
    // One request per country, in order, so a failure names the country it is about
    const added = []
    for (const payload of toCountryPayloads(values)) {
      try {
        added.push(await createUserCountry(payload, userId))
      } catch (error) {
        toast.error(`${payload.name}: ${error.message}`, { title: 'Could not save country' })
      }
    }
    if (!added.length) return
    const names = added.length === 1 ? `${added[0].name} has` : `${added.length} countries have`
    toast.success(`${names} been added.`, { title: 'Countries added' })
    onSaved(added)
  }

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label="Add countries">
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>Add Countries</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <OrgUserNote />
          <Form.Group controlId="country-names">
            <Form.Label className="required">Countries</Form.Label>
            <Controller
              name="names"
              control={control}
              render={({ field }) => (
                <MultiSelectPicker
                  id="country-names"
                  options={options}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  noun={NOUN}
                  placeholder="Select countries"
                  emptyText="Every country is already added"
                  disabled={isSubmitting}
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

CountryFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onSaved: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default CountryFormModal
