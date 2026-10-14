import { Button, Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import env from '@/config/env'
import { ROUTES } from '@/constants/routes'

function Home() {
  return (
    <>
      <div className="p-5 mb-4 bg-body-secondary rounded-3 shadow-sm">
        <h1 className="display-5 fw-bold">Welcome to {env.appName}</h1>
        <p className="fs-5 text-muted">
          React + Vite + Bootstrap starter. Start building in <code>src/pages</code>.
        </p>
        <Button as={Link} to={ROUTES.ABOUT} variant="primary" size="lg">
          Learn more
        </Button>
      </div>

      <Row xs={1} md={3} className="g-4">
        {['Components', 'Pages', 'Services'].map((title) => (
          <Col key={title}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text className="text-muted">
                  Organize your {title.toLowerCase()} inside their dedicated folder.
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
