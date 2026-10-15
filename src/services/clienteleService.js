import apiClient, { sharedGet, withQuery } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
// The superadmin sees every customer's clienteles (userId narrows to one customer); everyone else
// their company's. Managers (superadmin, customer, admin) create, update and delete.
const PATH = '/clienteles'

// The server omits `data` for an empty list, so lists fall back to [].
const unwrap = (response) => response.data.data
const unwrapList = (response) => unwrap(response) ?? []

export const getClienteles = async (userId) => unwrapList(await sharedGet(withQuery(PATH, { userId })))

export const getClienteleById = async (id) => unwrap(await sharedGet(`${PATH}/${id}`))

export const createClientele = async (clientele) => unwrap(await apiClient.post(PATH, clientele))

export const updateClientele = async (id, clientele) => unwrap(await apiClient.put(`${PATH}/${id}`, clientele))

// Refused while parts use the clientele
export const deleteClientele = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}
