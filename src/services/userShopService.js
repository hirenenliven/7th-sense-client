import apiClient, { sharedGet } from './apiClient'

// The logged-in user's shops (user_shop table). The server picks the user.
// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
const PATH = '/user-shop'

// The server omits `data` for an empty list, so lists fall back to [].
const unwrap = (response) => response.data.data
const unwrapList = (response) => unwrap(response) ?? []

// userLocationId (optional) keeps only the shops of that location
export const getUserShops = async (userLocationId) =>
  unwrapList(await sharedGet(userLocationId ? `${PATH}?userLocationId=${userLocationId}` : PATH))

// shop = { userLocationId, name }
export const createUserShop = async (shop) => unwrap(await apiClient.post(PATH, shop))

export const updateUserShop = async (id, shop) => unwrap(await apiClient.put(`${PATH}/${id}`, shop))

export const deleteUserShop = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}
