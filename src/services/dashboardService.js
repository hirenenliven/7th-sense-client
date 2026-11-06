import { sharedGet, withQuery, unwrap } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Home dashboard: every active machine the user may read, together (server DashboardService).

// One day (`date` YYYY-MM-DD, default today); `userId` = one customer's machines (superadmin only).
// { date, serverTime,
//   fleet: { total, online, offline, awaitingData, inactive, modes: [{ modeId, count }] } (now),
//   oee: { availability, performance, quality, oee } | null, cycles: { cycleCount, completedCount,
//   unfinishedCount, runningCount, partsMade }, plan: { quantity, partsMade } | null,
//   time: { spanSec, groups: [{ group, durationSec }] }, hourly: [{ hour, partsMade, previousPartsMade }],
//   machines: [{ machineId, machineName, customerName, modeId, onlineStatus, modeSince, availability,
//   performance, quality, oee, cycleCount, completedCount, unfinishedCount, partsMade, plannedQuantity }],
//   alarms: [{ code, message, count, machineCount, lastAt }] }
export const getHomeDashboard = async ({ date, userId }) =>
  unwrap(await sharedGet(withQuery('/dashboard/home', { date, userId: userId || undefined })))
