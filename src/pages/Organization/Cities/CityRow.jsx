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

function CityRow({ city, onEdit, onDelete }) {
  return (
    <tr>
      <td className="font-tabular">{city.id}</td>
      <td className="fw-semibold">{city.name}</td>
      <td className="text-body-secondary">{city.stateName || '—'}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(city.updatedAt)}</td>
      <td className="border-start">
        <div className="d-flex gap-1">
          <IconAction icon="bi-pencil-square" label={`Edit ${city.name}`} onClick={() => onEdit(city)} />
          <IconAction icon="bi-trash3" label={`Delete ${city.name}`} onClick={() => onDelete(city)} />
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
