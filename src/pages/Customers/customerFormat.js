// Display values for a customer (user) record from the API.
export const customerName = (customer) =>
  customer.companyName || [customer.firstName, customer.lastName].filter(Boolean).join(' ') || '—'

export const customerMobile = (customer) => customer.primaryPhone || customer.mobile || '—'
