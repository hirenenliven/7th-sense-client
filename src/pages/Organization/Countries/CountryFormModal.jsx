import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { COUNTRIES } from '@/constants/locations'
import { createUserCountry } from '@/services/userCountryService'
import OrgUserNote from '@/components/common/OrgUserNote'
import useOrgUser from '@/hooks/useOrgUser'
import { toast } from '@/utils/toast'
import { INITIAL_VALUES, countrySchema, toCountryPayload } from './countryForm'

const sameName = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase()

// Add a country: pick one from the country library (constants/locations.js).
// Countries the user already added are hidden.
function CountryFormModal({ show, countries, onSaved, onHide }) {
  const { userId } = useOrgUser()

  const {
    register,
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
    () => COUNTRIES.map((country) => country.name).filter((name) => !countries.some((saved) => sameName(saved.name, name))),
    [countries],
  )

  const onSubmit = async (values) => {
    try {
      const saved = await createUserCountry(toCountryPayload(values), userId)
      toast.success(`${saved.name} has been added.`, { title: 'Country added' })
      onSaved(saved)
    } catch (error) {
      toast.error(error.message, { title: 'Could not save country' })
    }
  }

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label="Add country">
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>Add Country</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <OrgUserNote />
          <Form.Group controlId="country-name">
            <Form.Label className="required">Country</Form.Label>
            <Form.Select {...register('name')} isInvalid={Boolean(errors.name)}>
              <option value="">{options.length ? 'Select country' : 'Every country is already added'}</option>
              {options.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Form.Select>
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
