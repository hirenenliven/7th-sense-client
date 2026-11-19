import { z } from 'zod'

// Add / Edit form of Account Center › Machine Accuracy (MachineAccuracyEditor.jsx). Mirrors
// dto.MachineAccuracyRequest: a name of at most 50 characters, unique ignoring case (server).

export const ACCURACY_MAX_LENGTH = 50

export const INITIAL_VALUES = { name: '' }

export const accuracySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Machine accuracy is required')
    .max(ACCURACY_MAX_LENGTH, `Machine accuracy must be at most ${ACCURACY_MAX_LENGTH} characters`),
})

// The server trims the text and joins runs of spaces; the form sends it the same way
export const toAccuracyName = (values) => values.name.trim().replace(/\s+/g, ' ')

export const toFormValues = (accuracy) => ({ name: accuracy.name ?? '' })

// "Not used" / "1 machine or process" / "3 machines or processes"
export const usageLabel = (count) => {
  if (!count) return 'Not used'
  return count === 1 ? '1 machine or process' : `${count} machines or processes`
}
