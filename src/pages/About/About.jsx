import { useTranslation } from 'react-i18next'

function About() {
  const { t } = useTranslation()
  return (
    <div className="bg-body-secondary p-4 rounded-3 shadow-sm">
      <h2>{t('About')}</h2>
      <p className="text-muted mb-0">{t('This is the about page.')}</p>
    </div>
  )
}

export default About
