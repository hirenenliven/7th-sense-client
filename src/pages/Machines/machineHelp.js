// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form — keep in sync with machineSchema (machineForm.js).
export const FIELD_HELP = {
  userId: {
    title: 'Customer',
    content: 'Customer that owns the machine. Only that customer (and admins) can see it, and its lines are offered under Machine Line No.',
  },
  controllerId: {
    title: 'Controller',
    content: 'Controllers of the selected brand (Account Center › Machine Catalog › Controllers). Pick the brand first.',
  },
  modelId: {
    title: 'Model Name',
    content: 'Machine models of the selected controller (Account Center › Machine Catalog › Models). Pick the controller first.',
  },
  lineId: {
    title: 'Machine Line No.',
    content: "One of the customer's lines (Masters › Line). Pick the customer first.",
  },
  amc: {
    title: 'AMC',
    content: 'Annual maintenance contract details. Fill in only after the warranty has ended.',
  },
  liveIp: {
    title: 'Live IP',
    content: 'Public IP the data collector reaches the machine on.',
    example: '103.81.119.106',
  },
  localIp: {
    title: 'Local IP',
    content: "Machine's IP inside the customer's network.",
    example: '192.168.1.10',
  },
  port: {
    title: 'Port',
    content: 'Port of the machine controller data service (OPC UA).',
    example: '4840',
  },
  password: {
    title: 'Password',
    content: 'Controller login used by the data collector. It is never shown again after saving.',
    rules: ['When editing, leave blank to keep the saved password'],
  },
  securityMode: {
    title: 'Security Type',
    content: 'OPC UA security policy the controller connection uses.',
  },
  healthIds: {
    title: 'Machine Health',
    content: 'Health sensors to monitor on this machine.',
  },
}
