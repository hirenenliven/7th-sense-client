import { memo } from 'react'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import { ACTION_ICONS } from '@/constants/icons'
import { usageLabel } from './machineAccuracyForm'

// One accuracy of the Machine Accuracy list; `isEditing` marks the row loaded into the form
function MachineAccuracyRow({ accuracy, isEditing, onEdit, onDelete }) {
  return (
    <tr className={isEditing ? 'table-active' : undefined}>
      <td className="font-tabular text-body-secondary">{accuracy.id}</td>
      <td className="fw-semibold">{accuracy.name}</td>
      <td className={accuracy.usageCount ? undefined : 'text-body-secondary'}>{usageLabel(accuracy.usageCount)}</td>
      <td className="border-start">
        <div className="d-flex gap-1">
          <IconAction icon={ACTION_ICONS.edit} label={`Edit ${accuracy.name}`} onClick={() => onEdit(accuracy)} />
          <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${accuracy.name}`} onClick={() => onDelete(accuracy)} />
        </div>
      </td>
    </tr>
  )
}

MachineAccuracyRow.propTypes = {
  accuracy: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    usageCount: PropTypes.number,
  }).isRequired,
  isEditing: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(MachineAccuracyRow)
