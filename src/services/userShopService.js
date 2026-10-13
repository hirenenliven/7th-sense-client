import apiClient, { sharedGet, withQuery } from './apiClient'

// The logged-in user's shops (user_shop table). The server picks the user;
// an admin passes userId to work on another user's rows.
// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
const PATH = '/user-shop'

// The server omits `data` for an empty list, so lists fall back to [].
const unwrap = (response) => response.data.data
const unwrapList = (response) => unwrap(response) ?? []

// userLocationId (optional) keeps only the shops of that location
export const getUserShops = async (userLocationId, userId) =>
  unwrapList(await sharedGet(withQuery(PATH, { userLocationId, userId })))

// shop = { userLocationId, name }
export const createUserShop = async (shop, userId) => unwrap(await apiClient.post(withQuery(PATH, { userId }), shop))

export const updateUserShop = async (id, shop, userId) =>
  unwrap(await apiClient.put(withQuery(`${PATH}/${id}`, { userId }), shop))

export const deleteUserShop = async (id, userId) => {
  await apiClient.delete(withQuery(`${PATH}/${id}`, { userId }))
}
