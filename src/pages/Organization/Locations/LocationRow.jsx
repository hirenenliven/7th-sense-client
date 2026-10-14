import { memo } from 'react'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import { ACTION_ICONS } from '@/constants/icons'
import { formatDate } from '@/utils/helpers'

function LocationRow({ location, onEdit, onDelete }) {
  return (
    <tr>
      <td className="font-tabular">{location.id}</td>
      <td className="fw-semibold">{location.name}</td>
      <td className="text-body-secondary">{location.branchName || '—'}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(location.updatedAt)}</td>
      <td className="border-start">
        <div className="d-flex gap-1">
          <IconAction icon={ACTION_ICONS.edit} label={`Edit ${location.name}`} onClick={() => onEdit(location)} />
          <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${location.name}`} onClick={() => onDelete(location)} />
        </div>
      </td>
    </tr>
  )
}

LocationRow.propTypes = {
  location: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    branchName: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(LocationRow)
