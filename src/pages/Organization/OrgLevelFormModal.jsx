import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import OrgCustomerField from '@/components/common/OrgCustomerField'
import useOrgUser from '@/hooks/useOrgUser'
import { ownedBy, ownerOf, withCustomer } from '@/utils/orgCustomer'
import { toast } from '@/utils/toast'
import { NAME_MAX_LENGTH, toLevelFormValues, toLevelPayload } from './orgLevels'

// Add / edit a row of an organization level (orgLevels.js): its parent and name. `row` = the row
// being edited, null when adding.
function OrgLevelFormModal({ level, show, row, parents, defaultParentId, onSaved, onHide }) {
  const isEdit = Boolean(row)
  const { parent, one, title } = level

  // The superadmin picks the customer on the form; others always save to their own company
  const { canPickUser } = useOrgUser()
  const schema = useMemo(() => withCustomer(level.schema, canPickUser), [level, canPickUser])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: level.emptyValues,
  })

  // Fresh values every time the modal opens
  useEffect(() => {
    if (!show) return
    reset(
      row
        ? { ...toLevelFormValues(level, row), customerId: String(row.userId) }
        : { ...level.emptyValues, customerId: ownerOf(parents, defaultParentId, parent.ownerKey), [parent.key]: defaultParentId },
    )
  }, [show, row, defaultParentId, parents, parent, level, reset])

  // Parents of the picked customer only; a new customer clears the picked parent
  const customerId = watch('customerId')
  const parentOptions = useMemo(() => ownedBy(parents, canPickUser, customerId, parent.ownerKey), [parents, canPickUser, customerId, parent])

  const onSubmit = async (values) => {
    try {
      const ownerId = canPickUser ? values.customerId : undefined
      const payload = toLevelPayload(level, values)
      const saved = isEdit ? await level.update(row.id, payload, ownerId) : await level.create(payload, ownerId)
      toast.success(`${saved.name} has been ${isEdit ? 'updated' : 'added'}.`, { title: `${title} ${isEdit ? 'updated' : 'added'}` })
      onSaved(saved)
    } catch (error) {
      toast.error(error.message, { title: `Could not save ${one}` })
    }
  }

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={`${isEdit ? 'Edit' : 'Add'} ${one}`}>
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>{`${isEdit ? 'Edit' : 'Add'} ${title}`}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <OrgCustomerField
            id={`${one}-customer`}
            registration={register('customerId', { onChange: () => setValue(parent.key, '') })}
            locked={isEdit}
            disabled={isSubmitting}
            error={errors.customerId?.message}
          />
          <Form.Group controlId={`${one}-${parent.one}`} className="mb-3">
            <Form.Label className="required">{parent.title}</Form.Label>
            <Form.Select {...register(parent.key)} isInvalid={Boolean(errors[parent.key])}>
              <option value="">Select {parent.one}</option>
              {parentOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option[parent.hintField] ? `${option.name} · ${option[parent.hintField]}` : option.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors[parent.key]?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId={`${one}-name`}>
            <Form.Label className="required">{title} Name</Form.Label>
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

OrgLevelFormModal.propTypes = {
  level: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  row: recordShape,
  parents: PropTypes.arrayOf(recordShape).isRequired,
  defaultParentId: PropTypes.string,
  onSaved: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default OrgLevelFormModal
