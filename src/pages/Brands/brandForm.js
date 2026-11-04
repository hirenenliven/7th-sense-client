import { z } from 'zod'

// Matches the brands columns (dto/brand_dto.go, dto/catalog_dto.go)
export const MAX_LENGTH = {
  name: 100,
  code: 50,
  description: 1000,
}

// Server: catalogCodePattern (upper-cased before the check)
const CODE_PATTERN = /^[A-Z0-9_-]{2,50}$/

export const INITIAL_VALUES = {
  name: '',
  code: '',
  description: '',
}

export const brandSchema = z.object({
  name: z.string().trim().min(1, 'Brand name is required').max(MAX_LENGTH.name, 'Name is too long'),
  code: z
    .string()
    .trim()
    .refine((code) => !code || CODE_PATTERN.test(code.toUpperCase()), 'Use 2 to 50 letters, numbers, - or _'),
  description: z.string().trim().max(MAX_LENGTH.description, 'Description is too long'),
})

// ---------------------------------------------------------------------------
// API mapping — form values ⇄ /brands body ({ name, code, description })
// ---------------------------------------------------------------------------

export const toBrandPayload = (values) => ({
  name: values.name.trim(),
  code: values.code.trim().toUpperCase(),
  description: values.description.trim(),
})

// GET /brands record → form values
export const toFormValues = (brand) => ({
  name: brand.name ?? '',
  code: brand.code ?? '',
  description: brand.description ?? '',
})
