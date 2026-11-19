import apiClient, { sharedGet, unwrap, unwrapList } from './apiClient'

// Machine accuracies (server ADR 0017): one list shared by every customer. Every response is
// { statusCode, success, message, data }; these functions return `data`. Everyone reads (machine
// and part forms); only the superadmin writes (Account Center › Machine Accuracy).

const PATH = '/machine-accuracies'

// [{ id, name, usageCount }], ordered by id; usageCount = machines + part processes using it
export const getMachineAccuracies = async () => unwrapList(await sharedGet(PATH))

// Body { name }; rejects "This machine accuracy already exists"
export const createMachineAccuracy = async (name) => unwrap(await apiClient.post(PATH, { name }))

export const updateMachineAccuracy = async (id, name) => unwrap(await apiClient.put(`${PATH}/${id}`, { name }))

// Refused (400) while machines or part processes use it
export const deleteMachineAccuracy = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}
