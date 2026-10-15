import { memo } from 'react'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import useOrgUser from '@/hooks/useOrgUser'
import { ACTION_ICONS } from '@/constants/icons'
import { formatDate } from '@/utils/helpers'

function SupervisorRow({ supervisor, onEdit, onDelete }) {
  const { canEdit, customerLabel } = useOrgUser()
  return (
    <tr>
      <td className="font-tabular">{supervisor.id}</td>
      <td className="fw-semibold">{supervisor.name}</td>
      <td className="text-body-secondary">{supervisor.cellName || '—'}</td>
      <td className="text-body-secondary">{customerLabel(supervisor.userId)}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(supervisor.updatedAt)}</td>
      {canEdit && (
        <td className="border-start">
          <div className="d-flex gap-1">
            <IconAction icon={ACTION_ICONS.edit} label={`Edit ${supervisor.name}`} onClick={() => onEdit(supervisor)} />
            <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${supervisor.name}`} onClick={() => onDelete(supervisor)} />
          </div>
        </td>
      )}
    </tr>
  )
}

SupervisorRow.propTypes = {
  supervisor: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    cellName: PropTypes.string,
    userId: PropTypes.number,
    updatedAt: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(SupervisorRow)
