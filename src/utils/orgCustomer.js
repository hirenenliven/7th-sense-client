import { z } from 'zod'

// Customer of a Masters › Country … Supervisor form. The superadmin picks it on the form
// (OrgCustomerField); everyone else always saves to their own company, so the field is empty.

// The form schema plus `customerId` (required when the superadmin picks it)
export const withCustomer = (schema, required) =>
  schema.extend({ customerId: required ? z.string().min(1, 'Customer is required') : z.string() })

// Parent options of the picked customer: rows whose owner (`key`) is customerId. Without a
// picker (not superadmin) every row is the company's, so all are kept.
export const ownedBy = (rows, canPick, customerId, key = 'userId') =>
  canPick ? rows.filter((row) => customerId && String(row[key]) === customerId) : rows

// Owner of the row `id` (e.g. the list filter's parent), as a form value; '' when unknown
export const ownerOf = (rows, id, key = 'userId') => {
  const row = rows.find((option) => String(option.id) === String(id))
  return row?.[key] ? String(row[key]) : ''
}
