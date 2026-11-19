import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import FieldLabel from '@/components/common/FieldLabel'
import { createMachineAccuracy, updateMachineAccuracy } from '@/services/machineAccuracyService'
import { toast } from '@/utils/toast'
import { ACCURACY_MAX_LENGTH, INITIAL_VALUES, accuracySchema, toAccuracyName, toFormValues, usageLabel } from './machineAccuracyForm'

// The Add / Edit card beside the Machine Accuracy list (superadmin only). A saved accuracy shows in
// every customer's machine and part forms at once.
function MachineAccuracyEditor({ editing, onSaved, onCancel }) {
  const isEdit = Boolean(editing)
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(accuracySchema), defaultValues: INITIAL_VALUES })

  useEffect(() => {
    reset(editing ? toFormValues(editing) : INITIAL_VALUES)
  }, [editing, reset])

  const onSubmit = async (values) => {
    clearErrors('root.server')
    try {
      const name = toAccuracyName(values)
      const saved = isEdit ? await updateMachineAccuracy(editing.id, name) : await createMachineAccuracy(name)
      toast.success(isEdit ? `${saved.name} is updated.` : `${saved.name} is now offered on the machine and part forms.`, {
        title: isEdit ? 'Machine accuracy updated' : 'Machine accuracy added',
      })
      if (!isEdit) reset(INITIAL_VALUES)
      onSaved(saved, isEdit)
    } catch (error) {
      setError('root.server', { message: error.message })
    }
  }

  return (
    <Card className="ts-side-form">
      <Card.Header>
        <i className={`bi ${isEdit ? 'bi-pencil-square' : 'bi-bullseye'} text-primary`} aria-hidden="true" />
        {isEdit ? 'Edit Machine Accuracy' : 'Add Machine Accuracy'}
      </Card.Header>
      <Card.Body>
        <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? 'Edit machine accuracy' : 'Add machine accuracy'}>
          {errors.root?.server && (
            <Alert variant="danger" className="py-2" role="alert">
              {errors.root.server.message}
            </Alert>
          )}

          <Form.Group className="mb-3" controlId="machine-accuracy-name">
            <FieldLabel required>Machine Accuracy</FieldLabel>
            <Form.Control
              {...register('name')}
              autoComplete="off"
              maxLength={ACCURACY_MAX_LENGTH}
              placeholder="e.g. Good"
              isInvalid={Boolean(errors.name)}
            />
            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
            {isEdit && <Form.Text>Used by {usageLabel(editing.usageCount).toLowerCase()}. They show the new name.</Form.Text>}
          </Form.Group>

          <div className="d-flex gap-2 mt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" />}
              {isEdit ? 'Update' : 'Save'}
            </Button>
            <Button variant="ghost" onClick={isEdit ? onCancel : () => reset(INITIAL_VALUES)} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

MachineAccuracyEditor.propTypes = {
  // the accuracy being edited; null = adding
  editing: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    usageCount: PropTypes.number,
  }),
  onSaved: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default MachineAccuracyEditor
