import { z } from 'zod'
import { DURATION_PATTERN, DURATION_ZERO, durationToSeconds, secondsToDuration } from '@/utils/dateTime'
import { tk, tkv } from '@/i18n/tk'

// Lengths of the parts columns (dto/part_dto.go, migration 016)
export const MAX_LENGTH = {
  partNo: 100,
  partName: 200,
  processText: 100, // process, program name, drawing no., revision no.
  subProgramName: 200,
}

export const MAX_PART_COUNT = 100000
export const MAX_PROCESSES = 50
export const MAX_SUB_PROGRAMS = 50

// Part drawing upload (POST /parts/drawings)
export const DRAWING_RULES = { types: ['application/pdf'], maxBytes: 10 * 1024 * 1024 }

export const PART_STATUS = { ACTIVE: 'active', INACTIVE: 'inactive' }

export const EMPTY_SUB_PROGRAM = { name: '', cycleTime: DURATION_ZERO }

// `processId` is the saved process id (null = new). Not `id`: useFieldArray uses `id` for its keys.
export const EMPTY_PROCESS = {
  processId: null,
  process: '',
  programName: '',
  machineIds: [], // machine ids (numbers)
  drawingNo: '',
  drawingRevisionNo: '',
  drawingFile: '', // stored name of the saved drawing
  drawingName: '', // file name shown to the user
  drawingUpload: null, // picked PDF (File), uploaded only when the part is saved
  accuracyId: '',
  setupTime: DURATION_ZERO,
  cycleTime: DURATION_ZERO,
  loadingTime: DURATION_ZERO,
  hasSubProgram: false,
  subPrograms: [],
}

export const INITIAL_VALUES = {
  userId: '',
  clienteleId: '',
  partNo: '',
  partName: '',
  partCount: '1',
  status: PART_STATUS.ACTIVE,
  processes: [EMPTY_PROCESS],
}

// message: tk('<Field>: use H:MM:SS, e.g. 1:30:00')
const durationText = (message) => z.string().trim().regex(DURATION_PATTERN, message)

const subProgramSchema = z.object({
  name: z.string().trim().min(1, tk('Sub program name is required')).max(MAX_LENGTH.subProgramName, tk('Name is too long')),
  cycleTime: durationText(tk('Cycle time: use H:MM:SS, e.g. 1:30:00')),
})

const processSchema = z
  .object({
    processId: z.number().nullable(),
    process: z.string().trim().min(1, tk('Process is required')).max(MAX_LENGTH.processText, tk('Process is too long')),
    programName: z.string().trim().min(1, tk('Program name is required')).max(MAX_LENGTH.processText, tk('Program name is too long')),
    machineIds: z.array(z.number()).min(1, tk('Select at least one machine')),
    drawingNo: z.string().trim().min(1, tk('Drawing no. is required')).max(MAX_LENGTH.processText, tk('Drawing no. is too long')),
    drawingRevisionNo: z
      .string()
      .trim()
      .min(1, tk('Drawing revision no. is required'))
      .max(MAX_LENGTH.processText, tk('Revision no. is too long')),
    drawingFile: z.string(),
    drawingName: z.string(),
    drawingUpload: z.custom((value) => value === null || value instanceof File).nullable(),
    accuracyId: z.string().min(1, tk('Machine accuracy level is required')),
    setupTime: durationText(tk('Setup time: use H:MM:SS, e.g. 1:30:00')),
    cycleTime: durationText(tk('Cycle time: use H:MM:SS, e.g. 1:30:00')).refine((value) => durationToSeconds(value) > 0, tk('Cycle time must be more than 0:00:00')),
    loadingTime: durationText(tk('Loading / unloading time: use H:MM:SS, e.g. 1:30:00')),
    hasSubProgram: z.boolean(),
    subPrograms: z.array(subProgramSchema).max(MAX_SUB_PROGRAMS, tkv('Up to {{n}} sub programs', { n: MAX_SUB_PROGRAMS })),
  })
  .superRefine((process, ctx) => {
    if (!process.drawingFile && !process.drawingUpload) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: tk('Part drawing (PDF) is required'), path: ['drawingFile'] })
    }
    if (process.hasSubProgram && !process.subPrograms.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: tk('Add at least one sub program'), path: ['subPrograms'] })
    }
  })

// Mirrors the parts API rules (dto/part_dto.go)
export const partSchema = z.object({
  userId: z.string().min(1, tk('Customer is required')),
  clienteleId: z.string().min(1, tk('Clientele is required')),
  partNo: z.string().trim().min(1, tk('Part no. is required')).max(MAX_LENGTH.partNo, tk('Part no. is too long')),
  partName: z.string().trim().min(1, tk('Part name is required')).max(MAX_LENGTH.partName, tk('Part name is too long')),
  partCount: z
    .string()
    .trim()
    .refine((value) => /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= MAX_PART_COUNT, tkv('Part count is 1–{{n}}', { n: MAX_PART_COUNT })),
  status: z.enum([PART_STATUS.ACTIVE, PART_STATUS.INACTIVE]),
  processes: z.array(processSchema).min(1, tk('Add at least one process')).max(MAX_PROCESSES, tkv('Up to {{n}} processes', { n: MAX_PROCESSES })),
})

// ---------------------------------------------------------------------------
// Production time — worked out the same way as the server (service/part_service.go):
// process = setup + cycle + loading + its sub programs' cycle times; part = sum of processes.
// Invalid times count as 0 until fixed.
// ---------------------------------------------------------------------------

const seconds = (text) => durationToSeconds(text) ?? 0

export const processSeconds = (process) =>
  seconds(process?.setupTime) +
  seconds(process?.cycleTime) +
  seconds(process?.loadingTime) +
  (process?.hasSubProgram ? (process.subPrograms ?? []).reduce((sum, subProgram) => sum + seconds(subProgram.cycleTime), 0) : 0)

export const partSeconds = (processes) => (processes ?? []).reduce((sum, process) => sum + processSeconds(process), 0)

// ---------------------------------------------------------------------------
// API mapping — form values ⇄ parts API body (POST /parts, PUT /parts/{id})
// ---------------------------------------------------------------------------

// `existing` = the loaded part when editing (sends the status). Picked drawings must be uploaded
// first (AddPart: uploadPendingDrawings) so drawingFile holds their stored names.
export const toPartPayload = (values, existing) => ({
  userId: Number(values.userId),
  clienteleId: values.clienteleId ? Number(values.clienteleId) : null,
  partNo: values.partNo.trim(),
  partName: values.partName.trim(),
  partCount: Number(values.partCount),
  ...(existing ? { status: values.status } : {}),
  processes: values.processes.map((process) => ({
    id: process.processId,
    process: process.process.trim(),
    programName: process.programName.trim(),
    machineIds: process.machineIds,
    drawingNo: process.drawingNo.trim(),
    drawingRevisionNo: process.drawingRevisionNo.trim(),
    drawingFile: process.drawingFile,
    drawingName: process.drawingName,
    accuracyId: Number(process.accuracyId),
    setupTime: seconds(process.setupTime),
    cycleTime: seconds(process.cycleTime),
    loadingTime: seconds(process.loadingTime),
    hasSubProgram: process.hasSubProgram,
    subPrograms: process.hasSubProgram
      ? process.subPrograms.map((subProgram) => ({ name: subProgram.name.trim(), cycleTime: seconds(subProgram.cycleTime) }))
      : [],
  })),
})

// GET /parts/{id} → form values
export const toFormValues = (part) => ({
  userId: String(part.userId ?? ''),
  clienteleId: part.clienteleId ? String(part.clienteleId) : '',
  partNo: part.partNo ?? '',
  partName: part.partName ?? '',
  partCount: String(part.partCount ?? 1),
  status: part.status === PART_STATUS.INACTIVE ? PART_STATUS.INACTIVE : PART_STATUS.ACTIVE,
  processes: (part.processes?.length ? part.processes : []).map((process) => ({
    processId: process.id,
    process: process.process ?? '',
    programName: process.programName ?? '',
    machineIds: process.machineIds ?? [],
    drawingNo: process.drawingNo ?? '',
    drawingRevisionNo: process.drawingRevisionNo ?? '',
    drawingFile: process.drawingFile ?? '',
    drawingName: process.drawingName ?? '',
    drawingUpload: null,
    accuracyId: process.accuracyId ? String(process.accuracyId) : '',
    setupTime: secondsToDuration(process.setupTime),
    cycleTime: secondsToDuration(process.cycleTime),
    loadingTime: secondsToDuration(process.loadingTime),
    hasSubProgram: Boolean(process.hasSubProgram),
    subPrograms: (process.subPrograms ?? []).map((subProgram) => ({
      name: subProgram.name ?? '',
      cycleTime: secondsToDuration(subProgram.cycleTime),
    })),
  })),
})
