import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { createUserBranch, updateUserBranch } from '@/services/userBranchService'
import { toast } from '@/utils/toast'
import { INITIAL_VALUES, NAME_MAX_LENGTH, branchSchema, toBranchPayload, toFormValues } from './branchForm'

// Add / edit a branch: its city and name. `branch` = the branch being edited, null when adding.
function BranchFormModal({ show, branch, cities, defaultCityId, onSaved, onHide }) {
  const isEdit = Boolean(branch)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: INITIAL_VALUES,
  })

  // Fresh values every time the modal opens
  useEffect(() => {
    if (show) reset(branch ? toFormValues(branch) : { ...INITIAL_VALUES, userCityId: defaultCityId })
  }, [show, branch, defaultCityId, reset])

  const onSubmit = async (values) => {
    try {
      const payload = toBranchPayload(values)
      const saved = isEdit ? await updateUserBranch(branch.id, payload) : await createUserBranch(payload)
      toast.success(`${saved.name} has been ${isEdit ? 'updated' : 'added'}.`, { title: isEdit ? 'Branch updated' : 'Branch added' })
      onSaved(saved)
    } catch (error) {
      toast.error(error.message, { title: 'Could not save branch' })
    }
  }

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? 'Edit branch' : 'Add branch'}>
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>{isEdit ? 'Edit Branch' : 'Add Branch'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group controlId="branch-city" className="mb-3">
            <Form.Label className="required">City</Form.Label>
            <Form.Select {...register('userCityId')} isInvalid={Boolean(errors.userCityId)}>
              <option value="">Select city</option>
              {cities.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.stateName ? `${option.name} · ${option.stateName}` : option.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.userCityId?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="branch-name">
            <Form.Label className="required">Branch Name</Form.Label>
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

BranchFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  branch: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    userCityId: PropTypes.number,
  }),
  cities: PropTypes.arrayOf(recordShape).isRequired,
  defaultCityId: PropTypes.string,
  onSaved: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default BranchFormModal
