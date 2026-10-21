#!/usr/bin/env node
// Keeps src/i18n/locales/<code>.json in step with the code. The English text is the key, so nobody
// writes key names or English JSON:
//
//   npm run i18n          collect every key, add new ones to each locale, drop unused ones,
//                         translate the missing ones (DeepL, when DEEPL_API_KEY is set)
//   npm run i18n:check    exit 1 if a locale has an untranslated key (CI)
//
// Keys come from:
//   - the client: t('…'), i18n.t('…'), tk('…'), tkv('…', values) and i18nKey="…" in src/**/*.{js,jsx}
//   - the server: response.NewError(http.X, "…") / newResponse(http.X, "…") in
//     ../7th-sense-server/internal/**/*.go — API messages the client shows (apiClient translates them)
//
// scripts/i18n-glossary.json fixes the translation of exact texts per language (machine terms such as
// "Downtime"); it wins over existing and machine translations. Fix any other translation directly
// in the locale file: existing translations are never overwritten.
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'src')
const LOCALES = join(SRC, 'i18n', 'locales')
const SERVER = join(ROOT, '..', '7th-sense-server', 'internal')
const GLOSSARY = join(ROOT, 'scripts', 'i18n-glossary.json')
const SOURCE_LANGUAGE = 'en'
const CHECK = process.argv.includes('--check')

// ---------------------------------------------------------------------------
// Collect keys
// ---------------------------------------------------------------------------

const walk = (dir, extensions) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return name === 'node_modules' ? [] : walk(path, extensions)
    return extensions.some((ext) => name.endsWith(ext)) ? [path] : []
  })

const unescape = (text) => text.replace(/\\(.)/g, (_, char) => ({ n: '\n', t: '\t' })[char] ?? char)

// t('…') / tk("…") / i18n.t(`…`) — a template literal only without ${…}
const CLIENT_PATTERNS = [
  /\b(?:t|tk|tkv)\(\s*'((?:\\.|[^'\\])*)'/g,
  /\b(?:t|tk|tkv)\(\s*"((?:\\.|[^"\\])*)"/g,
  /\b(?:t|tk|tkv)\(\s*`((?:\\.|[^`\\$])*)`/g,
  /\bi18nKey=(?:\{\s*)?["'`]((?:\\.|[^"'`\\])*)["'`]/g,
]
const SERVER_PATTERNS = [/\b(?:response\.NewError|newResponse)\(\s*http\.\w+,\s*"((?:\\.|[^"\\])*)"\s*\)/g]

const collect = (files, patterns) => {
  const keys = new Map() // key → first file it was seen in
  files.forEach((file) => {
    // Comments are not keys (they quote t('…') as examples): drop block comments and // lines
    const code = readFileSync(file, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')
    patterns.forEach((pattern) => {
      for (const match of code.matchAll(pattern)) {
        const key = unescape(match[1])
        if (key.trim() && !keys.has(key)) keys.set(key, relative(ROOT, file))
      }
    })
    // t(`…${x}…`) cannot be collected: the text changes at run time
    if (/\b(?:t|tk)\(\s*`[^`]*\$\{/.test(code)) {
      console.warn(`! ${relative(ROOT, file)}: t(\`…\${…}\`) is not translatable — use t('… {{name}} …', { name })`)
    }
  })
  return keys
}

const clientKeys = collect(walk(SRC, ['.js', '.jsx']), CLIENT_PATTERNS)
const serverKeys = existsSync(SERVER) ? collect(walk(SERVER, ['.go']), SERVER_PATTERNS) : new Map()
if (!existsSync(SERVER)) console.warn(`! ${relative(ROOT, SERVER)} not found: API messages are not collected`)
const keys = [...new Set([...clientKeys.keys(), ...serverKeys.keys()])].sort((a, b) => a.localeCompare(b, 'en'))

// ---------------------------------------------------------------------------
// Machine translation (DeepL)
// ---------------------------------------------------------------------------

const DEEPL_KEY = process.env.DEEPL_API_KEY
const DEEPL_URL =
  process.env.DEEPL_API_URL ||
  (DEEPL_KEY?.endsWith(':fx') ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate')
const BATCH = 50

// {{name}} must come back untouched: sent as <x>{{name}}</x>, an ignored XML tag
const escapeXml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const protect = (text) => escapeXml(text).replace(/\{\{\s*[\w.]+\s*\}\}/g, (variable) => `<x>${variable}</x>`)
const restore = (text) =>
  text
    .replace(/<\/?x>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')

const translateBatch = async (texts, language) => {
  const response = await fetch(DEEPL_URL, {
    method: 'POST',
    headers: { Authorization: `DeepL-Auth-Key ${DEEPL_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: texts.map(protect),
      source_lang: SOURCE_LANGUAGE.toUpperCase(),
      target_lang: language.toUpperCase(),
      tag_handling: 'xml',
      ignore_tags: ['x'],
    }),
  })
  if (!response.ok) throw new Error(`DeepL ${response.status}: ${await response.text()}`)
  const { translations } = await response.json()
  return translations.map((translation) => restore(translation.text))
}

// ---------------------------------------------------------------------------
// Sync each locale
// ---------------------------------------------------------------------------

const glossary = existsSync(GLOSSARY) ? JSON.parse(readFileSync(GLOSSARY, 'utf8')) : {}
const languages = readdirSync(LOCALES)
  .filter((name) => name.endsWith('.json'))
  .map((name) => name.replace(/\.json$/, ''))
  .filter((code) => code !== SOURCE_LANGUAGE)

let untranslatedTotal = 0
console.log(`${keys.length} keys (${clientKeys.size} client, ${serverKeys.size} server)`)

for (const language of languages) {
  const file = join(LOCALES, `${language}.json`)
  const current = JSON.parse(readFileSync(file, 'utf8') || '{}')
  const terms = glossary[language] ?? {}

  const next = Object.fromEntries(keys.map((key) => [key, terms[key] ?? current[key] ?? '']))
  const removed = Object.keys(current).filter((key) => !(key in next))
  let missing = keys.filter((key) => !next[key])

  if (!CHECK && missing.length && DEEPL_KEY) {
    for (let index = 0; index < missing.length; index += BATCH) {
      const batch = missing.slice(index, index + BATCH)
      const translated = await translateBatch(batch, language)
      batch.forEach((key, position) => {
        next[key] = translated[position]
      })
    }
    console.log(`  ${language}: machine-translated ${missing.length} — review them in ${relative(ROOT, file)}`)
    missing = []
  }

  untranslatedTotal += missing.length
  if (!CHECK) writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`)
  console.log(
    `  ${language}: ${keys.length - missing.length}/${keys.length} translated` +
      (removed.length ? `, ${removed.length} unused removed` : '') +
      (missing.length ? `, ${missing.length} missing (shown in English)` : ''),
  )
  if (CHECK) missing.slice(0, 20).forEach((key) => console.log(`      missing: ${key}`))
}

if (untranslatedTotal && !CHECK && !DEEPL_KEY) {
  console.log('Set DEEPL_API_KEY to translate the missing keys, or fill them in the locale files.')
}
if (CHECK && untranslatedTotal) process.exit(1)
