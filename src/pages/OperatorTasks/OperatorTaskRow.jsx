import { memo } from 'react'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import { ACTION_ICONS } from '@/constants/icons'
import { machineTypeDetail, machineTypeLabel } from './operatorTaskForm'

// One operator task; `isEditing` marks the row loaded into the form
function OperatorTaskRow({ operatorTask, isEditing, customerLabel, onEdit, onDelete }) {
  const detail = machineTypeDetail(operatorTask)
  return (
    <tr className={isEditing ? 'table-active' : undefined}>
      <td className="font-tabular text-body-secondary">{operatorTask.id}</td>
      <td>{customerLabel(operatorTask.userId)}</td>
      <td>
        <div className={operatorTask.modelId ? undefined : 'text-body-secondary fst-italic'}>{machineTypeLabel(operatorTask)}</div>
        {detail && <div className="small text-body-secondary">{detail}</div>}
      </td>
      <td className="fw-semibold">{operatorTask.task}</td>
      <td className="border-start">
        <div className="d-flex gap-1">
          <IconAction icon={ACTION_ICONS.edit} label={`Edit ${operatorTask.task}`} onClick={() => onEdit(operatorTask)} />
          <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${operatorTask.task}`} onClick={() => onDelete(operatorTask)} />
        </div>
      </td>
    </tr>
  )
}

OperatorTaskRow.propTypes = {
  operatorTask: PropTypes.shape({
    id: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    modelId: PropTypes.number,
    modelName: PropTypes.string,
    brandName: PropTypes.string,
    controllerName: PropTypes.string,
    task: PropTypes.string,
  }).isRequired,
  isEditing: PropTypes.bool.isRequired,
  customerLabel: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(OperatorTaskRow)
