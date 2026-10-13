import { memo } from 'react'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { formatDate } from '@/utils/helpers'

function IconAction({ icon, label, onClick }) {
  return (
    <Button variant="plain" size="sm" className="btn-icon text-primary" onClick={onClick} aria-label={label} title={label}>
      <i className={`bi ${icon}`} aria-hidden="true" />
    </Button>
  )
}

IconAction.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

function ShopRow({ shop, onEdit, onDelete }) {
  return (
    <tr>
      <td className="font-tabular">{shop.id}</td>
      <td className="fw-semibold">{shop.name}</td>
      <td className="text-body-secondary">{shop.locationName || '—'}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(shop.updatedAt)}</td>
      <td className="border-start">
        <div className="d-flex gap-1">
          <IconAction icon="bi-pencil-square" label={`Edit ${shop.name}`} onClick={() => onEdit(shop)} />
          <IconAction icon="bi-trash3" label={`Delete ${shop.name}`} onClick={() => onDelete(shop)} />
        </div>
      </td>
    </tr>
  )
}

ShopRow.propTypes = {
  shop: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    locationName: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(ShopRow)
