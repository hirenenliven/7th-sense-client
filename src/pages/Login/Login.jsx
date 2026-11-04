import { useLayoutEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Form, InputGroup, Spinner } from 'react-bootstrap'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import BrandLogo from '@/components/common/BrandLogo'
import Loader from '@/components/common/Loader'
import env from '@/config/env'
import { STORAGE_KEYS, THEME } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'
import { readStorage, writeStorage } from '@/utils/storage'
import { forceTheme } from '@/utils/theme'
import { toast } from '@/utils/toast'
import LoginBackdrop from './LoginBackdrop'
import LoginClock from './LoginClock'
import { INITIAL_VALUES, loginSchema } from './loginForm'

// Where to go after login: the protected page that sent the user here, else the dashboard
const redirectTarget = (location) => {
  const from = location.state?.from
  if (!from?.pathname || from.pathname === ROUTES.LOGIN) return ROUTES.HOME
  return `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`
}

function Login() {
  const { user, isChecking, login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  // The login screen is always dark, whatever theme the user chose; leaving it shows their theme
  // again. Layout effect: switches before paint, so a light user never sees a light login flash.
  useLayoutEffect(() => {
    forceTheme(THEME.DARK)
    return () => {
      forceTheme(null)
    }
  }, [])

  const rememberedUsername = readStorage(STORAGE_KEYS.REMEMBERED_USERNAME, '')

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { ...INITIAL_VALUES, username: rememberedUsername, remember: Boolean(rememberedUsername) },
  })

  const onSubmit = async (values) => {
    clearErrors('root.server')
    try {
      await login(values)
      writeStorage(STORAGE_KEYS.REMEMBERED_USERNAME, values.remember ? values.username.trim() : '')
      navigate(redirectTarget(location), { replace: true })
    } catch (error) {
      setError('root.server', { message: error.message })
    }
  }

  const handleForgotPassword = () => {
    toast.info('Please contact your administrator to reset your password.', { title: 'Forgot password' })
  }

  if (isChecking) return <Loader text="Checking your session…" />
  // Already logged in (e.g. opened /login in a new tab)
  if (user) return <Navigate to={redirectTarget(location)} replace />

  return (
    <div className="ts-login">
      <LoginBackdrop />
      <LoginClock />

      <main className="ts-login-main">
        <div className="ts-login-panel">
          <BrandLogo className="ts-login-logo" />
          <h1 className="visually-hidden">Log in to {env.appName}</h1>

          <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label="Login">
            {errors.root?.server && (
              <Alert variant="danger" className="py-2" role="alert">
                {errors.root.server.message}
              </Alert>
            )}

            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                {...register('username')}
                autoComplete="username"
                autoFocus={!rememberedUsername}
                maxLength={50}
                isInvalid={Boolean(errors.username)}
              />
              <Form.Control.Feedback type="invalid">{errors.username?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              {/* The eye button shows / hides the typed password */}
              <InputGroup hasValidation>
                <Form.Control
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  autoFocus={Boolean(rememberedUsername)}
                  maxLength={72}
                  isInvalid={Boolean(errors.password)}
                />
                <Button
                  variant="ghost"
                  onClick={() => setShowPassword((show) => !show)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
                </Button>
                <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <div className="d-flex align-items-center justify-content-between mb-4">
              <Form.Check {...register('remember')} id="remember" label="Remember" className="ts-login-remember mb-0" />
              <Button variant="link" className="ts-login-link" onClick={handleForgotPassword}>
                Forgot Password?
              </Button>
            </div>

            <Button type="submit" className="ts-login-submit w-100" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" />
                  Logging in…
                </>
              ) : (
                'Login'
              )}
            </Button>
          </Form>
        </div>
      </main>
    </div>
  )
}

export default Login
