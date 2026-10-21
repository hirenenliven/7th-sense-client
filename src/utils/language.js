import i18n from '@/i18n'
import { DEFAULT_LANGUAGE, LANGUAGES } from '@/constants/app'
import { getCurrentUser, saveMyLanguage } from '@/services/customerService'

// Unknown, empty or missing → the default language
export const normalizeLanguage = (language) =>
  LANGUAGES.some((option) => option.code === language) ? language : DEFAULT_LANGUAGE

// Bumped by every pick, so a profile that arrives after a pick does not undo it
let latestRequest = 0

// Saves run one after another, so quick picks reach the server in pick order
let latestSave = Promise.resolve()

// The language picked in the top bar: every translated screen switches at once (i18n re-renders
// them and stores the choice), then it is saved to the user's profile (PUT /me/language).
// Rejects with the server message if it could not be saved; the language stays on screen.
export const chooseLanguage = (language) => {
  const value = normalizeLanguage(language)
  latestRequest += 1
  i18n.changeLanguage(value)
  latestSave = latestSave.catch(() => {}).then(() => saveMyLanguage(value))
  return latestSave
}

// Applies the logged-in user's saved profile language (GET /me). Keeps the current language if it
// cannot be read, if the profile has none, or if a language was picked while it was loading.
export const refreshUserLanguage = async () => {
  const request = latestRequest
  try {
    const user = await getCurrentUser()
    const saved = user?.profile?.language
    if (request === latestRequest && saved) await i18n.changeLanguage(normalizeLanguage(saved))
  } catch {
    // keep the current language
  }
}
