// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form — keep in sync with clienteleSchema (clienteleForm.js).
export const FIELD_HELP = {
  userId: {
    title: 'Customer',
    content: "Customer the client belongs to. The client is then offered on that customer's parts.",
  },
  clientCode: {
    title: 'Client ID',
    content: "The customer's own number for this client. Each customer uses a Client ID once.",
    example: 'CL-001',
  },
  contactNumber: {
    title: 'Contact Number',
    content: "Type the number without the country code; it is added from the selected country.",
    example: '98765 43210',
  },
}
