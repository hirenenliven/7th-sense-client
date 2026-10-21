// Marks English text kept outside a component (constants, Zod messages, help popovers, option
// lists) as a translation key, without translating it: `npm run i18n` collects tk('…') like t('…').
// The text is translated where it is shown — t(label) in the component, or centrally by
// zodResolver (form errors), FieldLabel (help), SortableHead, StatusBadge…
export const tk = (text) => text

// A key with values, for text built from a number: tkv('Up to {{n}} jobs', { n: MAX_ITEMS }).
// Zod messages and help rules are plain strings, so the values travel inside the string;
// translateText unpacks them. Show such text with translateText, not t().
const SEPARATOR = '\u001f'
export const tkv = (text, values) => `${text}${SEPARATOR}${JSON.stringify(values)}`

// t() for text that may come from tkv (zodResolver, InfoTooltip, option lists that use tkv)
export const translateText = (t, text) => {
  if (typeof text !== 'string') return text
  const [key, values] = text.split(SEPARATOR)
  return values ? t(key, JSON.parse(values)) : t(key)
}
