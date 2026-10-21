import { zodResolver as baseZodResolver } from '@hookform/resolvers/zod'
import i18n from '@/i18n'
import { translateText } from '@/i18n/tk'

// Field errors (also nested: field arrays, objects) get their message translated in place
const translateErrors = (errors) => {
  Object.entries(errors ?? {}).forEach(([key, value]) => {
    if (key === 'ref' || !value || typeof value !== 'object') return
    if (typeof value.message === 'string') value.message = translateText(i18n.t, value.message)
    translateErrors(value)
  })
}

// Drop-in for @hookform/resolvers/zod: same signature, the Zod messages (English keys, marked
// with tk() in the schemas) come back in the language on screen. Forms import it from here.
export const zodResolver = (schema, schemaOptions, resolverOptions) => {
  const resolve = baseZodResolver(schema, schemaOptions, resolverOptions)
  return async (...args) => {
    const result = await resolve(...args)
    translateErrors(result.errors)
    return result
  }
}
