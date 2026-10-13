import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { createUserLocation, updateUserLocation } from '@/services/userLocationService'
import OrgUserNote from '@/components/common/OrgUserNote'
import useOrgUser from '@/hooks/useOrgUser'
import { toast } from '@/utils/toast'
import { INITIAL_VALUES, NAME_MAX_LENGTH, locationSchema, toLocationPayload, toFormValues } from './locationForm'

// Add / edit a location: its branch and name. `location` = the location being edited, null when adding.
function LocationFormModal({ show, location, branches, defaultBranchId, onSaved, onHide }) {
  const isEdit = Boolean(location)

  const { userId } = useOrgUser()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: INITIAL_VALUES,
  })

  // Fresh values every time the modal opens
  useEffect(() => {
    if (show) reset(location ? toFormValues(location) : { ...INITIAL_VALUES, branchId: defaultBranchId })
  }, [show, location, defaultBranchId, reset])

  const onSubmit = async (values) => {
    try {
      const payload = toLocationPayload(values)
      const saved = isEdit ? await updateUserLocation(location.id, payload, userId) : await createUserLocation(payload, userId)
      toast.success(`${saved.name} has been ${isEdit ? 'updated' : 'added'}.`, { title: isEdit ? 'Location updated' : 'Location added' })
      onSaved(saved)
    } catch (error) {
      toast.error(error.message, { title: 'Could not save location' })
    }
  }

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? 'Edit location' : 'Add location'}>
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>{isEdit ? 'Edit Location' : 'Add Location'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <OrgUserNote />
          <Form.Group controlId="location-branch" className="mb-3">
            <Form.Label className="required">Branch</Form.Label>
            <Form.Select {...register('branchId')} isInvalid={Boolean(errors.branchId)}>
              <option value="">Select branch</option>
              {branches.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.city ? `${option.name} · ${option.city}` : option.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.branchId?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="location-name">
            <Form.Label className="required">Location Name</Form.Label>
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

LocationFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    branchId: PropTypes.number,
  }),
  branches: PropTypes.arrayOf(recordShape).isRequired,
  defaultBranchId: PropTypes.string,
  onSaved: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default LocationFormModal
