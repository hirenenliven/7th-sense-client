import { Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import env from '@/config/env'
import { ROUTES } from '@/constants/routes'

function Header() {
  return (
    <Navbar bg="dark" variant="dark" expand="md" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to={ROUTES.HOME}>
          {env.appName}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to={ROUTES.HOME} end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to={ROUTES.ABOUT}>
              About
            </Nav.Link>
            <Nav.Link as={NavLink} to={ROUTES.THEME}>
              Theme
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
