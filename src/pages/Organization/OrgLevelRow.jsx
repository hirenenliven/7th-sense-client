import { memo } from 'react'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import useOrgUser from '@/hooks/useOrgUser'
import { ACTION_ICONS } from '@/constants/icons'
import { formatDate } from '@/utils/helpers'

function OrgLevelRow({ row, parentNameField, onEdit, onDelete }) {
  const { canEdit, customerLabel } = useOrgUser()
  return (
    <tr>
      <td className="font-tabular">{row.id}</td>
      <td className="fw-semibold">{row.name}</td>
      <td className="text-body-secondary">{row[parentNameField] || '—'}</td>
      <td className="text-body-secondary">{customerLabel(row.userId)}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(row.updatedAt)}</td>
      {canEdit && (
        <td className="border-start">
          <div className="d-flex gap-1">
            <IconAction icon={ACTION_ICONS.edit} label={`Edit ${row.name}`} onClick={() => onEdit(row)} />
            <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${row.name}`} onClick={() => onDelete(row)} />
          </div>
        </td>
      )}
    </tr>
  )
}

OrgLevelRow.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    userId: PropTypes.number,
    updatedAt: PropTypes.string,
  }).isRequired,
  parentNameField: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(OrgLevelRow)
