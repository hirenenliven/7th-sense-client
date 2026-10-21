import { tk } from '@/i18n/tk'

// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form and reused by the User Guide — keep in sync with customerSchema
// (customerForm.js). Kept separate so the guide does not load the validation library.
export const FIELD_HELP = {
  gstNo: {
    title: tk('GST No.'),
    content: tk('GST Identification Number (GSTIN) of the customer’s business, as printed on its GST certificate.'),
    example: '22ABCDE1234F1Z5',
    rules: [tk('15 characters; letters are capitalised for you'), tk('Required when Country is India')],
  },
  panNo: {
    title: tk('PAN No.'),
    content: tk('Permanent Account Number of the customer’s business.'),
    example: 'ABCDE1234F',
    rules: [tk('10 characters: 5 letters, 4 digits, 1 letter'), tk('Required when Country is India')],
  },
  username: {
    title: tk('User Name'),
    content: tk('Login name for the customer’s account. Pick something the customer will recognise, such as a short company name.'),
    example: 'acme.pune',
    rules: [tk('3–50 characters'), tk('Letters, numbers, dot or underscore'), tk('No spaces')],
  },
  zipCode: {
    title: tk('Zip Code'),
    content: tk('Postal code of the address. The accepted format depends on the selected country.'),
    example: '400001',
    rules: [tk('India: 6-digit PIN code, not starting with 0'), tk('Other countries: 3–10 letters, digits, spaces or dashes')],
  },
  timeZone: {
    title: tk('Time Zone'),
    content: tk('The customer’s local time zone. Schedules, shift times and report dates for this customer are calculated in this zone.'),
    rules: [tk('Use the zone where the plant runs, not where the account is managed')],
  },
  dayStartFrom: {
    title: tk('Day Start From'),
    content: tk('Time at which the customer’s production day begins. Output before this time is counted toward the previous production day.'),
    example: '06:00 — a night shift ending at 05:30 counts toward the day before',
    rules: [tk('Usually the start time of the first shift')],
  },
  filters: {
    title: tk('Filters'),
    content: tk('Filters offered to this customer on their dashboards and reports. Only the ticked filters are shown.'),
    rules: [tk('Optional — tick none to hide all filters'), tk('Can be changed later by editing the customer')],
  },
  // Users only (Access card)
  roleId: {
    title: tk('Role'),
    content: tk('What the user can do. Administrators see every machine of the company and can add users; other roles see only the machines ticked below.'),
    rules: [tk('Customers can give every role but Customer'), tk('Administrators cannot give the Administrator role')],
  },
  machineIds: {
    title: tk('Machines'),
    content: tk('The company machines this user can see. Machines that are not ticked are hidden from the user everywhere.'),
    rules: [tk('Optional — tick none and the user sees no machines'), tk('Not needed for Administrators: they see every machine')],
  },
}
