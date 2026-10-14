import { z } from 'zod'

// Matches the controllers columns (dto/controller_dto.go, dto/catalog_dto.go)
export const MAX_LENGTH = {
  name: 100,
  description: 1000,
}

export const INITIAL_VALUES = {
  brandId: '',
  name: '',
  description: '',
}

export const controllerSchema = z.object({
  brandId: z.string().min(1, 'Brand is required'),
  name: z.string().trim().min(1, 'Controller name is required').max(MAX_LENGTH.name, 'Name is too long'),
  description: z.string().trim().max(MAX_LENGTH.description, 'Description is too long'),
})

// ---------------------------------------------------------------------------
// API mapping — form values ⇄ /controllers body ({ brandId, name, description })
// ---------------------------------------------------------------------------

export const toControllerPayload = (values) => ({
  brandId: Number(values.brandId),
  name: values.name.trim(),
  description: values.description.trim(),
})

// GET /controllers record → form values
export const toFormValues = (controller) => ({
  brandId: controller.brandId ? String(controller.brandId) : '',
  name: controller.name ?? '',
  description: controller.description ?? '',
})
