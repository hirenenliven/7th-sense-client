import { useState } from 'react'
import { Button, Dropdown, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import LiveClock from '@/components/common/LiveClock'
import env from '@/config/env'
import { DEMO_USER, LANGUAGES, STORAGE_KEYS } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import useSidebar from '@/hooks/useSidebar'
import { readStorage, writeStorage } from '@/utils/storage'

function Topbar() {
  const { isOpen, toggle } = useSidebar()
  const [language, setLanguage] = useState(() => readStorage(STORAGE_KEYS.LANGUAGE, LANGUAGES[0].code))

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value)
    writeStorage(STORAGE_KEYS.LANGUAGE, event.target.value)
  }

  return (
    <header className="ts-topbar">
      <Link to={ROUTES.HOME} className="ts-brand" aria-label={`${env.appName} home`}>
        <span className="ts-brand-mark" aria-hidden="true">
          7
        </span>
        <span className="ts-brand-name d-none d-sm-inline">{env.appName}</span>
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

        <Button variant="plain" className="btn-icon position-relative" aria-label="Notifications">
          <i className="bi bi-bell" aria-hidden="true" />
          <span className="ts-notify-dot" />
        </Button>

        <Dropdown align="end">
          <Dropdown.Toggle variant="plain" className="ts-user-toggle" aria-label="User menu">
            <span className="d-none d-md-inline">{DEMO_USER.name}</span>
            <span className="ts-avatar" aria-hidden="true">
              <i className="bi bi-person-fill" />
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Header>
              <div className="text-body fw-semibold">{DEMO_USER.name}</div>
              <div className="fs-xs">{DEMO_USER.role}</div>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item as={Link} to={ROUTES.ACCOUNT}>
              <i className="bi bi-shield-lock me-2" aria-hidden="true" />
              Account Center
            </Dropdown.Item>
            <Dropdown.Item as="button">
              <i className="bi bi-box-arrow-right me-2" aria-hidden="true" />
              Sign out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  )
}

export default Topbar
