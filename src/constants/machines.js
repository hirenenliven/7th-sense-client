import { tk } from '@/i18n/tk'

// Fixed option lists of the Add / Edit Machine form. Values are what the machines API stores
// (dto/machine_dto.go); there are no lookup tables for these in the database.

// machines.accuracy_id
export const MACHINE_ACCURACIES = [
  { id: 1, label: tk('Good') },
  { id: 2, label: tk('Average') },
  { id: 3, label: tk('Poor') },
]

// machines.controller_version_type
export const CONTROLLER_VERSION_TYPES = [
  { id: 1, label: '828D' },
  { id: 2, label: '840D' },
]

export const MACHINE_SYSTEM_TYPES = [
  { value: 'NewPlc', label: tk('New PLC') },
  { value: 'OldPlc', label: tk('Old PLC') },
]

export const SECURITY_MODES = [
  { value: 'Basic256Sha256', label: 'Basic256Sha256' },
  { value: 'None', label: 'None' },
]

export const MACHINE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
}

// healthIds = 'All' or comma-separated ids of these sensors (old system: mm_health)
export const MACHINE_HEALTH_ALL = 'All'

export const MACHINE_HEALTH_SENSORS = [
  { id: 1, label: tk('Spindle Bearing Temperature Status') },
  { id: 5, label: tk('Spindle Vibration Status') },
  { id: 6, label: tk('Spindle Load/Power Status') },
  { id: 7, label: tk('Hydraulic Pressure Status') },
  { id: 8, label: tk('Hydraulic Oil Level Status') },
  { id: 9, label: tk('Hydraulic Oil Temperature Status') },
  { id: 10, label: tk('Axis Lubrication Oil Level Status') },
  { id: 11, label: tk('Axis Lubrication Pressure Status') },
  { id: 12, label: tk('Gear Box Lubrication Temperature Status') },
  { id: 13, label: tk('Gear Box Lubrication Oil Level Status') },
  { id: 14, label: tk('Gear Box Lubrication Filter Obstruct Status') },
  { id: 15, label: tk('Coolant Flow Pressure Status') },
  { id: 16, label: tk('Conveyor Coolant Level Status') },
  { id: 17, label: tk('Pneumatic Pressure Status') },
  { id: 18, label: tk('Electrical Cabinet Temperature Status') },
  { id: 19, label: tk('CTS Coolant Level Status') },
  { id: 20, label: tk('Chiller Temperature') },
  { id: 21, label: tk('Chiller Flow Rate') },
  { id: 22, label: tk('Chiller Flow Rate - Front Bearing') },
  { id: 23, label: tk('Coolant Tank Filter Status') },
  { id: 24, label: tk('Headstock Temperature Status') },
  { id: 25, label: tk("Today's Spindle Run Hour") },
  { id: 26, label: tk('Spindle Motor Temperature') },
  { id: 27, label: tk('Machine Power') },
  { id: 28, label: tk('Turning Hydraulic Actual Pressure') },
  { id: 29, label: tk('Turning Hydraulic Sheet Pressure') },
  { id: 30, label: tk('Turning Hydraulic Reset Pressure') },
  { id: 31, label: tk('Turning CST Actual Pressure') },
  { id: 32, label: tk('Turning CST High Pressure') },
  { id: 33, label: tk('Turning CST Low Pressure') },
  { id: 34, label: tk('Turning Chuck Id Actual Pressure') },
  { id: 35, label: tk('Turning Chuck Id Sheet Pressure') },
  { id: 36, label: tk('Turning Chuck Id Reset Pressure') },
  { id: 37, label: tk('Turning Chuck OD Actual Pressure') },
  { id: 38, label: tk('Turning Chuck OD Sheet Pressure') },
  { id: 39, label: tk('Turning Chuck OD Reset Pressure') },
]
