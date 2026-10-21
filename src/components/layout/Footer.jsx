import { useTranslation } from 'react-i18next'
import env from '@/config/env'

function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="ts-footer">
      &copy; {new Date().getFullYear()} {env.appName}. {t('All rights reserved.')}
    </footer>
  )
}

export default Footer
