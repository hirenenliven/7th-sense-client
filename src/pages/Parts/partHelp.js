// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form — keep in sync with partSchema (partForm.js).
export const FIELD_HELP = {
  userId: {
    title: 'Customer',
    content: 'Customer that makes the part. Its machines are offered under Applicable Machine.',
  },
  partCount: {
    title: 'Part Count',
    content: 'Number of parts produced in one cycle of the program.',
    example: '1',
  },
  partProductionTime: {
    title: 'Part Production Time',
    content: 'Worked out from the processes: the sum of their production times, in seconds.',
  },
  machineIds: {
    title: 'Applicable Machine',
    content: "The customer's machines this process can run on. Pick the customer first.",
  },
  drawing: {
    title: 'Part Drawing',
    content: 'Drawing of the part for this process.',
    rules: ['PDF only', 'Up to 10 MB'],
  },
  times: {
    title: 'Setup / Cycle / Loading Time',
    content: 'Hours, minutes and seconds.',
    example: '1:30:00',
  },
  productionTime: {
    title: 'Production Time',
    content: 'Setup + cycle + loading / unloading time, plus the cycle times of the sub programs.',
  },
  subProgram: {
    title: 'Sub Program',
    content: 'Turn on when the main program calls sub programs, then add each with its cycle time.',
  },
}
