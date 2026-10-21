import { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import IconAction from '@/components/common/IconAction'
import { ACTION_ICONS } from '@/constants/icons'
import { formatDate } from '@/utils/helpers'

function ControllerRow({ controller, onEdit, onDelete }) {
  const { t } = useTranslation()
  return (
    <tr>
      <td className="font-tabular">{controller.id}</td>
      <td>
        <div className="fw-semibold">{controller.name}</div>
        {controller.description && <div className="small text-body-secondary text-truncate">{controller.description}</div>}
      </td>
      <td className="text-body-secondary">{controller.brandName || '—'}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(controller.updatedAt)}</td>
      <td className="border-start">
        <div className="d-flex gap-1">
          <IconAction icon={ACTION_ICONS.edit} label={t('Edit {{name}}', { name: controller.name })} onClick={() => onEdit(controller)} />
          <IconAction danger icon={ACTION_ICONS.delete} label={t('Delete {{name}}', { name: controller.name })} onClick={() => onDelete(controller)} />
        </div>
      </td>
    </tr>
  )
}

ControllerRow.propTypes = {
  controller: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    brandName: PropTypes.string,
    description: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(ControllerRow)
