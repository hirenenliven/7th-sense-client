import { memo } from 'react'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { formatDate } from '@/utils/helpers'

// A country is only added and removed, so the row has a delete action only
function CountryRow({ country, onDelete }) {
  const label = `Delete ${country.name}`

  return (
    <tr>
      <td className="font-tabular">{country.id}</td>
      <td className="fw-semibold">{country.name}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(country.updatedAt)}</td>
      <td className="border-start">
        <Button variant="plain" size="sm" className="btn-icon text-primary" onClick={() => onDelete(country)} aria-label={label} title={label}>
          <i className="bi bi-trash3" aria-hidden="true" />
        </Button>
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
