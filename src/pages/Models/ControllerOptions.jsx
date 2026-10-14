import PropTypes from 'prop-types'
import { groupByBrand } from './modelForm'

// <option>s of a controller select, grouped by brand. Render inside a <Form.Select>.
function ControllerOptions({ controllers }) {
  return groupByBrand(controllers).map((group) => (
    <optgroup key={group.brandName} label={group.brandName}>
      {group.controllers.map((controller) => (
        <option key={controller.id} value={controller.id}>
          {controller.name}
        </option>
      ))}
    </optgroup>
  ))
}

ControllerOptions.propTypes = {
  controllers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      brandName: PropTypes.string,
    }),
  ).isRequired,
}

export default ControllerOptions
