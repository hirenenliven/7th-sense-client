import { useState } from 'react'
import { Button, Dropdown, Form, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import BrandLogo from '@/components/common/BrandLogo'
import LiveClock from '@/components/common/LiveClock'
import env from '@/config/env'
import { LANGUAGES, ROLE_LABELS, STORAGE_KEYS, THEME } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'
import useSidebar from '@/hooks/useSidebar'
import useTheme from '@/hooks/useTheme'
import { readStorage, writeStorage } from '@/utils/storage'
import { chooseTheme } from '@/utils/theme'
import { toast } from '@/utils/toast'

// "First Last", else the username
const displayName = (user) => [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || ''

function Topbar() {
  const { isOpen, toggle } = useSidebar()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const [signingOut, setSigningOut] = useState(false)
  const [language, setLanguage] = useState(() => readStorage(STORAGE_KEYS.LANGUAGE, LANGUAGES[0].code))

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value)
    writeStorage(STORAGE_KEYS.LANGUAGE, event.target.value)
  }

  const isLight = theme === THEME.LIGHT
  const handleThemeToggle = () =>
    chooseTheme(isLight ? THEME.DARK : THEME.LIGHT).catch((error) =>
      toast.error(error.message, { title: 'Could not save theme' }),
    )

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await logout()
      toast.success('You have been signed out.', { title: 'Signed out' })
    } catch {
      // the local session is cleared even if the server could not be reached
    } finally {
      setSigningOut(false)
      navigate(ROUTES.LOGIN, { replace: true })
    }
  }

  return (
    <header className="ts-topbar">
      <Link to={ROUTES.HOME} className="ts-brand" aria-label={`${env.appName} home`}>
        <BrandLogo className="ts-brand-mark" />
      </Link>

      <Button
        variant="plain"
        className="ts-menu-toggle"
        onClick={toggle}
        aria-controls="app-sidebar"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'}`} aria-hidden="true" />
        <span className="d-none d-sm-inline">Menu</span>
      </Button>

      <div className="ts-topbar-actions">
        <LiveClock className="d-none d-lg-inline" />

        <Form.Select
          size="sm"
          className="ts-topbar-select"
          value={language}
          onChange={handleLanguageChange}
          aria-label="Language"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </Form.Select>

        <Button
          variant="plain"
          className="btn-icon"
          onClick={handleThemeToggle}
          aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
          title={isLight ? 'Dark theme' : 'Light theme'}
        >
          <i className={`bi ${isLight ? 'bi-moon-stars' : 'bi-sun'}`} aria-hidden="true" />
        </Button>

        <Button variant="plain" className="btn-icon position-relative" aria-label="Notifications">
          <i className="bi bi-bell" aria-hidden="true" />
          <span className="ts-notify-dot" />
        </Button>

        <Dropdown align="end">
          <Dropdown.Toggle
            variant="plain"
            className="ts-user-toggle"
            aria-label={signingOut ? 'Signing out' : 'User menu'}
            aria-busy={signingOut}
            disabled={signingOut}
          >
            <span className="d-none d-md-inline">{signingOut ? 'Signing out…' : displayName(user)}</span>
            <span className="ts-avatar" aria-hidden="true">
              {signingOut ? <Spinner animation="border" size="sm" /> : <i className="bi bi-person-fill" />}
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Header>
              <div className="text-body fw-semibold">{displayName(user)}</div>
              <div className="fs-xs">{ROLE_LABELS[user?.role] ?? user?.role}</div>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item as={Link} to={ROUTES.ACCOUNT}>
              <i className="bi bi-shield-lock" aria-hidden="true" />
              Account Center
            </Dropdown.Item>
            <Dropdown.Item as="button" onClick={handleSignOut} disabled={signingOut}>
              <i className="bi bi-box-arrow-right" aria-hidden="true" />
              Sign out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  )
}

export default Topbar
