import { z } from 'zod'
import { tk } from '@/i18n/tk'

export const INITIAL_VALUES = {
  username: '',
  password: '',
  remember: false,
}

// Presence and length only (dto/auth_dto.go): a wrong username or password is reported by the
// server as "Invalid username or password", never as a format error.
export const loginSchema = z.object({
  username: z.string().trim().min(1, tk('Username is required')).max(50, tk('Username is too long')),
  password: z.string().min(1, tk('Password is required')).max(72, tk('Password is too long')),
  remember: z.boolean(),
})
