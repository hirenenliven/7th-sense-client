import apiClient, { sharedGet, withQuery, unwrap, unwrapList } from './apiClient'

// Machine catalog: Brand → Controller → Model. Every logged-in user reads these lists
// (machine form options); only the superadmin may add, edit or delete brands, controllers and models.
// Paths are relative to VITE_API_BASE_URL (…/api/v1); these functions return `data`.

// Brands — brand = { id, name, code, description, … }
export const getBrands = async () => unwrapList(await sharedGet('/brands'))

// brand = { name, code, description }
export const createBrand = async (brand) => unwrap(await apiClient.post('/brands', brand))

export const updateBrand = async (id, brand) => unwrap(await apiClient.put(`/brands/${id}`, brand))

export const deleteBrand = async (id) => {
  await apiClient.delete(`/brands/${id}`)
}

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
