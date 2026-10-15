import apiClient, { sharedGet, withQuery } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
// A customer's holidays ({ holidayType: 'holiday', name, startDate, endDate }) and week offs
// ({ holidayType: 'week_off', weekDay }). The superadmin sees every customer's (userId narrows to
// one customer); everyone else their company's. Managers create, update and delete.
const PATH = '/holidays'

// The server omits `data` for an empty list, so lists fall back to [].
const unwrap = (response) => response.data.data
const unwrapList = (response) => unwrap(response) ?? []

export const getHolidays = async (userId) => unwrapList(await sharedGet(withQuery(PATH, { userId })))

export const createHoliday = async (holiday) => unwrap(await apiClient.post(PATH, holiday))

export const updateHoliday = async (id, holiday) => unwrap(await apiClient.put(`${PATH}/${id}`, holiday))

export const deleteHoliday = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}
