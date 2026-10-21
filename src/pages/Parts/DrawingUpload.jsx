import { useRef } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import { ACTION_ICONS } from '@/constants/icons'
import { fileRule } from '@/utils/validators'
import { toast } from '@/utils/toast'
import { DRAWING_RULES } from './partForm'
import { useTranslation } from 'react-i18next'
import { translateText } from '@/i18n/tk'

const checkDrawing = fileRule(DRAWING_RULES)

// Part drawing (PDF) of one process. Picking a file only keeps it in the form ({ upload, name },
// stored `file` cleared); AddPart uploads it when the part is saved, so files picked and replaced
// before saving are never stored. `file`: the saved drawing's stored name, `viewUrl`: where to open it.
function DrawingUpload({ id, file, upload = null, name, viewUrl, onChange, isInvalid = false, disabled = false }) {
  const { t } = useTranslation()
  const inputRef = useRef(null)
  const hasDrawing = Boolean(file || upload)

  const handlePick = (event) => {
    const picked = event.target.files?.[0]
    event.target.value = '' // the same file can be picked again
    if (!picked) return
    const problem = checkDrawing(picked)
    if (problem) {
      toast.error(problem === 'Unsupported file type' ? t('Choose a PDF file.') : translateText(t, problem), { title: t('Could not use this drawing') })
      return
    }
    onChange({ file: '', upload: picked, name: picked.name })
  }

  return (
    <>
      <InputGroup hasValidation>
        <Form.Control
          id={id}
          readOnly
          value={name}
          placeholder={t('Choose PDF')}
          onClick={() => !disabled && inputRef.current?.click()}
          isInvalid={isInvalid}
        />
        {file && !upload && viewUrl && (
          <Button as="a" variant="ghost" href={viewUrl} target="_blank" rel="noopener noreferrer" aria-label={t('View {{name}}', { name: name })}>
            <i className="bi bi-file-earmark-pdf" aria-hidden="true" />
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          aria-label={hasDrawing ? t('Replace part drawing') : t('Choose part drawing')}
        >
          <i className="bi bi-plus-square" aria-hidden="true" />
        </Button>
        {hasDrawing && (
          <IconAction
            danger
            icon={ACTION_ICONS.remove}
            label={t('Remove part drawing')}
            onClick={() => onChange({ file: '', upload: null, name: '' })}
          />
        )}
        <Form.Control.Feedback type="invalid">{t('Part drawing (PDF) is required')}</Form.Control.Feedback>
      </InputGroup>
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="d-none" onChange={handlePick} tabIndex={-1} aria-hidden="true" />
    </>
  )
}

DrawingUpload.propTypes = {
  id: PropTypes.string.isRequired,
  file: PropTypes.string.isRequired,
  upload: PropTypes.instanceOf(File),
  name: PropTypes.string.isRequired,
  viewUrl: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isInvalid: PropTypes.bool,
  disabled: PropTypes.bool,
}

export default DrawingUpload
