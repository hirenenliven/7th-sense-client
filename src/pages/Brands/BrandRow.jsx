import { memo } from 'react'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import { ACTION_ICONS } from '@/constants/icons'
import { formatDate } from '@/utils/helpers'

function BrandRow({ brand, onEdit, onDelete }) {
  return (
    <tr>
      <td className="font-tabular">{brand.id}</td>
      <td>
        <div className="fw-semibold">{brand.name}</div>
        {brand.description && <div className="small text-body-secondary text-truncate">{brand.description}</div>}
      </td>
      <td className="text-body-secondary font-monospace">{brand.code || '—'}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(brand.updatedAt)}</td>
      <td className="border-start">
        <div className="d-flex gap-1">
          <IconAction icon={ACTION_ICONS.edit} label={`Edit ${brand.name}`} onClick={() => onEdit(brand)} />
          <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${brand.name}`} onClick={() => onDelete(brand)} />
        </div>
      </td>
    </tr>
  )
}

BrandRow.propTypes = {
  brand: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    code: PropTypes.string,
    description: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(BrandRow)
