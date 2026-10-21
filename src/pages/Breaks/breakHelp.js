import { tk } from '@/i18n/tk'

// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form — keep in sync with breakSchema (breakForm.js).
export const FIELD_HELP = {
  userId: { title: tk('Customer'), content: tk('Customer the break belongs to. One of its shifts can then take it.') },
  shiftId: {
    title: tk('Shift'),
    content: tk('The shift that takes this break. Leave it empty to pick the break later on Add / Manage Shift.'),
    rules: [tk('A break belongs to one shift'), tk('It must lie inside the shift and not overlap its other breaks')],
  },
  times: {
    title: tk('Break Time'),
    content: tk('24-hour times. An end time earlier than the start time means the break runs past midnight.'),
    rules: [tk('A break on a shift must stay inside that shift')],
  },
}
