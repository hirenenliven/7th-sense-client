import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@/i18n/zodResolver'
import { Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap'
import PropTypes from 'prop-types'
import FieldLabel from '@/components/common/FieldLabel'
import { createLicenceKeys, generateLicenceKeys } from '@/services/licenceKeyService'
import { toast } from '@/utils/toast'
import { customerOptionLabel } from './licenceKeyFormat'
import { DEFAULT_DURATION, GENERATE_INITIAL_VALUES, LICENCE_DURATIONS, MAX_KEYS, generateSchema } from './licenceKeyForm'
import { FIELD_HELP } from './licenceKeyHelp'
import { useTranslation } from 'react-i18next'
import { translateText } from '@/i18n/tk'


// Generate Licence Key card (superadmin): pick the customer and the number of keys, Generate Key
// asks the server for new keys (not saved) and lists them, each with its Subscription Duration;
// Save stores them for the customer. Changing the number clears the generated keys; Cancel clears
// the form.
function LicenceKeyGenerator({ customers, onSaved }) {
  const { t } = useTranslation()
  const [generating, setGenerating] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(generateSchema), defaultValues: GENERATE_INITIAL_VALUES })
  const { fields, replace } = useFieldArray({ control, name: 'keys' })
  const busy = isSubmitting || generating

  // Only the customer and the number are needed to generate (the keys come back from the server)
  const handleGenerate = async () => {
    if (!(await trigger(['userId', 'count']))) return
    setGenerating(true)
    try {
      const keys = await generateLicenceKeys(Number(getValues('count')))
      replace(keys.map((licenceKey) => ({ licenceKey, duration: DEFAULT_DURATION })))
    } catch (error) {
      toast.error(error.message, { title: t('Could not generate keys') })
    } finally {
      setGenerating(false)
    }
  }

  const onSave = async ({ userId, keys }) => {
    try {
      const saved = await createLicenceKeys(Number(userId), keys)
      toast.success(saved.length === 1 ? t('1 licence key saved.') : t('{{n}} licence keys saved.', { n: saved.length }), {
        title: t('Licence keys saved'),
      })
      onSaved(saved)
      reset(GENERATE_INITIAL_VALUES)
    } catch (error) {
      toast.error(error.message, { title: t('Could not save licence keys') })
    }
  }

  // "Set all": the same duration on every generated key
  const setAllDurations = (event) => {
    if (!event.target.value) return
    fields.forEach((_, index) => setValue(`keys.${index}.duration`, event.target.value))
    event.target.value = ''
  }

  const copyKeys = async () => {
    try {
      await navigator.clipboard.writeText(fields.map((field) => field.licenceKey).join('\n'))
      toast.success(
        fields.length === 1 ? t('1 licence key copied to the clipboard.') : t('{{n}} licence keys copied to the clipboard.', { n: fields.length }),
        { title: t('Copied') },
      )
    } catch {
      toast.error(t('The browser did not allow copying.'), { title: t('Could not copy') })
    }
  }

  const durationOptions = LICENCE_DURATIONS.map((duration) => (
    <option key={duration.value} value={duration.value}>
      {translateText(t, duration.label)}
    </option>
  ))

  return (
    <Card className="mb-3">
      <Form noValidate onSubmit={handleSubmit(onSave)} aria-label={t('Generate licence key')}>
        <Card.Header>
          <span className="text-primary">{t('Generate Licence Key')}</span>
          <span className="ts-header-actions text-body-secondary">
            <i className="bi bi-key-fill" aria-hidden="true" />
          </span>
        </Card.Header>

        <Card.Body>
          <Row className="g-3">
            <Form.Group as={Col} md={6} controlId="licence-userId">
              <Form.Label className="required">{t('Customer')}</Form.Label>
              <Form.Select {...register('userId')} isInvalid={Boolean(errors.userId)} disabled={busy}>
                <option value="">{customers.length ? t('Select Customer') : t('No customers yet')}</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customerOptionLabel(customer)}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.userId?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={6} controlId="licence-count">
              <FieldLabel required help={FIELD_HELP.count}>
                {t('No. Of Key')}
              </FieldLabel>
              <Form.Control
                {...register('count', { onChange: () => replace([]) })}
                inputMode="numeric"
                autoComplete="off"
                maxLength={String(MAX_KEYS).length}
                placeholder={`1 – ${MAX_KEYS}`}
                isInvalid={Boolean(errors.count)}
                disabled={busy}
              />
              <Form.Control.Feedback type="invalid">{errors.count?.message}</Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Button className="mt-3" onClick={handleGenerate} disabled={busy}>
            {generating ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" />
                {t('Generating…')}
              </>
            ) : (
              <>
                <i className="bi bi-stars me-2" aria-hidden="true" />
                {t('Generate Key')}
              </>
            )}
          </Button>
          {errors.keys?.message && <div className="invalid-feedback d-block">{errors.keys.message}</div>}

          {fields.length > 0 && (
            <section className="mt-3" aria-label={t('Generated licence keys')}>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="text-body-secondary small me-auto">{t('Generated keys are saved only when you click Save.')}</span>
                <Form.Select size="sm" className="w-auto" defaultValue="" onChange={setAllDurations} aria-label={t('Set duration of all keys')} disabled={busy}>
                  <option value="">{t('Set all durations…')}</option>
                  {durationOptions}
                </Form.Select>
                <Button variant="link" size="sm" onClick={copyKeys}>
                  <i className="bi bi-clipboard me-1" aria-hidden="true" />
                  {t('Copy all')}
                </Button>
              </div>

              <div className="ts-table-panel">
                <Table responsive className="mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>{t('Sr. No.')}</th>
                      <th>{t('Licence Key')}</th>
                      <th>{t('Subscription Duration')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => (
                      <tr key={field.id}>
                        <td className="font-tabular">{index + 1}</td>
                        <td className="font-monospace fw-semibold text-nowrap">{field.licenceKey}</td>
                        <td>
                          <Form.Select
                            {...register(`keys.${index}.duration`)}
                            isInvalid={Boolean(errors.keys?.[index]?.duration)}
                            aria-label={t('Subscription duration of {{key}}', { key: field.licenceKey })}
                            disabled={busy}
                          >
                            {durationOptions}
                          </Form.Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="ts-key-total mt-3">{t('{{n}} Key(s)', { n: fields.length })}</div>
            </section>
          )}
        </Card.Body>

        <Card.Footer className="d-flex gap-2">
          <Button type="submit" disabled={busy || !fields.length}>
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" />
                {t('Saving…')}
              </>
            ) : (
              'Save'
            )}
          </Button>
          <Button variant="ghost" onClick={() => reset(GENERATE_INITIAL_VALUES)} disabled={busy}>
            {t('Cancel')}
          </Button>
        </Card.Footer>
      </Form>
    </Card>
  )
}

LicenceKeyGenerator.propTypes = {
  customers: PropTypes.array.isRequired,
  onSaved: PropTypes.func.isRequired,
}

export default LicenceKeyGenerator
