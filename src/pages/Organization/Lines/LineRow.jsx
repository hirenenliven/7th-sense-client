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

function LineRow({ line, onEdit, onDelete }) {
  return (
    <tr>
      <td className="font-tabular">{line.id}</td>
      <td className="fw-semibold">{line.name}</td>
      <td className="text-body-secondary">{line.shopName || '—'}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(line.updatedAt)}</td>
      <td className="border-start">
        <div className="d-flex gap-1">
          <IconAction icon="bi-pencil-square" label={`Edit ${line.name}`} onClick={() => onEdit(line)} />
          <IconAction icon="bi-trash3" label={`Delete ${line.name}`} onClick={() => onDelete(line)} />
        </div>
      </td>
    </tr>
  )
}

LineRow.propTypes = {
  line: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    shopName: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(LineRow)
