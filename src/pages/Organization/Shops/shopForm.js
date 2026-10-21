import { z } from 'zod'
import { tk } from '@/i18n/tk'

// Matches user_shop.name VARCHAR(100) (dto/user_shop_dto.go)
export const NAME_MAX_LENGTH = 100

export const INITIAL_VALUES = {
  userLocationId: '',
  name: '',
}

export const shopSchema = z.object({
  userLocationId: z.string().min(1, tk('Location is required')),
  name: z.string().trim().min(1, tk('Shop is required')).max(NAME_MAX_LENGTH, tk('Name is too long')),
})

// ---------------------------------------------------------------------------
// API mapping — form values ⇄ /user-shop body ({ userLocationId, name })
// ---------------------------------------------------------------------------

export const toShopPayload = (values) => ({
  userLocationId: Number(values.userLocationId),
  name: values.name.trim(),
})

// GET /user-shop record → form values
export const toFormValues = (shop) => ({
  userLocationId: shop.userLocationId ? String(shop.userLocationId) : '',
  name: shop.name ?? '',
})
