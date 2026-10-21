import { tk } from '@/i18n/tk'

// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form — keep in sync with shiftSchema (shiftForm.js).
export const FIELD_HELP = {
  userId: {
    title: tk('Customer'),
    content: tk('Customer the shift belongs to. Only that customer and its users see it.'),
  },
  times: {
    title: tk('Shift Time'),
    content: '24-hour times. An end time earlier than the start time means the shift runs past midnight.',
    example: '22:00 to 06:00',
  },
  workingDays: {
    title: tk('Working Days'),
    content: tk('Days this shift runs. Days left off are shown struck through on the shift card.'),
  },
  breaks: {
    title: tk('Breaks'),
    content: tk("The customer's breaks (Shift › Breaks) taken during this shift. Each must lie inside the shift time and not overlap another."),
  },
}
