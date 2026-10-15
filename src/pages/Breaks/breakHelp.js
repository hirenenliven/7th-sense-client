// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form — keep in sync with breakSchema (breakForm.js).
export const FIELD_HELP = {
  userId: { title: 'Customer', content: 'Customer the break belongs to. One of its shifts can then take it.' },
  shiftId: {
    title: 'Shift',
    content: 'The shift that takes this break. Leave it empty to pick the break later on Add / Manage Shift.',
    rules: ['A break belongs to one shift', 'It must lie inside the shift and not overlap its other breaks'],
  },
  times: {
    title: 'Break Time',
    content: '24-hour times. An end time earlier than the start time means the break runs past midnight.',
    rules: ['A break on a shift must stay inside that shift'],
  },
}
