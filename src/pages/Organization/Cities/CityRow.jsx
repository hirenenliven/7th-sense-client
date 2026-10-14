import { memo } from 'react'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import { ACTION_ICONS } from '@/constants/icons'
import { formatDate } from '@/utils/helpers'

function CityRow({ city, onEdit, onDelete }) {
  return (
    <tr>
      <td className="font-tabular">{city.id}</td>
      <td className="fw-semibold">{city.name}</td>
      <td className="text-body-secondary">{city.stateName || '—'}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(city.updatedAt)}</td>
      <td className="border-start">
        <div className="d-flex gap-1">
          <IconAction icon={ACTION_ICONS.edit} label={`Edit ${city.name}`} onClick={() => onEdit(city)} />
          <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${city.name}`} onClick={() => onDelete(city)} />
        </div>
      </td>
    </tr>
  )
}

CityRow.propTypes = {
  city: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    stateName: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(CityRow)
