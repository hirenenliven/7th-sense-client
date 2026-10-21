import { memo } from 'react'
import { Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import { ACTION_ICONS } from '@/constants/icons'
import { ROLE_LABELS, USER_STATUS } from '@/constants/app'
import { ACCOUNT_KIND } from './accountPages'
import { customerMobile, customerName } from './customerFormat'
import { useTranslation } from 'react-i18next'
import { tk } from '@/i18n/tk'

// One account of CustomerList. Users show their role; customers their statement and the
// customer-only actions (settings, log in as).
function CustomerRow({ kind = ACCOUNT_KIND.CUSTOMER, customer, statusBusy, onToggleStatus, onView, onEdit, onDelete, onUnavailable }) {
  const { t } = useTranslation()
  const isUser = kind === ACCOUNT_KIND.USER
  const name = customerName(customer)
  const isActive = customer.status !== USER_STATUS.INACTIVE

  return (
    <tr>
      <td className="font-tabular">{customer.id}</td>
      <td>{customer.username}</td>
      <td className="fw-semibold">{name}</td>
      {isUser && <td>{ROLE_LABELS[customer.role] ? t(ROLE_LABELS[customer.role]) : customer.role}</td>}
      <td className="text-body-secondary">{customer.email}</td>
      <td className="text-nowrap text-body-secondary">{customerMobile(customer)}</td>
      <td>
        <Form.Check
          type="switch"
          id={`customer-status-${customer.id}`}
          checked={isActive}
          disabled={statusBusy}
          onChange={() => onToggleStatus(customer)}
          aria-label={isActive ? t('{{name}} is active', { name }) : t('{{name}} is inactive', { name })}
        />
      </td>
      {!isUser && (
        <td>
          <IconAction icon={ACTION_ICONS.statement} label={t('Statement of {{name}}', { name })} onClick={() => onUnavailable(tk('Statement'))} />
        </td>
      )}
      <td>
        <IconAction icon={ACTION_ICONS.view} label={t('View {{name}}', { name: name })} onClick={() => onView(customer)} />
      </td>
      <td className="border-start">
        <div className="d-flex gap-1">
          {!isUser && (
            <>
              <IconAction icon={ACTION_ICONS.settings} label={t('Settings for {{name}}', { name })} onClick={() => onUnavailable(tk('Customer settings'))} />
              <IconAction icon={ACTION_ICONS.loginAs} label={t('Log in as {{name}}', { name })} onClick={() => onUnavailable(tk('Log in as customer'))} />
            </>
          )}
          <IconAction icon={ACTION_ICONS.edit} label={t('Edit {{name}}', { name: name })} onClick={() => onEdit(customer)} />
          <IconAction danger icon={ACTION_ICONS.delete} label={t('Delete {{name}}', { name: name })} onClick={() => onDelete(customer)} />
        </div>
      </td>
    </tr>
  )
}

CustomerRow.propTypes = {
  kind: PropTypes.oneOf(Object.values(ACCOUNT_KIND)),
  customer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string,
    role: PropTypes.string,
    email: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  statusBusy: PropTypes.bool.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUnavailable: PropTypes.func.isRequired,
}

export default memo(CustomerRow)
