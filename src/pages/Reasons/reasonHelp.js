import { tk } from '@/i18n/tk'

// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form — keep in sync with reasonSchema (reasonForm.js).
export const FIELD_HELP = {
  userId: {
    title: tk('Customer'),
    content: tk("Customer the reason belongs to. Operators of that customer's machines pick from its reasons."),
  },
  reasonCode: {
    title: tk('Reason Code'),
    content: tk('Optional short code for the reason (up to 10 characters). Each customer uses a code once.'),
    example: 'PWR-01',
  },
}
