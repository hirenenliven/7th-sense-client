import { Controller, useFieldArray, useWatch } from 'react-hook-form'
import { Button, Col, Form, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import FieldLabel from '@/components/common/FieldLabel'
import IconAction from '@/components/common/IconAction'
import { ACTION_ICONS } from '@/constants/icons'
import { MACHINE_ACCURACIES } from '@/constants/machines'
import { DURATION_PLACEHOLDER, secondsToDuration } from '@/utils/dateTime'
import DrawingUpload from './DrawingUpload'
import MachinePicker from './MachinePicker'
import { EMPTY_SUB_PROGRAM, MAX_LENGTH, MAX_SUB_PROGRAMS, processSeconds } from './partForm'
import { FIELD_HELP } from './partHelp'
import { useTranslation } from 'react-i18next'

// Sub programs of process `index` (shown when its Sub Program switch is on)
function SubPrograms({ index, control, register, errors }) {
  const { t } = useTranslation()
  const name = `processes.${index}.subPrograms`
  const { fields, append, remove } = useFieldArray({ control, name })
  const listError = errors?.subPrograms

  return (
    <div className="mt-3">
      {fields.map((field, subIndex) => {
        const subErrors = listError?.[subIndex]
        return (
          <Row key={field.id} className="g-3 align-items-start mb-2">
            <Form.Group as={Col} md={6} lg={5} controlId={`${name}.${subIndex}.name`}>
              <Form.Label className="required">{t('Sub Program Name')}</Form.Label>
              <Form.Control
                {...register(`${name}.${subIndex}.name`)}
                autoComplete="off"
                maxLength={MAX_LENGTH.subProgramName}
                placeholder="S_SUB1"
                isInvalid={Boolean(subErrors?.name)}
              />
              <Form.Control.Feedback type="invalid">{subErrors?.name?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} xs={9} md={4} lg={3} controlId={`${name}.${subIndex}.cycleTime`}>
              <Form.Label className="required">{t('Cycle Time')}</Form.Label>
              <Form.Control
                {...register(`${name}.${subIndex}.cycleTime`)}
                autoComplete="off"
                inputMode="numeric"
                placeholder={DURATION_PLACEHOLDER}
                isInvalid={Boolean(subErrors?.cycleTime)}
              />
              <Form.Control.Feedback type="invalid">{subErrors?.cycleTime?.message}</Form.Control.Feedback>
            </Form.Group>
            <Col xs={3} md={2} lg={1} className="pt-md-4 mt-md-2">
              <IconAction danger icon={ACTION_ICONS.delete} label={t('Remove sub program {{n}}', { n: subIndex + 1 })} onClick={() => remove(subIndex)} />
            </Col>
          </Row>
        )
      })}
      {listError?.message && <div className="invalid-feedback d-block mb-2">{listError.message}</div>}
      {listError?.root?.message && <div className="invalid-feedback d-block mb-2">{listError.root.message}</div>}
      <Button variant="ghost" size="sm" onClick={() => append({ ...EMPTY_SUB_PROGRAM })} disabled={fields.length >= MAX_SUB_PROGRAMS}>
        <i className="bi bi-plus-lg me-1" aria-hidden="true" />
        {t('Add sub program')}
      </Button>
    </div>
  )
}

SubPrograms.propTypes = {
  index: PropTypes.number.isRequired,
  control: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
}

// One process of the part: program, machines, drawing, accuracy and times
function ProcessFields({ index, control, register, setValue, errors, machines, machinesPlaceholder, drawingUrl, canRemove, onRemove }) {
  const { t } = useTranslation()
  const prefix = `processes.${index}`
  const process = useWatch({ control, name: prefix })
  const hasSubProgram = Boolean(process?.hasSubProgram)

  const text = (field, label, placeholder, help) => (
    <Form.Group as={Col} controlId={`${prefix}.${field}`}>
      {help ? (
        <FieldLabel required help={help}>
          {label}
        </FieldLabel>
      ) : (
        <Form.Label className="required">{label}</Form.Label>
      )}
      <Form.Control
        {...register(`${prefix}.${field}`)}
        autoComplete="off"
        maxLength={MAX_LENGTH.processText}
        placeholder={placeholder}
        isInvalid={Boolean(errors?.[field])}
      />
      <Form.Control.Feedback type="invalid">{errors?.[field]?.message}</Form.Control.Feedback>
    </Form.Group>
  )

  const duration = (field, label) => (
    <Form.Group as={Col} controlId={`${prefix}.${field}`}>
      <FieldLabel required help={FIELD_HELP.times}>
        {label}
      </FieldLabel>
      <Form.Control
        {...register(`${prefix}.${field}`)}
        autoComplete="off"
        inputMode="numeric"
        placeholder={DURATION_PLACEHOLDER}
        isInvalid={Boolean(errors?.[field])}
      />
      <Form.Control.Feedback type="invalid">{errors?.[field]?.message}</Form.Control.Feedback>
    </Form.Group>
  )

  return (
    <section className="ts-part-process" aria-label={t('Process {{n}}', { n: index + 1 })}>
      <div className="d-flex align-items-center mb-2">
        <h2 className="ts-section-title mb-0 me-auto">{t('Process {{n}}', { n: index + 1 })}</h2>
        {canRemove && <IconAction danger icon={ACTION_ICONS.delete} label={t('Remove process {{n}}', { n: index + 1 })} onClick={onRemove} />}
      </div>

      <Row xs={1} md={2} xl={5} className="g-3">
        {text('process', t('Process'), t('Process'))}
        {text('programName', t('Program Name'), t('Program Name'))}

        <Form.Group as={Col} controlId={`${prefix}.machineIds`}>
          <FieldLabel required help={FIELD_HELP.machineIds}>
            {t('Applicable Machine')}
          </FieldLabel>
          <Controller
            name={`${prefix}.machineIds`}
            control={control}
            render={({ field }) => (
              <MachinePicker
                id={`${prefix}.machineIds`}
                machines={machines}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={machinesPlaceholder}
                disabled={!machines.length}
                isInvalid={Boolean(errors?.machineIds)}
              />
            )}
          />
          {errors?.machineIds && <div className="invalid-feedback d-block">{errors.machineIds.message}</div>}
        </Form.Group>

        {text('drawingNo', t('Drawing No.'), t('Drawing No.'))}
        {text('drawingRevisionNo', t('Drawing Revision No.'), t('Drawing Revision No.'))}

        <Form.Group as={Col}>
          <FieldLabel required help={FIELD_HELP.drawing}>
            {t('Part Drawing (PDF)')}
          </FieldLabel>
          <DrawingUpload
            id={`${prefix}.drawingFile`}
            file={process?.drawingFile ?? ''}
            upload={process?.drawingUpload ?? null}
            name={process?.drawingName ?? ''}
            viewUrl={process?.processId ? drawingUrl(process.processId) : undefined}
            isInvalid={Boolean(errors?.drawingFile)}
            onChange={({ file, upload, name }) => {
              setValue(`${prefix}.drawingUpload`, upload, { shouldDirty: true })
              setValue(`${prefix}.drawingName`, name, { shouldDirty: true })
              setValue(`${prefix}.drawingFile`, file, { shouldDirty: true, shouldValidate: true })
            }}
          />
        </Form.Group>

        <Form.Group as={Col} controlId={`${prefix}.accuracyId`}>
          <Form.Label className="required">{t('Machine Accuracy Level')}</Form.Label>
          <Form.Select {...register(`${prefix}.accuracyId`)} isInvalid={Boolean(errors?.accuracyId)}>
            <option value="">{t('Machine Accuracy')}</option>
            {MACHINE_ACCURACIES.map((option) => (
              <option key={option.id} value={option.id}>
                {t(option.label)}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errors?.accuracyId?.message}</Form.Control.Feedback>
        </Form.Group>

        {duration('setupTime', t('Setup Time'))}
        {duration('cycleTime', t('Cycle Time'))}
        {duration('loadingTime', t('Loading / Unloading Time'))}

        <Form.Group as={Col} controlId={`${prefix}.productionTime`}>
          <FieldLabel help={FIELD_HELP.productionTime}>{t('Production Time')}</FieldLabel>
          <Form.Control value={secondsToDuration(processSeconds(process))} readOnly tabIndex={-1} />
        </Form.Group>
      </Row>

      <div className="ts-part-subprogram">
        <div className="d-flex flex-wrap align-items-center gap-3">
          <FieldLabel help={FIELD_HELP.subProgram}>{t('Sub Program')}</FieldLabel>
          <Form.Check
            type="switch"
            id={`${prefix}.hasSubProgram`}
            label={hasSubProgram ? t('Yes') : t('No')}
            {...register(`${prefix}.hasSubProgram`)}
          />
        </div>
        {hasSubProgram && <SubPrograms index={index} control={control} register={register} errors={errors} />}
      </div>
    </section>
  )
}

ProcessFields.propTypes = {
  index: PropTypes.number.isRequired,
  control: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  errors: PropTypes.object,
  machines: PropTypes.array.isRequired,
  machinesPlaceholder: PropTypes.string.isRequired,
  drawingUrl: PropTypes.func.isRequired,
  canRemove: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired,
}

export default ProcessFields
