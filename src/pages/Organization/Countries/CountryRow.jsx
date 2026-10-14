import { memo } from 'react'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import { ACTION_ICONS } from '@/constants/icons'
import { formatDate } from '@/utils/helpers'

// A country is only added and removed, so the row has a delete action only
function CountryRow({ country, onDelete }) {
  return (
    <tr>
      <td className="font-tabular">{country.id}</td>
      <td className="fw-semibold">{country.name}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(country.updatedAt)}</td>
      <td className="border-start">
        <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${country.name}`} onClick={() => onDelete(country)} />
      </td>
    </tr>
  )
}

CountryRow.propTypes = {
  country: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    updatedAt: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(CountryRow)
