// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form — keep in sync with controllerSchema (controllerForm.js).
export const FIELD_HELP = {
  name: {
    title: 'Controller Name',
    content: 'Name of the CNC controller as the machine form lists it under the brand. Include the variant or series in the name.',
    example: 'Sinumerik 828D',
    rules: ['Unique within the brand'],
  },
}
