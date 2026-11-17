// Help popovers for fields whose meaning is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form — keep in sync with operatorTaskSchema (operatorTaskForm.js).
export const FIELD_HELP = {
  modelId: {
    title: 'Machine Type',
    content: 'The machine model (Account Center › Machine Catalog) the task is for. Leave it blank and the task applies to every machine of the customer.',
  },
  maintenanceTaskId: {
    title: 'Task',
    content: 'The check the operator does. Pick one from the list, or add a new one with New task — it is then available for every customer.',
    rules: ['At most 100 characters', 'A task is added once per customer and machine type'],
  },
  description: {
    title: 'Task',
    content: 'A check an operator does on a machine. It is shared by every customer and shows in the Task list of Operator Tasks.',
    example: 'Coolant not working and need to fix',
    rules: ['At most 100 characters', 'Each task once (capitals and extra spaces do not count)'],
  },
}
