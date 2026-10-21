import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { groupByBrand } from './modelForm'

// <option>s of a controller select, grouped by brand. Render inside a <Form.Select>.
function ControllerOptions({ controllers }) {
  const { t } = useTranslation()
  return groupByBrand(controllers).map((group) => (
    <optgroup key={group.brandName} label={group.brandName || t('No brand')}>
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
