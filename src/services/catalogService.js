import apiClient, { sharedGet, withQuery } from './apiClient'

// Machine catalog: Brand → Controller → Model. Every logged-in user reads these lists
// (machine form options); only the superadmin may add, edit or delete controllers and models.
// Paths are relative to VITE_API_BASE_URL (…/api/v1); these functions return `data`.

// The server omits `data` for an empty list, so lists fall back to [].
const unwrap = (response) => response.data.data
const unwrapList = (response) => unwrap(response) ?? []

export const getBrands = async () => unwrapList(await sharedGet('/brands'))

// Controllers — controller = { id, brandId, brandName, name, description, … }
// brandId (optional) keeps only that brand's controllers
export const getControllers = async (brandId) => unwrapList(await sharedGet(withQuery('/controllers', { brandId })))

// controller = { brandId, name, description }
export const createController = async (controller) => unwrap(await apiClient.post('/controllers', controller))

export const updateController = async (id, controller) => unwrap(await apiClient.put(`/controllers/${id}`, controller))

export const deleteController = async (id) => {
  await apiClient.delete(`/controllers/${id}`)
}

// Models (machine models of a controller) — model = { id, controllerId, controllerName, brandId, brandName, name, … }
// controllerId (optional) keeps only that controller's models
export const getModels = async (controllerId) => unwrapList(await sharedGet(withQuery('/models', { controllerId })))

// model = { controllerId, name }
export const createModel = async (model) => unwrap(await apiClient.post('/models', model))

export const updateModel = async (id, model) => unwrap(await apiClient.put(`/models/${id}`, model))

export const deleteModel = async (id) => {
  await apiClient.delete(`/models/${id}`)
}
