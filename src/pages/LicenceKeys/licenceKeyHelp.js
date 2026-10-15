import { MAX_KEYS } from './licenceKeyForm'

// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form — keep in sync with generateSchema (licenceKeyForm.js).
export const FIELD_HELP = {
  count: {
    title: 'No. Of Key',
    content: 'How many licence keys to generate. Generate Key shows them; Save stores them for the customer.',
    rules: [`1 to ${MAX_KEYS} keys at once`, 'Changing the number clears the generated keys', 'Each key gets its own Subscription Duration; it ends that long after the day it is saved'],
  },
}
