// Global toast notifications — call from anywhere (components, services, interceptors):
//
//   import { toast } from '@/utils/toast'
//   toast.success('Customer saved')
//   toast.error('Could not save customer', { title: 'Save failed' })
//   const id = toast.info('Uploading…', { duration: 0 })   // 0 = stays until dismissed
//   toast.dismiss(id)
//
// <Toaster /> (mounted once in App.jsx) renders the queue.

import { TOAST_DEFAULTS } from '@/constants/app'
import i18n from '@/i18n'

const listeners = new Set()
let toasts = []
let nextId = 0

const emit = () => listeners.forEach((listener) => listener())

const setToasts = (updater) => {
  toasts = updater(toasts)
  emit()
}

export const subscribeToasts = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const getToasts = () => toasts

const remove = (id) => setToasts((list) => list.filter((t) => t.id !== id))

const dismiss = (id) => {
  // mark as leaving so the exit animation can play, then remove
  setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)))
  setTimeout(() => remove(id), TOAST_DEFAULTS.exitMs)
}

const show = (type, message, options = {}) => {
  nextId += 1
  const id = options.id ?? `toast-${nextId}`
  const item = {
    id,
    type,
    message,
    title: options.title ?? i18n.t(TOAST_DEFAULTS.titles[type]),
    duration: options.duration ?? TOAST_DEFAULTS.duration[type],
    leaving: false,
    seq: nextId, // new seq on replace → remount → timer restarts
  }

  // replace a toast with the same id (e.g. "Uploading…" → "Uploaded"), keep the newest N
  setToasts((list) => [...list.filter((t) => t.id !== id), item].slice(-TOAST_DEFAULTS.maxVisible))
  return id
}

export const toast = {
  success: (message, options) => show('success', message, options),
  error: (message, options) => show('error', message, options),
  warning: (message, options) => show('warning', message, options),
  info: (message, options) => show('info', message, options),
  dismiss,
  clear: () => setToasts(() => []),
}
