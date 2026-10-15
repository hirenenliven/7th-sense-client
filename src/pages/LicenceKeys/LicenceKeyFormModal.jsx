import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import StatusToggle from '@/components/common/StatusToggle'
import { updateLicenceKey } from '@/services/licenceKeyService'
import { toast } from '@/utils/toast'
import { customerOptionLabel } from './licenceKeyFormat'
import { DEFAULT_DURATION, LICENCE_DURATIONS, LICENCE_KEY_STATUS, editSchema, toEditPayload, toEditValues } from './licenceKeyForm'

// Edit Licence Key modal (superadmin): moves `licenceKey` (a list row) to another customer, changes
// its subscription duration (the server recounts the end date from the day the key was saved) or
// its status. The key itself never changes.
function LicenceKeyFormModal({ licenceKey, customers, onSaved, onHide }) {
  const show = Boolean(licenceKey)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(editSchema), defaultValues: { userId: '', duration: DEFAULT_DURATION, status: LICENCE_KEY_STATUS.ACTIVE } })

  // Fresh values every time the modal opens on a row
  useEffect(() => {
    if (licenceKey) reset(toEditValues(licenceKey))
  }, [licenceKey, reset])

  const onSubmit = async (values) => {
    try {
      const saved = await updateLicenceKey(licenceKey.id, toEditPayload(values))
      toast.success('Licence key has been updated.', { title: 'Licence key updated' })
      onSaved(saved)
    } catch (error) {
      toast.error(error.message, { title: 'Could not save licence key' })
    }
  }

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label="Edit licence key">
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>Edit Licence Key</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="g-3">
            <Col xs={12}>
              <Form.Label as="div">Licence Key</Form.Label>
              <div className="font-monospace fw-semibold">{licenceKey?.licenceKey}</div>
            </Col>

            <Form.Group as={Col} xs={12} controlId="licence-edit-userId">
              <Form.Label className="required">Customer</Form.Label>
              <Form.Select {...register('userId')} isInvalid={Boolean(errors.userId)}>
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customerOptionLabel(customer)}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.userId?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} xs={12} controlId="licence-edit-duration">
              <Form.Label className="required">Subscription Duration</Form.Label>
              <Form.Select {...register('duration')} isInvalid={Boolean(errors.duration)}>
                {LICENCE_DURATIONS.map((duration) => (
                  <option key={duration.value} value={duration.value}>
                    {duration.label}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.duration?.message}</Form.Control.Feedback>
              <Form.Text>Counted from the day the key was saved.</Form.Text>
            </Form.Group>

            <Form.Group as={Col} xs={12}>
              <Form.Label className="required">Status</Form.Label>
              <StatusToggle
                id="licence-edit-status"
                {...register('status')}
                activeValue={LICENCE_KEY_STATUS.ACTIVE}
                inactiveValue={LICENCE_KEY_STATUS.INACTIVE}
              />
            </Form.Group>
          </Row>
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
                Update Licence Key
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

LicenceKeyFormModal.propTypes = {
  licenceKey: PropTypes.object,
  customers: PropTypes.array.isRequired,
  onSaved: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default LicenceKeyFormModal
