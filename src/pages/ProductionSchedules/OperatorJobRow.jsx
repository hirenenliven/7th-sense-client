import { memo } from 'react'
import PropTypes from 'prop-types'
import { dateLabel, machineLabel, partLabel, periodLabel } from './operatorScheduleSettings'

// One job of the Operator Wise Production Schedule; showCustomer (superadmin) adds the Customer column
function OperatorJobRow({ job, serialNo, showCustomer, customerLabel }) {
  return (
    <tr>
      <td className="font-tabular text-body-secondary">{serialNo}</td>
      <td className="font-tabular text-nowrap">{dateLabel(job)}</td>
      <td className="fw-semibold">{job.operatorName || '—'}</td>
      <td className="text-body-secondary">{job.shiftName || '—'}</td>
      <td className="font-tabular">{job.jobId || '—'}</td>
      <td className="font-tabular">{job.quantity}</td>
      <td>{machineLabel(job) || '—'}</td>
      <td className="font-tabular text-nowrap">{periodLabel(job)}</td>
      <td>{partLabel(job) || '—'}</td>
      <td className="font-tabular text-body-secondary">{job.programName || '—'}</td>
      {showCustomer && <td className="text-body-secondary">{customerLabel(job.userId)}</td>}
    </tr>
  )
}

OperatorJobRow.propTypes = {
  job: PropTypes.shape({
    itemId: PropTypes.number.isRequired,
    userId: PropTypes.number,
    scheduleDate: PropTypes.string,
    operatorName: PropTypes.string,
    shiftName: PropTypes.string,
    jobId: PropTypes.string,
    quantity: PropTypes.number,
    machineName: PropTypes.string,
    modelName: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    partNo: PropTypes.string,
    partName: PropTypes.string,
    programName: PropTypes.string,
  }).isRequired,
  serialNo: PropTypes.number.isRequired,
  showCustomer: PropTypes.bool.isRequired,
  customerLabel: PropTypes.func.isRequired,
}

export default memo(OperatorJobRow)
