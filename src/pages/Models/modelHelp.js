// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form — keep in sync with modelSchema (modelForm.js).
export const FIELD_HELP = {
  name: {
    title: 'Model Name',
    content: 'Machine model as the machine form lists it under the controller.',
    example: 'DX 200 5A',
    rules: ['Unique within the controller (capital and small letters count as the same)'],
  },
}
