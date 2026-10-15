// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form — keep in sync with branchSchema (branchForm.js).
export const FIELD_HELP = {
  code: {
    title: 'Code',
    content: 'Short unique code for the branch, used in lists and reports.',
    example: 'PUNE01',
    rules: ['2–20 characters', 'Capital letters and digits only; letters are capitalised for you', 'Must be unique'],
  },
  customerId: {
    title: 'Customer',
    content: 'Customer account that owns this branch. The City list shows this customer’s cities.',
  },
  userCityId: {
    title: 'City',
    content: 'City the branch is in, picked from the customer’s cities (Masters › City). Leave blank if it has none.',
  },
  colorCode: {
    title: 'Colour',
    content: 'Colour used to tell this branch apart in lists and charts.',
    example: '#F58220',
    rules: ['# followed by 6 hex digits', 'Pick one with the swatch or type it'],
  },
}
