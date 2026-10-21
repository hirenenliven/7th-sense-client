import { Button, Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import env from '@/config/env'
import { ROUTES } from '@/constants/routes'
import { Trans, useTranslation } from 'react-i18next'
import { tk } from '@/i18n/tk'

function Home() {
  const { t } = useTranslation()
  return (
    <>
      <div className="p-5 mb-4 bg-body-secondary rounded-3 shadow-sm">
        <h1 className="display-5 fw-bold">{t('Welcome to {{app}}', { app: env.appName })}</h1>
        <p className="fs-5 text-muted">
          <Trans i18nKey="React + Vite + Bootstrap starter. Start building in <c>src/pages</c>." components={{ c: <code /> }} />
        </p>
        <Button as={Link} to={ROUTES.ABOUT} variant="primary" size="lg">
          {t('Learn more')}
        </Button>
      </div>

      <Row xs={1} md={3} className="g-4">
        {[tk('Components'), tk('Pages'), tk('Services')].map((title) => (
          <Col key={title}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>{t(title)}</Card.Title>
                <Card.Text className="text-muted">
                  {t('Organize your {{items}} inside their dedicated folder.', { items: t(title).toLowerCase() })}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default Home
