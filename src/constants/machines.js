// Fixed option lists of the Add / Edit Machine form. Values are what the machines API stores
// (dto/machine_dto.go); there are no lookup tables for these in the database.

// machines.accuracy_id
export const MACHINE_ACCURACIES = [
  { id: 1, label: 'Good' },
  { id: 2, label: 'Average' },
  { id: 3, label: 'Poor' },
]

// machines.controller_version_type
export const CONTROLLER_VERSION_TYPES = [
  { id: 1, label: '828D' },
  { id: 2, label: '840D' },
]

export const MACHINE_SYSTEM_TYPES = [
  { value: 'NewPlc', label: 'New PLC' },
  { value: 'OldPlc', label: 'Old PLC' },
]

export const SECURITY_MODES = [
  { value: 'Basic256Sha256', label: 'Basic256Sha256' },
  { value: 'None', label: 'None' },
]

export const MACHINE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
}

// Machine mode (what a machine is doing), in this order everywhere it is listed or charted.
// `color` is a chartTheme STATUS_COLORS key; Offline is the absence of work, drawn faded (`muted`).
export const MACHINE_MODES = [
  { key: 'offline', label: 'Offline', color: 'neutral', muted: true },
  { key: 'production', label: 'In Production', color: 'good' },
  { key: 'idle', label: 'Idle', color: 'warning' },
  { key: 'hold', label: 'Hold', color: 'info' },
  { key: 'downtime', label: 'Downtime', color: 'critical' },
]

// healthIds = 'All' or comma-separated ids of these sensors (old system: mm_health)
export const MACHINE_HEALTH_ALL = 'All'

export const MACHINE_HEALTH_SENSORS = [
  { id: 1, label: 'Spindle Bearing Temperature Status' },
  { id: 5, label: 'Spindle Vibration Status' },
  { id: 6, label: 'Spindle Load/Power Status' },
  { id: 7, label: 'Hydraulic Pressure Status' },
  { id: 8, label: 'Hydraulic Oil Level Status' },
  { id: 9, label: 'Hydraulic Oil Temperature Status' },
  { id: 10, label: 'Axis Lubrication Oil Level Status' },
  { id: 11, label: 'Axis Lubrication Pressure Status' },
  { id: 12, label: 'Gear Box Lubrication Temperature Status' },
  { id: 13, label: 'Gear Box Lubrication Oil Level Status' },
  { id: 14, label: 'Gear Box Lubrication Filter Obstruct Status' },
  { id: 15, label: 'Coolant Flow Pressure Status' },
  { id: 16, label: 'Conveyor Coolant Level Status' },
  { id: 17, label: 'Pneumatic Pressure Status' },
  { id: 18, label: 'Electrical Cabinet Temperature Status' },
  { id: 19, label: 'CTS Coolant Level Status' },
  { id: 20, label: 'Chiller Temperature' },
  { id: 21, label: 'Chiller Flow Rate' },
  { id: 22, label: 'Chiller Flow Rate - Front Bearing' },
  { id: 23, label: 'Coolant Tank Filter Status' },
  { id: 24, label: 'Headstock Temperature Status' },
  { id: 25, label: "Today's Spindle Run Hour" },
  { id: 26, label: 'Spindle Motor Temperature' },
  { id: 27, label: 'Machine Power' },
  { id: 28, label: 'Turning Hydraulic Actual Pressure' },
  { id: 29, label: 'Turning Hydraulic Sheet Pressure' },
  { id: 30, label: 'Turning Hydraulic Reset Pressure' },
  { id: 31, label: 'Turning CST Actual Pressure' },
  { id: 32, label: 'Turning CST High Pressure' },
  { id: 33, label: 'Turning CST Low Pressure' },
  { id: 34, label: 'Turning Chuck Id Actual Pressure' },
  { id: 35, label: 'Turning Chuck Id Sheet Pressure' },
  { id: 36, label: 'Turning Chuck Id Reset Pressure' },
  { id: 37, label: 'Turning Chuck OD Actual Pressure' },
  { id: 38, label: 'Turning Chuck OD Sheet Pressure' },
  { id: 39, label: 'Turning Chuck OD Reset Pressure' },
]


// Rows of the Productivity Gantt chart: each machine_modes id with its colour (--ts-mode-* CSS
// variables, _variables.scss). `optional` rows show only while the window has a period in them.
export const MACHINE_MODE_TYPES = [
  { id: 2, label: 'Loading / Unloading Time', color: 'var(--ts-mode-loading)' },
  { id: 3, label: 'In Production', color: 'var(--ts-mode-production)' },
  { id: 4, label: 'Hold', color: 'var(--ts-mode-hold)' },
  { id: 5, label: 'Idle', color: 'var(--ts-mode-idle)' },
  { id: 6, label: 'Downtime', color: 'var(--ts-mode-downtime)' },
  { id: 9, label: 'Offline', color: 'var(--ts-mode-offline)' },
  { id: 7, label: 'Planned Downtime', color: 'var(--ts-mode-planned)' },
  { id: 1, label: 'Setup', color: 'var(--ts-mode-setup)', optional: true },
  { id: 12, label: 'Rapid Mode', color: 'var(--ts-mode-rapid)', optional: true },
  { id: 13, label: 'Leave Planned Downtime', color: 'var(--ts-mode-planned)', optional: true },
]
export const UNKNOWN_MODE_COLOR = 'var(--ts-neutral)'
export const modeTypeOf = (modeId) => MACHINE_MODE_TYPES.find((mode) => mode.id === modeId)
