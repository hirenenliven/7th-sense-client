import apiClient, { sharedGet, withQuery } from './apiClient'
import { apiBaseUrl } from '@/utils/loginAs'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
// The superadmin sees every customer's parts (userId narrows to one customer); everyone else their
// company's. Managers (superadmin, customer, admin) create, update and delete.
const PATH = '/parts'

// A 10 MB drawing needs longer than the default 15 s on a slow connection
const UPLOAD_TIMEOUT_MS = 120000

// The server omits `data` for an empty list, so lists fall back to [].
const unwrap = (response) => response.data.data
const unwrapList = (response) => unwrap(response) ?? []

// List rows carry no processes (only processCount); GET /parts/{id} has them
export const getParts = async (userId) => unwrapList(await sharedGet(withQuery(PATH, { userId })))

export const getPartById = async (id) => unwrap(await sharedGet(`${PATH}/${id}`))

export const createPart = async (part) => unwrap(await apiClient.post(PATH, part))

// Processes with an id are updated, without one added; saved processes left out are deleted
export const updatePart = async (id, part) => unwrap(await apiClient.put(`${PATH}/${id}`, part))

export const deletePart = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}

// Stores a drawing PDF → { file, name }: put them in a process's drawingFile / drawingName.
// The explicit multipart type stops axios turning the FormData into JSON (the client default).
export const uploadPartDrawing = async (file) => {
  const form = new FormData()
  form.append('file', file)
  return unwrap(
    await apiClient.post(`${PATH}/drawings`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: UPLOAD_TIMEOUT_MS,
    }),
  )
}

// Opens in a new tab; the session cookie goes with it (same origin)
export const partDrawingUrl = (partId, processId) => `${apiBaseUrl()}${PATH}/${partId}/processes/${processId}/drawing`
