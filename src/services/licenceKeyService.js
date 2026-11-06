import apiClient, { sharedGet, withQuery, unwrap, unwrapList } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
// Licence keys the superadmin generates for a customer ("K7M2Q-XR9TB-4HWZP-N8CDF"). The superadmin
// sees every customer's (userId narrows to one customer); a customer and its admins read their
// company's. Only the superadmin generates, saves, updates and deletes.
const PATH = '/licence-keys'

export const getLicenceKeys = async (userId) => unwrapList(await sharedGet(withQuery(PATH, { userId })))

// New keys, not saved yet: { licenceKeys: [...] } → the keys
export const generateLicenceKeys = async (count) =>
  (unwrap(await apiClient.post(`${PATH}/generate`, { count }))?.licenceKeys ?? [])

// Saves the generated keys for a customer (all or none) and returns the saved rows
export const createLicenceKeys = async (userId, licenceKeys) =>
  unwrap(await apiClient.post(PATH, { userId, licenceKeys })) ?? []

export const updateLicenceKey = async (id, licenceKey) => unwrap(await apiClient.put(`${PATH}/${id}`, licenceKey))

export const deleteLicenceKey = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}
