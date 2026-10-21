import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LANGUAGE, LANGUAGES, STORAGE_KEYS } from '@/constants/app'
import { readStorage, writeStorage } from '@/utils/storage'

// The English text is the key: t('Add Clientele'). English needs no file (a missing key shows the
// key itself); locales/<code>.json maps each English text to its translation and is written by
// `npm run i18n` (scripts/i18n.mjs) — never by hand, except to correct a translation.
// New language: add a LANGUAGES entry, an empty locales/<code>.json, then run `npm run i18n`.
const files = import.meta.glob('./locales/*.json', { eager: true, import: 'default' })
const resources = Object.fromEntries(
  Object.entries(files).map(([path, translation]) => [path.match(/([\w-]+)\.json$/)[1], { translation }]),
)

const supported = LANGUAGES.map((lang) => lang.code)
const stored = readStorage(STORAGE_KEYS.LANGUAGE, DEFAULT_LANGUAGE)

i18n.use(initReactI18next).init({
  resources,
  lng: supported.includes(stored) ? stored : DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: supported,
  // Keys are sentences: "." and ":" are ordinary characters, not nesting / namespace separators
  keySeparator: false,
  nsSeparator: false,
  returnEmptyString: false, // a key not translated yet ("") shows the English text
  interpolation: { escapeValue: false }, // React already escapes
})

const syncHtmlLang = (lng) => document.documentElement.setAttribute('lang', lng)
syncHtmlLang(i18n.language)
i18n.on('languageChanged', (lng) => {
  syncHtmlLang(lng)
  writeStorage(STORAGE_KEYS.LANGUAGE, lng)
})

export default i18n
