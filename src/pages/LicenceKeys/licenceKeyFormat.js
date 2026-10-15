import { customerName } from '@/pages/Customers/customerFormat'

// Customer select option: "Company (username)", or the username when the customer has no name
export const customerOptionLabel = (customer) =>
  customerName(customer) === '—' ? customer.username : `${customerName(customer)} (${customer.username})`
