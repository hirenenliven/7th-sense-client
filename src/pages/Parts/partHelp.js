import { tk } from '@/i18n/tk'

// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form — keep in sync with partSchema (partForm.js).
export const FIELD_HELP = {
  userId: {
    title: tk('Customer'),
    content: tk('Customer that makes the part. Its machines are offered under Applicable Machine.'),
  },
  clienteleId: {
    title: tk('Clientele'),
    content: tk("The customer's client the part is made for (Masters › Clientele). Pick the customer first."),
  },
  partCount: {
    title: tk('Part Count'),
    content: tk('Number of parts produced in one cycle of the program.'),
    example: '1',
  },
  partProductionTime: {
    title: tk('Part Production Time'),
    content: tk('Worked out from the processes: the sum of their production times, in seconds.'),
  },
  machineIds: {
    title: tk('Applicable Machine'),
    content: tk("The customer's machines this process can run on. Pick the customer first."),
  },
  drawing: {
    title: tk('Part Drawing'),
    content: tk('Drawing of the part for this process.'),
    rules: [tk('PDF only'), tk('Up to 10 MB')],
  },
  times: {
    title: tk('Setup / Cycle / Loading Time'),
    content: tk('Hours, minutes and seconds.'),
    example: '1:30:00',
  },
  productionTime: {
    title: tk('Production Time'),
    content: tk('Setup + cycle + loading / unloading time, plus the cycle times of the sub programs.'),
  },
  subProgram: {
    title: tk('Sub Program'),
    content: tk('Turn on when the main program calls sub programs, then add each with its cycle time.'),
  },
}
