import { memo } from 'react'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import useOrgUser from '@/hooks/useOrgUser'
import { ACTION_ICONS } from '@/constants/icons'
import { formatDate } from '@/utils/helpers'

function StateRow({ state, onDelete }) {
  const { canAssign, customerLabel } = useOrgUser()
  return (
    <tr>
      <td className="font-tabular">{state.id}</td>
      <td className="fw-semibold">{state.name}</td>
      <td className="text-body-secondary">{state.countryName || '—'}</td>
      <td className="text-body-secondary">{customerLabel(state.userId)}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(state.updatedAt)}</td>
      {canAssign && (
        <td className="border-start">
          <div className="d-flex gap-1">
            <IconAction danger icon={ACTION_ICONS.delete} label={`Delete ${state.name}`} onClick={() => onDelete(state)} />
          </div>
        </td>
      )}
    </tr>
  )
}

StateRow.propTypes = {
  state: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    countryName: PropTypes.string,
    userId: PropTypes.number,
    updatedAt: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(StateRow)
