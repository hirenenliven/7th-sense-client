import { memo } from 'react'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import StatusBadge from '@/components/common/StatusBadge'
import { ACTION_ICONS } from '@/constants/icons'
import { TASK_STATUS } from './operatorTaskForm'
import { usageLabel } from './taskListForm'

// One task of the Task List; `isEditing` marks the row loaded into the form
function TaskListRow({ task, isEditing, onEdit, onDelete }) {
  return (
    <tr className={isEditing ? 'table-active' : undefined}>
      <td className="font-tabular text-body-secondary">{task.id}</td>
      <td className="fw-semibold">{task.description}</td>
      <td className={task.usageCount ? undefined : 'text-body-secondary'}>{usageLabel(task.usageCount)}</td>
      <td>
        <StatusBadge active={task.status !== TASK_STATUS.INACTIVE} />
      </td>
      <td className="border-start">
        <div className="d-flex gap-1">
          <IconAction icon={ACTION_ICONS.edit} label={`Edit ${task.description}`} onClick={() => onEdit(task)} />
          <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${task.description}`} onClick={() => onDelete(task)} />
        </div>
      </td>
    </tr>
  )
}

TaskListRow.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string,
    usageCount: PropTypes.number,
  }).isRequired,
  isEditing: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(TaskListRow)
