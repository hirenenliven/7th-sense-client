import { z } from 'zod'
import { tk } from '@/i18n/tk'

// Matches models.name VARCHAR(100) (dto/machine_model_dto.go)
export const NAME_MAX_LENGTH = 100

export const INITIAL_VALUES = {
  controllerId: '',
  name: '',
}

export const modelSchema = z.object({
  controllerId: z.string().min(1, tk('Controller is required')),
  name: z.string().trim().min(1, tk('Model name is required')).max(NAME_MAX_LENGTH, tk('Name is too long')),
})

// ---------------------------------------------------------------------------
// API mapping — form values ⇄ /models body ({ controllerId, name })
// ---------------------------------------------------------------------------

export const toModelPayload = (values) => ({
  controllerId: Number(values.controllerId),
  name: values.name.trim(),
})

// GET /models record → form values
export const toFormValues = (model) => ({
  controllerId: model.controllerId ? String(model.controllerId) : '',
  name: model.name ?? '',
})

// Controllers grouped by brand for <optgroup>s: [{ brandName, controllers: [...] }], in list order
export const groupByBrand = (controllers) => {
  const groups = new Map()
  controllers.forEach((controller) => {
    const brandName = controller.brandName || ''
    if (!groups.has(brandName)) groups.set(brandName, [])
    groups.get(brandName).push(controller)
  })
  return [...groups].map(([brandName, list]) => ({ brandName, controllers: list }))
}
