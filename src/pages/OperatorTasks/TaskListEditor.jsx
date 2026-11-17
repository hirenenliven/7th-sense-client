import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import FieldLabel from '@/components/common/FieldLabel'
import StatusToggle from '@/components/common/StatusToggle'
import { createMaintenanceTask, updateMaintenanceTask } from '@/services/operatorTaskService'
import { toast } from '@/utils/toast'
import { TASK_MAX_LENGTH, TASK_STATUS } from './operatorTaskForm'
import { FIELD_HELP } from './operatorTaskHelp'
import { INITIAL_VALUES, taskSchema, toFormValues, toTaskPayload, usageLabel } from './taskListForm'

// The Add / Edit Task card beside the Task List (superadmin only). A new task is active and shows in
// the Task dropdown of Operator Tasks at once; on edit, Status can make it inactive (left out of the
// dropdown, operator tasks that use it keep it).
function TaskListEditor({ editing, onSaved, onCancel }) {
  const isEdit = Boolean(editing)
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(taskSchema), defaultValues: INITIAL_VALUES })

  useEffect(() => {
    reset(editing ? toFormValues(editing) : INITIAL_VALUES)
  }, [editing, reset])

  const onSubmit = async (values) => {
    clearErrors('root.server')
    try {
      const payload = toTaskPayload(values)
      const saved = isEdit ? await updateMaintenanceTask(editing.id, payload) : await createMaintenanceTask(payload.description)
      toast.success(isEdit ? `${saved.description} is updated.` : `${saved.description} is now in the task list.`, {
        title: isEdit ? 'Task updated' : 'Task added',
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
        <i className={`bi ${isEdit ? 'bi-pencil-square' : 'bi-list-check'} text-primary`} aria-hidden="true" />
        {isEdit ? 'Edit Task' : 'Add Task'}
      </Card.Header>
      <Card.Body>
        <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? 'Edit task' : 'Add task'}>
          {errors.root?.server && (
            <Alert variant="danger" className="py-2" role="alert">
              {errors.root.server.message}
            </Alert>
          )}

          <Form.Group className="mb-3" controlId="task-list-description">
            <FieldLabel required help={FIELD_HELP.description}>
              Task
            </FieldLabel>
            <Form.Control
              as="textarea"
              rows={3}
              {...register('description')}
              maxLength={TASK_MAX_LENGTH}
              placeholder="e.g. Coolant not working and need to fix"
              isInvalid={Boolean(errors.description)}
            />
            <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
          </Form.Group>

          {isEdit && (
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <StatusToggle id="task-list-status" {...register('status')} activeValue={TASK_STATUS.ACTIVE} inactiveValue={TASK_STATUS.INACTIVE} />
              <Form.Text>
                Used by {usageLabel(editing.usageCount).toLowerCase()}. An inactive task is not offered for new operator tasks.
              </Form.Text>
            </Form.Group>
          )}

          <div className="d-flex gap-2 mt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" />}
              {isEdit ? 'Update' : 'Save'}
            </Button>
            <Button variant="ghost" onClick={isEdit ? onCancel : () => reset(INITIAL_VALUES)} disabled={isSubmitting}>
              {isEdit ? 'Cancel' : 'Clear'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

TaskListEditor.propTypes = {
  // the task being edited; null = adding
  editing: PropTypes.shape({
    id: PropTypes.number.isRequired,
    description: PropTypes.string,
    status: PropTypes.string,
    usageCount: PropTypes.number,
  }),
  onSaved: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default TaskListEditor
