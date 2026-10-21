import { z } from 'zod'
import { tk } from '@/i18n/tk'

// Lengths of the downtime_reasons / idle_reasons columns (dto/downtime_reason_dto.go, migration 027)
export const MAX_LENGTH = {
  reasonCode: 10,
  reason: 50,
}

export const REASON_STATUS = { ACTIVE: 'active', INACTIVE: 'inactive' }

export const INITIAL_VALUES = {
  userId: '',
  reasonCode: '',
  reason: '',
  status: REASON_STATUS.ACTIVE,
}

// Mirrors the downtime / idle reasons API rules (dto/downtime_reason_dto.go)
export const reasonSchema = z.object({
  userId: z.string().min(1, tk('Customer is required')),
  reasonCode: z.string().trim().max(MAX_LENGTH.reasonCode, tk('Reason code is too long')),
  reason: z.string().trim().min(1, tk('Reason is required')).max(MAX_LENGTH.reason, tk('Reason is too long')),
  status: z.enum([REASON_STATUS.ACTIVE, REASON_STATUS.INACTIVE]),
})

// ---------------------------------------------------------------------------
// API mapping — form values ⇄ API body (POST /downtime-reasons, PUT /downtime-reasons/{id}, same for idle)
// ---------------------------------------------------------------------------

export const toReasonPayload = (values, isEdit) => ({
  userId: Number(values.userId),
  reasonCode: values.reasonCode.trim(),
  reason: values.reason.trim(),
  ...(isEdit ? { status: values.status } : {}),
})

// List row → form values (rows carry every field)
export const toFormValues = (reason) => ({
  userId: String(reason.userId ?? ''),
  reasonCode: reason.reasonCode ?? '',
  reason: reason.reason ?? '',
  status: reason.status === REASON_STATUS.INACTIVE ? REASON_STATUS.INACTIVE : REASON_STATUS.ACTIVE,
})
