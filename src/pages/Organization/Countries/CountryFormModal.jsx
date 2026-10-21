import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@/i18n/zodResolver'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { ALL_COUNTRIES } from '@/constants/countryLibrary'
import { createUserCountry } from '@/services/userCountryService'
import MultiSelectPicker from '@/components/common/MultiSelectPicker'
import OrgCustomerField from '@/components/common/OrgCustomerField'
import useOrgUser from '@/hooks/useOrgUser'
import { ownedBy, withCustomer } from '@/utils/orgCustomer'
import { toast } from '@/utils/toast'
import { INITIAL_VALUES, countrySchema, toCountryPayloads } from './countryForm'
import { useTranslation } from 'react-i18next'

const NOUN = { one: 'country', many: 'countries' }

const sameName = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase()

// Add countries: pick any number from the full country library (constants/countryLibrary.js);
// each is saved as its own user_country row. Countries the user already added are hidden.
// onSaved(addedCountries) gets the rows that were saved.
function CountryFormModal({ show, countries, onSaved, onHide }) {
  const { t } = useTranslation()
  // The superadmin picks the customer on the form; others always save to their own company
  const { canPickUser, userId } = useOrgUser()
  const schema = useMemo(() => withCustomer(countrySchema, canPickUser), [canPickUser])

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: INITIAL_VALUES,
  })

  // Fresh values every time the modal opens
  useEffect(() => {
    if (show) reset({ ...INITIAL_VALUES, customerId: '' })
  }, [show, reset])

  // Library countries the picked customer has not added yet
  const customerId = watch('customerId')
  const options = useMemo(() => {
    const taken = ownedBy(countries, canPickUser, customerId)
    return ALL_COUNTRIES.filter((country) => !taken.some((saved) => sameName(saved.name, country.name))).map((country) => ({
      value: country.name,
      label: country.name,
    }))
  }, [countries, canPickUser, customerId])

  const onSubmit = async (values) => {
    const ownerId = canPickUser ? values.customerId : userId
    // One request per country, in order, so a failure names the country it is about
    const added = []
    for (const payload of toCountryPayloads(values)) {
      try {
        added.push(await createUserCountry(payload, ownerId))
      } catch (error) {
        toast.error(t('{{name}}: {{message}}', { name: payload.name, message: error.message }), { title: t('Could not save country') })
      }
    }
    if (!added.length) return
    const message =
      added.length === 1
        ? t('{{name}} has been added.', { name: added[0].name })
        : t('{{n}} countries have been added.', { n: added.length })
    toast.success(message, { title: t('Countries added') })
    onSaved(added)
  }

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={t('Add countries')}>
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>{t('Add Countries')}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <OrgCustomerField
            id="country-customer"
            registration={register('customerId', { onChange: () => setValue('names', []) })}
            disabled={isSubmitting}
            error={errors.customerId?.message}
          />
          <Form.Group controlId="country-names">
            <Form.Label className="required">{t('Countries')}</Form.Label>
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
                  placeholder={t('Select countries')}
                  emptyText={t('Every country is already added')}
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
                {t('Save')}
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
