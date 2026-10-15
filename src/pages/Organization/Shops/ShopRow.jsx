import { memo } from 'react'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import useOrgUser from '@/hooks/useOrgUser'
import { ACTION_ICONS } from '@/constants/icons'
import { formatDate } from '@/utils/helpers'

function ShopRow({ shop, onEdit, onDelete }) {
  const { canEdit, customerLabel } = useOrgUser()
  return (
    <tr>
      <td className="font-tabular">{shop.id}</td>
      <td className="fw-semibold">{shop.name}</td>
      <td className="text-body-secondary">{shop.locationName || '—'}</td>
      <td className="text-body-secondary">{customerLabel(shop.userId)}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(shop.updatedAt)}</td>
      {canEdit && (
        <td className="border-start">
          <div className="d-flex gap-1">
            <IconAction icon={ACTION_ICONS.edit} label={`Edit ${shop.name}`} onClick={() => onEdit(shop)} />
            <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${shop.name}`} onClick={() => onDelete(shop)} />
          </div>
        </td>
      )}
    </tr>
  )
}

ShopRow.propTypes = {
  shop: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    locationName: PropTypes.string,
    userId: PropTypes.number,
    updatedAt: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(ShopRow)
