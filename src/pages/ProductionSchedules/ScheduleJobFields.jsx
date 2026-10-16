import { Controller, useWatch } from 'react-hook-form'
import { Col, Form, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import DatePicker from '@/components/common/DatePicker'
import FieldLabel from '@/components/common/FieldLabel'
import IconAction from '@/components/common/IconAction'
import TimePicker from '@/components/common/TimePicker'
import { ACTION_ICONS } from '@/constants/icons'
import { formatClock12, formatHoursMinutes } from '@/utils/dateTime'
import { MAX_LENGTH, MAX_QUANTITY, itemMinutes } from './scheduleForm'
import { FIELD_HELP } from './scheduleHelp'

const optionShape = PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string.isRequired })

// One job of the schedule: who runs which part process, how many, in which shift and when.
// `options` are the customer's lists ({ value, label }); `processOptions(partId)` the part's
// processes that run on the selected machine. `placeholder` is shown while a list is empty.
function ScheduleJobFields({ index, control, register, setValue, errors, isMultiple, startDate, endDate, options, processOptions, shiftsById, placeholder, canRemove, onRemove }) {
  const prefix = `items.${index}`
  const item = useWatch({ control, name: prefix })
  const shift = shiftsById.get(item?.shiftId)
  const minutes = itemMinutes(item)

  // Controlled select: the options load after the customer (or part) is known
  const select = (field, label, list, emptyText, { help, onPick, disabled } = {}) => (
    <Form.Group as={Col} controlId={`${prefix}.${field}`}>
      {help ? (
        <FieldLabel required help={help}>
          {label}
        </FieldLabel>
      ) : (
        <Form.Label className="required">{label}</Form.Label>
      )}
      <Controller
        name={`${prefix}.${field}`}
        control={control}
        render={({ field: input }) => (
          <Form.Select
            {...input}
            onChange={(event) => {
              input.onChange(event)
              onPick?.()
            }}
            disabled={disabled || !list.length}
            isInvalid={Boolean(errors?.[field])}
          >
            <option value="">{list.length ? `Select ${label}` : emptyText}</option>
            {list.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        )}
      />
      <Form.Control.Feedback type="invalid">{errors?.[field]?.message}</Form.Control.Feedback>
    </Form.Group>
  )

  const time = (field, label) => (
    <Form.Group as={Col} controlId={`${prefix}.${field}`}>
      <FieldLabel required help={FIELD_HELP.times}>
        {label}
      </FieldLabel>
      <Controller
        name={`${prefix}.${field}`}
        control={control}
        render={({ field: input }) => <TimePicker {...input} id={`${prefix}.${field}`} isInvalid={Boolean(errors?.[field])} />}
      />
      {errors?.[field] && <div className="invalid-feedback d-block">{errors[field].message}</div>}
    </Form.Group>
  )

  const processes = processOptions(item?.partId)
  let processEmpty = placeholder.process
  if (!item?.partId) processEmpty = 'Select a part first'
  else if (processes.loading) processEmpty = 'Loading processes…'
  else if (!processes.items.length) processEmpty = 'No process of this part runs on the machine'

  return (
    <section className="ts-part-process" aria-label={`Job ${index + 1}`}>
      <div className="d-flex align-items-center mb-2">
        <h2 className="ts-section-title mb-0 me-auto">Job {index + 1}</h2>
        {canRemove && <IconAction danger icon={ACTION_ICONS.delete} label={`Remove job ${index + 1}`} onClick={onRemove} />}
      </div>

      <Row xs={1} md={2} xl={isMultiple ? 5 : 4} className="g-3 mb-3">
        {isMultiple && (
          <Form.Group as={Col} controlId={`${prefix}.scheduleDate`}>
            <Form.Label className="required">Date</Form.Label>
            <Controller
              name={`${prefix}.scheduleDate`}
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  id={`${prefix}.scheduleDate`}
                  min={startDate || undefined}
                  max={endDate || undefined}
                  isInvalid={Boolean(errors?.scheduleDate)}
                />
              )}
            />
            {errors?.scheduleDate && <div className="invalid-feedback d-block">{errors.scheduleDate.message}</div>}
          </Form.Group>
        )}

        <Form.Group as={Col} controlId={`${prefix}.jobId`}>
          <FieldLabel required help={FIELD_HELP.jobId}>
            Job ID
          </FieldLabel>
          <Form.Control
            {...register(`${prefix}.jobId`)}
            autoComplete="off"
            maxLength={MAX_LENGTH.jobId}
            placeholder="Job ID"
            isInvalid={Boolean(errors?.jobId)}
          />
          <Form.Control.Feedback type="invalid">{errors?.jobId?.message}</Form.Control.Feedback>
        </Form.Group>

        {select('supervisorId', 'Supervisor / Programmer', options.supervisors, placeholder.supervisor)}
        {select('operatorId', 'Operator', options.operators, placeholder.operator)}
        {select('shiftId', 'Shift', options.shifts, placeholder.shift)}
      </Row>

      <Row xs={1} md={2} xl={5} className="g-3">
        {select('partId', 'Part', options.parts, placeholder.part, { onPick: () => setValue(`${prefix}.processId`, '') })}

        <Form.Group as={Col} controlId={`${prefix}.quantity`}>
          <Form.Label className="required">Qty.</Form.Label>
          <Form.Control
            {...register(`${prefix}.quantity`)}
            type="number"
            min={1}
            max={MAX_QUANTITY}
            inputMode="numeric"
            placeholder="Qty."
            isInvalid={Boolean(errors?.quantity)}
          />
          <Form.Control.Feedback type="invalid">{errors?.quantity?.message}</Form.Control.Feedback>
        </Form.Group>

        {select('processId', 'Part Process', processes.items, processEmpty, { help: FIELD_HELP.processId })}
        {time('startTime', 'Start Time')}
        <Col>
          {time('endTime', 'End Time')}
          {(shift || minutes !== null) && (
            <Form.Text>
              {minutes !== null && `${formatHoursMinutes(minutes)} hours`}
              {minutes !== null && shift && ' · '}
              {shift && `Shift ${formatClock12(shift.startTime)} – ${formatClock12(shift.endTime)}`}
            </Form.Text>
          )}
        </Col>
      </Row>
    </section>
  )
}

ScheduleJobFields.propTypes = {
  index: PropTypes.number.isRequired,
  control: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  errors: PropTypes.object,
  isMultiple: PropTypes.bool.isRequired,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  options: PropTypes.shape({
    supervisors: PropTypes.arrayOf(optionShape).isRequired,
    operators: PropTypes.arrayOf(optionShape).isRequired,
    shifts: PropTypes.arrayOf(optionShape).isRequired,
    parts: PropTypes.arrayOf(optionShape).isRequired,
  }).isRequired,
  processOptions: PropTypes.func.isRequired,
  shiftsById: PropTypes.instanceOf(Map).isRequired,
  placeholder: PropTypes.objectOf(PropTypes.string).isRequired,
  canRemove: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired,
}

export default ScheduleJobFields
