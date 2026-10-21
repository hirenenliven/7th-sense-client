import { z } from 'zod'
import { MACHINE_HEALTH_ALL, MACHINE_HEALTH_SENSORS } from '@/constants/machines'
import { PATTERNS } from '@/utils/validators'
import { tk } from '@/i18n/tk'

// Lengths of the machines columns (dto/machine_dto.go)
export const MAX_LENGTH = {
  name: 50,
  serialNumber: 50,
  controllerVersion: 10,
  amc: 50,
  username: 15,
  password: 50,
  coordinate: 50,
}

export const YES = 'yes'
export const NO = 'no'

export const INITIAL_VALUES = {
  // Machine details
  userId: '',
  name: '',
  serialNumber: '',
  brandId: '',
  controllerId: '',
  modelId: '',
  controllerVersion: '',
  accuracyId: '',
  lineId: '',
  isInsured: NO,
  maintenanceRequired: NO,
  installationDate: '',
  billDate: '',
  warrantyDate: '',
  hourlyCost: '',
  amc: '',
  machineSystemType: 'NewPlc',
  securityMode: 'Basic256Sha256',
  // Data access
  localIp: '',
  liveIp: '',
  port: '',
  username: '',
  password: '',
  controllerVersionType: '',
  longitude: '',
  latitude: '',
  healthIds: [], // sensor ids (numbers)
}

// Required when adding; the password only when adding (editing keeps it when left blank)
export const REQUIRED_FIELDS = new Set([
  'userId',
  'name',
  'serialNumber',
  'brandId',
  'controllerId',
  'modelId',
  'controllerVersion',
  'installationDate',
  'hourlyCost',
  'localIp',
  'liveIp',
  'port',
  'username',
  'password',
  'controllerVersionType',
])

const requiredId = (message) => z.string().min(1, message)
const coordinate = (limit, message) =>
  z
    .string()
    .trim()
    .max(MAX_LENGTH.coordinate, message)
    .refine((value) => !value || (PATTERNS.decimal.test(value) && Math.abs(Number(value)) <= limit), message)

// Mirrors the machines API rules (dto/machine_dto.go). `isEdit`: the password may stay blank.
export const machineSchema = (isEdit) =>
  z
    .object({
      userId: requiredId(tk('Customer is required')),
      name: z.string().trim().min(1, tk('Machine name is required')).regex(PATTERNS.machineName, tk('Use letters, digits, spaces and _ . / ( ) # -')),
      serialNumber: z.string().trim().min(1, tk('Serial no. is required')).regex(PATTERNS.serialNumber, tk('Use letters, digits and / _ -')),
      brandId: requiredId(tk('Brand is required')),
      controllerId: requiredId(tk('Controller is required')),
      modelId: requiredId(tk('Model is required')),
      controllerVersion: z.string().trim().min(1, tk('Software version is required')).regex(PATTERNS.controllerVersion, tk('Up to 10 letters, digits and . _ -')),
      accuracyId: z.string(),
      lineId: z.string(),
      isInsured: z.enum([YES, NO]),
      maintenanceRequired: z.enum([YES, NO]),
      installationDate: z.string().min(1, tk('Installation date is required')),
      billDate: z.string(),
      warrantyDate: z.string(),
      hourlyCost: z.string().trim().min(1, tk('Hourly cost is required')).regex(PATTERNS.money, tk('Enter an amount such as 800 or 800.50')),
      amc: z.string().trim().max(MAX_LENGTH.amc, tk('AMC is too long')),
      machineSystemType: z.string().min(1, tk('Machine system type is required')),
      securityMode: z.string().min(1, tk('Security type is required')),
      localIp: z.string().trim().min(1, tk('Local IP is required')).regex(PATTERNS.ipv4, tk('Enter an IP such as 192.168.1.10')),
      liveIp: z.string().trim().min(1, tk('Live IP is required')).regex(PATTERNS.ipv4, tk('Enter an IP such as 103.81.119.106')),
      port: z
        .string()
        .trim()
        .min(1, tk('Port is required'))
        .refine((value) => /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 65535, tk('Port is 1–65535')),
      username: z.string().trim().min(1, tk('User name is required')).regex(PATTERNS.machineUsername, tk('Up to 15 letters, digits, _ and .')),
      password: isEdit
        ? z.string().max(MAX_LENGTH.password, tk('Password is too long'))
        : z.string().min(1, tk('Password is required')).max(MAX_LENGTH.password, tk('Password is too long')),
      controllerVersionType: requiredId(tk('Controller version is required')),
      longitude: coordinate(180, tk('Longitude is between -180 and 180')),
      latitude: coordinate(90, tk('Latitude is between -90 and 90')),
      healthIds: z.array(z.number()),
    })
    .superRefine((values, ctx) => {
      // YYYY-MM-DD compares correctly as text
      if (values.warrantyDate && values.installationDate && values.warrantyDate < values.installationDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: tk('Warranty ends before the installation date'),
          path: ['warrantyDate'],
        })
      }
    })

// ---------------------------------------------------------------------------
// API mapping — form values ⇄ machines API body (POST /machines, PUT /machines/{id})
// ---------------------------------------------------------------------------

const toId = (value) => (value === '' || value === null || value === undefined ? null : Number(value))

// Every sensor picked is stored as 'All' (the id list would not fit health_ids VARCHAR(100))
const toHealthIds = (ids) => {
  if (!ids.length) return ''
  if (ids.length === MACHINE_HEALTH_SENSORS.length) return MACHINE_HEALTH_ALL
  return [...ids].sort((a, b) => a - b).join(',')
}

const fromHealthIds = (value) => {
  if (!value) return []
  if (value === MACHINE_HEALTH_ALL) return MACHINE_HEALTH_SENSORS.map((sensor) => sensor.id)
  const known = new Set(MACHINE_HEALTH_SENSORS.map((sensor) => sensor.id))
  return value
    .split(',')
    .map(Number)
    .filter((id) => known.has(id))
}

export const toMachinePayload = (values) => ({
  userId: toId(values.userId),
  name: values.name.trim(),
  serialNumber: values.serialNumber.trim(),
  brandId: toId(values.brandId),
  controllerId: toId(values.controllerId),
  modelId: toId(values.modelId),
  controllerVersion: values.controllerVersion.trim(),
  accuracyId: toId(values.accuracyId),
  lineId: toId(values.lineId),
  isInsured: values.isInsured === YES,
  maintenanceRequired: values.maintenanceRequired === YES,
  installationDate: values.installationDate,
  billDate: values.billDate,
  warrantyDate: values.warrantyDate,
  hourlyCost: values.hourlyCost.trim(),
  amc: values.amc.trim(),
  machineSystemType: values.machineSystemType,
  securityMode: values.securityMode,
  localIp: values.localIp.trim(),
  liveIp: values.liveIp.trim(),
  port: Number(values.port),
  username: values.username.trim(),
  password: values.password, // blank when editing = keep the saved password
  controllerVersionType: Number(values.controllerVersionType),
  longitude: values.longitude.trim(),
  latitude: values.latitude.trim(),
  healthIds: toHealthIds(values.healthIds),
})

const toText = (value) => (value === null || value === undefined ? '' : String(value))

// GET /machines/{id} → form values (the password is never sent by the API)
export const toFormValues = (machine) => ({
  ...INITIAL_VALUES,
  userId: toText(machine.userId),
  name: machine.name ?? '',
  serialNumber: machine.serialNumber ?? '',
  brandId: toText(machine.brandId),
  controllerId: toText(machine.controllerId),
  modelId: toText(machine.modelId),
  controllerVersion: machine.controllerVersion ?? '',
  accuracyId: toText(machine.accuracyId),
  lineId: toText(machine.lineId),
  isInsured: machine.isInsured ? YES : NO,
  maintenanceRequired: machine.maintenanceRequired ? YES : NO,
  installationDate: machine.installationDate ?? '',
  billDate: machine.billDate ?? '',
  warrantyDate: machine.warrantyDate ?? '',
  hourlyCost: machine.hourlyCost ?? '',
  amc: machine.amc ?? '',
  machineSystemType: machine.machineSystemType || INITIAL_VALUES.machineSystemType,
  securityMode: machine.securityMode || INITIAL_VALUES.securityMode,
  localIp: machine.localIp ?? '',
  liveIp: machine.liveIp ?? '',
  port: toText(machine.port),
  username: machine.username ?? '',
  password: '',
  controllerVersionType: toText(machine.controllerVersionType),
  longitude: machine.longitude ?? '',
  latitude: machine.latitude ?? '',
  healthIds: fromHealthIds(machine.healthIds),
})
