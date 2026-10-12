import { Container } from 'react-bootstrap'
import env from '@/config/env'

function Footer() {
  return (
    <footer className="bg-dark text-white-50 py-3 mt-auto">
      <Container className="text-center small">
        &copy; {new Date().getFullYear()} {env.appName}. All rights reserved.
      </Container>
    </footer>
  )
}

export default Footer
