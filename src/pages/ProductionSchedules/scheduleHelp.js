// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form — keep in sync with scheduleSchema (scheduleForm.js).
export const FIELD_HELP = {
  scheduleType: {
    title: 'Schedule Type',
    content: 'Single Day plans the machine for one date. Multiple Day plans a range of dates; each job then picks its date.',
  },
  machineId: {
    title: 'Machine',
    content: 'A machine has one schedule per day. Only the part processes that run on it are offered.',
  },
  jobId: {
    title: 'Job ID',
    content: 'Your reference for the job, e.g. the work order number.',
    example: 'WO-1024',
  },
  processId: {
    title: 'Part Process',
    content: "Processes of the part whose applicable machines include the selected machine (Masters › Parts).",
  },
  times: {
    title: 'Start / End Time',
    content: 'Must lie inside the shift. An end time before the start runs past midnight; a job of a night shift belongs to the date the shift starts.',
    example: '10:00 PM to 02:00 AM',
  },
}
