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

function StateRow({ state, onDelete }) {
  return (
    <tr>
      <td className="font-tabular">{state.id}</td>
      <td className="fw-semibold">{state.name}</td>
      <td className="text-body-secondary">{state.countryName || '—'}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(state.updatedAt)}</td>
      <td className="border-start">
        <div className="d-flex gap-1">
          <IconAction icon="bi-trash3" label={`Delete ${state.name}`} onClick={() => onDelete(state)} />
        </div>
      </td>
    </tr>
  )
}

StateRow.propTypes = {
  state: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    countryName: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(StateRow)
