// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form and reused by the User Guide — keep in sync with customerSchema
// (customerForm.js). Kept separate so the guide does not load the validation library.
export const FIELD_HELP = {
  gstNo: {
    title: 'GST No.',
    content: 'GST Identification Number (GSTIN) of the customer’s business, as printed on its GST certificate.',
    example: '22ABCDE1234F1Z5',
    rules: ['15 characters; letters are capitalised for you', 'Required when Country is India'],
  },
  panNo: {
    title: 'PAN No.',
    content: 'Permanent Account Number of the customer’s business.',
    example: 'ABCDE1234F',
    rules: ['10 characters: 5 letters, 4 digits, 1 letter', 'Required when Country is India'],
  },
  username: {
    title: 'User Name',
    content: 'Login name for the customer’s account. Pick something the customer will recognise, such as a short company name.',
    example: 'acme.pune',
    rules: ['3–50 characters', 'Letters, numbers, dot or underscore', 'No spaces'],
  },
  zipCode: {
    title: 'Zip Code',
    content: 'Postal code of the address. The accepted format depends on the selected country.',
    example: '400001',
    rules: ['India: 6-digit PIN code, not starting with 0', 'Other countries: 3–10 letters, digits, spaces or dashes'],
  },
  timeZone: {
    title: 'Time Zone',
    content: 'The customer’s local time zone. Schedules, shift times and report dates for this customer are calculated in this zone.',
    rules: ['Use the zone where the plant runs, not where the account is managed'],
  },
  dayStartFrom: {
    title: 'Day Start From',
    content: 'Time at which the customer’s production day begins. Output before this time is counted toward the previous production day.',
    example: '06:00 — a night shift ending at 05:30 counts toward the day before',
    rules: ['Usually the start time of the first shift'],
  },
  filters: {
    title: 'Filters',
    content: 'Filters offered to this customer on their dashboards and reports. Only the ticked filters are shown.',
    rules: ['Optional — tick none to hide all filters', 'Can be changed later by editing the customer'],
  },
}
