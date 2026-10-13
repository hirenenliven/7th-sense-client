import { Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import InfoTooltip from './InfoTooltip'

// Form label with an optional help popover. The (i) button sits beside the <label>, not inside it,
// so it does not leak into the input's accessible name. Use inside a Form.Group with controlId.
function FieldLabel({ children, required = false, help }) {
  return (
    <div className="ts-field-label">
      <Form.Label className={required ? 'required' : undefined}>{children}</Form.Label>
      {help && <InfoTooltip {...help} />}
    </div>
  )
}

FieldLabel.propTypes = {
  children: PropTypes.node.isRequired,
  required: PropTypes.bool,
  help: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired,
    example: PropTypes.string,
    rules: PropTypes.arrayOf(PropTypes.string),
  }),
}

export default FieldLabel
