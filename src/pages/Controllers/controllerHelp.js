// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form — keep in sync with controllerSchema (controllerForm.js).
import { tk } from '@/i18n/tk'

export const FIELD_HELP = {
  name: {
    title: tk('Controller Name'),
    content: tk('Name of the CNC controller as the machine form lists it under the brand. Include the variant or series in the name.'),
    example: 'Sinumerik 828D',
    rules: [tk('Unique within the brand')],
  },
}
