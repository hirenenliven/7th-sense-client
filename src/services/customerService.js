import apiClient from './apiClient'
import env from '@/config/env'

const MOCK_LATENCY_MS = 600

// Mock data used while VITE_USE_MOCK_API=true (no backend yet)
const MOCK_BRANCHES = [
  { id: 1, name: 'Pune — Head Office' },
  { id: 2, name: 'Bengaluru' },
  { id: 3, name: 'Chennai' },
  { id: 4, name: 'Ahmedabad' },
]

const mockResponse = (data) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), MOCK_LATENCY_MS)
  })

export const getBranches = async () => {
  if (env.useMockApi) return mockResponse(MOCK_BRANCHES)
  const { data } = await apiClient.get('/branches')
  return data
}

// Sends multipart/form-data because of the optional company logo.
export const createCustomer = async (customer) => {
  if (env.useMockApi) return mockResponse({ id: Date.now(), ...customer, logo: undefined })

  const formData = new FormData()
  Object.entries(customer).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') formData.append(key, value)
  })

  const { data } = await apiClient.post('/customers', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
