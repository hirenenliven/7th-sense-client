import { memo } from 'react'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import useOrgUser from '@/hooks/useOrgUser'
import { ACTION_ICONS } from '@/constants/icons'
import { formatDate } from '@/utils/helpers'
import { useTranslation } from 'react-i18next'

function LineRow({ line, onEdit, onDelete }) {
  const { t } = useTranslation()
  const { canEdit, customerLabel } = useOrgUser()
  return (
    <tr>
      <td className="font-tabular">{line.id}</td>
      <td className="fw-semibold">{line.name}</td>
      <td className="text-body-secondary">{line.shopName || '—'}</td>
      <td className="text-body-secondary">{customerLabel(line.userId)}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(line.updatedAt)}</td>
      {canEdit && (
        <td className="border-start">
          <div className="d-flex gap-1">
            <IconAction icon={ACTION_ICONS.edit} label={t('Edit {{name}}', { name: line.name })} onClick={() => onEdit(line)} />
            <IconAction danger icon={ACTION_ICONS.delete} label={t('Delete {{name}}', { name: line.name })} onClick={() => onDelete(line)} />
          </div>
        </td>
      )}
    </tr>
  )
}

LineRow.propTypes = {
  line: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    shopName: PropTypes.string,
    userId: PropTypes.number,
    updatedAt: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(LineRow)
