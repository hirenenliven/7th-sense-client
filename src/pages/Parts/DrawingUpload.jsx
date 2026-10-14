import { useRef, useState } from 'react'
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import { ACTION_ICONS } from '@/constants/icons'
import { uploadPartDrawing } from '@/services/partService'
import { fileRule } from '@/utils/validators'
import { toast } from '@/utils/toast'
import { DRAWING_RULES } from './partForm'

const checkDrawing = fileRule(DRAWING_RULES)

// Part drawing (PDF) of one process. Picking a file uploads it at once (POST /parts/drawings) and
// hands { file, name } to onChange; the part saves only that reference. `viewUrl`: the saved drawing.
function DrawingUpload({ id, file, name, viewUrl, onChange, isInvalid = false, disabled = false }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handlePick = async (event) => {
    const picked = event.target.files?.[0]
    event.target.value = '' // the same file can be picked again
    if (!picked) return
    const problem = checkDrawing(picked)
    if (problem) {
      toast.error(problem === 'Unsupported file type' ? 'Choose a PDF file.' : problem, { title: 'Could not use this drawing' })
      return
    }
    setUploading(true)
    try {
      const drawing = await uploadPartDrawing(picked)
      onChange({ file: drawing.file, name: drawing.name })
    } catch (error) {
      toast.error(error.message, { title: 'Could not upload drawing' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <InputGroup hasValidation>
        <Form.Control
          id={id}
          readOnly
          value={uploading ? 'Uploading…' : name}
          placeholder="Choose PDF"
          onClick={() => !disabled && !uploading && inputRef.current?.click()}
          isInvalid={isInvalid}
        />
        {file && viewUrl && (
          <Button as="a" variant="ghost" href={viewUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${name}`}>
            <i className="bi bi-file-earmark-pdf" aria-hidden="true" />
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || uploading}
          aria-label={file ? 'Replace part drawing' : 'Upload part drawing'}
        >
          {uploading ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <i className="bi bi-plus-square" aria-hidden="true" />}
        </Button>
        {file && !uploading && (
          <IconAction danger icon={ACTION_ICONS.remove} label="Remove part drawing" onClick={() => onChange({ file: '', name: '' })} />
        )}
        <Form.Control.Feedback type="invalid">Part drawing (PDF) is required</Form.Control.Feedback>
      </InputGroup>
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="d-none" onChange={handlePick} tabIndex={-1} aria-hidden="true" />
    </>
  )
}

DrawingUpload.propTypes = {
  id: PropTypes.string.isRequired,
  file: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  viewUrl: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isInvalid: PropTypes.bool,
  disabled: PropTypes.bool,
}

export default DrawingUpload
