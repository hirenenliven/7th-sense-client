// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form — keep in sync with modelSchema (modelForm.js).
import { tk } from '@/i18n/tk'

export const FIELD_HELP = {
  name: {
    title: tk('Model Name'),
    content: tk('Machine model as the machine form lists it under the controller.'),
    example: 'DX 200 5A',
    rules: [tk('Unique within the controller (capital and small letters count as the same)')],
  },
}
