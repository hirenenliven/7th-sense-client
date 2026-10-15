import { memo } from 'react'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import useOrgUser from '@/hooks/useOrgUser'
import { ACTION_ICONS } from '@/constants/icons'
import { formatDate } from '@/utils/helpers'

function CellRow({ cell, onEdit, onDelete }) {
  const { canEdit, customerLabel } = useOrgUser()
  return (
    <tr>
      <td className="font-tabular">{cell.id}</td>
      <td className="fw-semibold">{cell.name}</td>
      <td className="text-body-secondary">{cell.lineName || '—'}</td>
      <td className="text-body-secondary">{customerLabel(cell.userId)}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(cell.updatedAt)}</td>
      {canEdit && (
        <td className="border-start">
          <div className="d-flex gap-1">
            <IconAction icon={ACTION_ICONS.edit} label={`Edit ${cell.name}`} onClick={() => onEdit(cell)} />
            <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${cell.name}`} onClick={() => onDelete(cell)} />
          </div>
        </td>
      )}
    </tr>
  )
}

CellRow.propTypes = {
  cell: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    lineName: PropTypes.string,
    userId: PropTypes.number,
    updatedAt: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(CellRow)
