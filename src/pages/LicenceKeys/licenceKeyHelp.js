import { MAX_KEYS } from './licenceKeyForm'
import { tk, tkv } from '@/i18n/tk'

// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form — keep in sync with generateSchema (licenceKeyForm.js).
export const FIELD_HELP = {
  count: {
    title: tk('No. Of Key'),
    content: tk('How many licence keys to generate. Generate Key shows them; Save stores them for the customer.'),
    rules: [tkv('1 to {{n}} keys at once', { n: MAX_KEYS }), tk('Changing the number clears the generated keys'), tk('Each key gets its own Subscription Duration; it ends that long after the day it is saved')],
  },
}
