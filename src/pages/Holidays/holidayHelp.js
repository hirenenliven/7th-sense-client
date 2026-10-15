// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form — keep in sync with holidaySchema (holidayForm.js).
export const FIELD_HELP = {
  userId: { title: 'Customer', content: 'Customer the holiday or week off belongs to.' },
  holidayType: {
    title: 'Holiday or Week Off',
    content: 'A holiday is a date range (one day: same start and end date). A week off repeats every week on one day.',
    rules: ['Each day can be a customer’s week off once'],
  },
}
