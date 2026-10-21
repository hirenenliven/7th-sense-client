import { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import IconAction from '@/components/common/IconAction'
import { ACTION_ICONS } from '@/constants/icons'
import { formatDate } from '@/utils/helpers'

function ModelRow({ model, onEdit, onDelete }) {
  const { t } = useTranslation()
  return (
    <tr>
      <td className="font-tabular">{model.id}</td>
      <td className="fw-semibold">{model.name}</td>
      <td className="text-body-secondary">{model.controllerName || '—'}</td>
      <td className="text-body-secondary">{model.brandName || '—'}</td>
      <td className="text-body-secondary text-nowrap">{formatDate(model.updatedAt)}</td>
      <td className="border-start">
        <div className="d-flex gap-1">
          <IconAction icon={ACTION_ICONS.edit} label={t('Edit {{name}}', { name: model.name })} onClick={() => onEdit(model)} />
          <IconAction danger icon={ACTION_ICONS.delete} label={t('Delete {{name}}', { name: model.name })} onClick={() => onDelete(model)} />
        </div>
      </td>
    </tr>
  )
}

ModelRow.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    controllerName: PropTypes.string,
    brandName: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default memo(ModelRow)
