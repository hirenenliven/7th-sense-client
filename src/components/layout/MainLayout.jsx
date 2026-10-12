import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

function MainLayout() {
  return (
    <div className="app-wrapper">
      <Header />
      <main className="app-main py-4">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
