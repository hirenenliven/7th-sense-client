import { tk } from '@/i18n/tk'

// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form — keep in sync with branchSchema (branchForm.js).
export const FIELD_HELP = {
  code: {
    title: tk('Code'),
    content: tk('Short unique code for the branch, used in lists and reports.'),
    example: 'PUNE01',
    rules: [tk('2–20 characters'), tk('Capital letters and digits only; letters are capitalised for you'), tk('Must be unique')],
  },
  customerId: {
    title: tk('Customer'),
    content: tk('Customer account that owns this branch. The City list shows this customer’s cities.'),
  },
  userCityId: {
    title: tk('City'),
    content: tk('City the branch is in, picked from the customer’s cities (Masters › City). Leave blank if it has none.'),
  },
  colorCode: {
    title: tk('Colour'),
    content: tk('Colour used to tell this branch apart in lists and charts.'),
    example: '#F58220',
    rules: [tk('# followed by 6 hex digits'), tk('Pick one with the swatch or type it')],
  },
}
