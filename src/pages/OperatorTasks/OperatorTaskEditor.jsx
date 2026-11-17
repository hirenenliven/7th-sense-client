import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Card, Form, InputGroup, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import FieldLabel from '@/components/common/FieldLabel'
import { createMaintenanceTask, createOperatorTask, updateOperatorTask } from '@/services/operatorTaskService'
import { toast } from '@/utils/toast'
import { customerName } from '@/pages/Customers/customerFormat'
import { FIELD_HELP } from './operatorTaskHelp'
import {
  INITIAL_VALUES,
  REQUIRED_FIELDS,
  TASK_MAX_LENGTH,
  TASK_STATUS,
  findTask,
  groupModels,
  operatorTaskSchema,
  toFormValues,
  toOperatorTaskPayload,
} from './operatorTaskForm'

// The Add / Edit Operator Task card beside the list (superadmin only). `editing` loads a row into
// the form; Save adds or updates, Cancel clears it. New task adds a task to the master list and picks
// it. Named Editor, not Form: operatorTaskForm.js (the schema) differs only in case, and Windows
// would resolve './OperatorTaskForm' to it.
function OperatorTaskEditor({ customers, models, tasks, editing, onSaved, onCancel, onTaskAdded }) {
  const isEdit = Boolean(editing)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(operatorTaskSchema), defaultValues: INITIAL_VALUES })

  // New task (quick add to the master list)
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTask, setNewTask] = useState('')
  const [newTaskError, setNewTaskError] = useState('')
  const [addingTask, setAddingTask] = useState(false)

  useEffect(() => {
    reset(editing ? toFormValues(editing) : INITIAL_VALUES)
    setShowNewTask(false)
    setNewTask('')
    setNewTaskError('')
  }, [editing, reset])

  const closeNewTask = () => {
    setShowNewTask(false)
    setNewTask('')
    setNewTaskError('')
  }

  const pickTask = (task) => {
    setValue('maintenanceTaskId', String(task.id), { shouldValidate: true })
    closeNewTask()
  }

  const addTask = async () => {
    const description = newTask.trim()
    if (!description) {
      setNewTaskError('Enter the task')
      return
    }
    // Already in the list: pick it instead of adding a duplicate
    const existing = findTask(tasks, description)
    if (existing) {
      pickTask(existing)
      return
    }
    setAddingTask(true)
    try {
      const task = await createMaintenanceTask(description)
      onTaskAdded(task)
      pickTask(task)
      toast.success(`${task.description} is now in the task list.`, { title: 'Task added' })
    } catch (error) {
      setNewTaskError(error.message)
    } finally {
      setAddingTask(false)
    }
  }

  const onSubmit = async (values) => {
    clearErrors('root.server')
    try {
      const payload = toOperatorTaskPayload(values)
      const saved = isEdit ? await updateOperatorTask(editing.id, payload) : await createOperatorTask(payload)
      toast.success(`${saved.task} is ${isEdit ? 'updated' : 'added'} for ${saved.customerName}.`, {
        title: isEdit ? 'Operator task updated' : 'Operator task added',
      })
      if (!isEdit) reset({ ...INITIAL_VALUES, userId: values.userId, modelId: values.modelId })
      onSaved(saved, isEdit)
    } catch (error) {
      setError('root.server', { message: error.message })
    }
  }

  const labelRequired = (name) => REQUIRED_FIELDS.has(name)
  // Inactive tasks (Task List) are not offered, except the one the edited row already has
  const taskOptions = tasks.filter((task) => task.status !== TASK_STATUS.INACTIVE || task.id === editing?.maintenanceTaskId)

  return (
    <Card className="ts-side-form">
      <Card.Header>
        <i className={`bi ${isEdit ? 'bi-pencil-square' : 'bi-clipboard-plus'} text-primary`} aria-hidden="true" />
        {isEdit ? 'Edit Operator Task' : 'Add Operator Task'}
      </Card.Header>
      <Card.Body>
        <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? 'Edit operator task' : 'Add operator task'}>
          {errors.root?.server && (
            <Alert variant="danger" className="py-2" role="alert">
              {errors.root.server.message}
            </Alert>
          )}

          <Form.Group className="mb-3" controlId="operator-task-customer">
            <FieldLabel required={labelRequired('userId')}>Customer Name</FieldLabel>
            <Form.Select {...register('userId')} isInvalid={Boolean(errors.userId)}>
              <option value="">Select customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customerName(customer)}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.userId?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="operator-task-model">
            <FieldLabel help={FIELD_HELP.modelId}>Machine Type</FieldLabel>
            <Form.Select {...register('modelId')}>
              <option value="">All machines</option>
              {groupModels(models).map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.models.map((machineModel) => (
                    <option key={machineModel.id} value={machineModel.id}>
                      {machineModel.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4" controlId="operator-task-task">
            <div className="d-flex align-items-center justify-content-between">
              <FieldLabel required={labelRequired('maintenanceTaskId')} help={FIELD_HELP.maintenanceTaskId}>
                Task
              </FieldLabel>
              {!showNewTask && (
                <Button variant="link" size="sm" className="p-0 text-decoration-none" onClick={() => setShowNewTask(true)}>
                  <i className="bi bi-plus-lg me-1" aria-hidden="true" />
                  New task
                </Button>
              )}
            </div>
            <Form.Select {...register('maintenanceTaskId')} isInvalid={Boolean(errors.maintenanceTaskId)}>
              <option value="">Select task</option>
              {taskOptions.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.status === TASK_STATUS.INACTIVE ? `${task.description} (inactive)` : task.description}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.maintenanceTaskId?.message}</Form.Control.Feedback>

            {showNewTask && (
              <div className="card-inset mt-2 p-3">
                <Form.Label htmlFor="operator-task-new" className="small text-body-secondary">
                  New task for the list
                </Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    id="operator-task-new"
                    value={newTask}
                    maxLength={TASK_MAX_LENGTH}
                    placeholder="e.g. Check coolant level"
                    autoFocus
                    isInvalid={Boolean(newTaskError)}
                    onChange={(event) => {
                      setNewTask(event.target.value)
                      setNewTaskError('')
                    }}
                    onKeyDown={(event) => {
                      // Enter adds the task instead of submitting the whole form
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        addTask()
                      }
                      if (event.key === 'Escape') closeNewTask()
                    }}
                  />
                  <Button onClick={addTask} disabled={addingTask}>
                    {addingTask ? <Spinner animation="border" size="sm" aria-hidden="true" /> : 'Add'}
                  </Button>
                  <Button variant="ghost" onClick={closeNewTask} disabled={addingTask} aria-label="Close new task">
                    <i className="bi bi-x-lg" aria-hidden="true" />
                  </Button>
                  <Form.Control.Feedback type="invalid">{newTaskError}</Form.Control.Feedback>
                </InputGroup>
              </div>
            )}
          </Form.Group>

          <div className="d-flex gap-2">
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

OperatorTaskEditor.propTypes = {
  customers: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number.isRequired })).isRequired,
  models: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.number.isRequired, name: PropTypes.string, brandName: PropTypes.string, controllerName: PropTypes.string }),
  ).isRequired,
  tasks: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number.isRequired, description: PropTypes.string, status: PropTypes.string }))
    .isRequired,
  // the row being edited; null = adding
  editing: PropTypes.shape({ id: PropTypes.number.isRequired, maintenanceTaskId: PropTypes.number }),
  onSaved: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onTaskAdded: PropTypes.func.isRequired,
}

export default OperatorTaskEditor
