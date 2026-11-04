// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form — keep in sync with brandSchema (brandForm.js).
export const FIELD_HELP = {
  name: {
    title: 'Brand Name',
    content: 'Maker of the CNC controllers, as the machine form lists it.',
    example: 'Siemens',
    rules: ['Unique'],
  },
  code: {
    title: 'Code',
    content: 'Optional short code for the brand. Saved in capitals.',
    example: 'SIEMENS',
    rules: ['2 to 50 letters, numbers, - or _', 'Unique'],
  },
}
