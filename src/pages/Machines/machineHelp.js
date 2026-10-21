import { tk } from '@/i18n/tk'

// Help popovers for fields whose meaning or format is not obvious from the label.
// Shown by <FieldLabel help={…}> on the form — keep in sync with machineSchema (machineForm.js).
export const FIELD_HELP = {
  userId: {
    title: tk('Customer'),
    content: tk('Customer that owns the machine. Only that customer (and admins) can see it, and its lines are offered under Machine Line No.'),
  },
  controllerId: {
    title: tk('Controller'),
    content: tk('Controllers of the selected brand (Masters › Machine Catalog › Controllers). Pick the brand first.'),
  },
  modelId: {
    title: tk('Model Name'),
    content: tk('Machine models of the selected controller (Masters › Machine Catalog › Models). Pick the controller first.'),
  },
  lineId: {
    title: tk('Machine Line No.'),
    content: tk("One of the customer's lines (Masters › Line). Pick the customer first."),
  },
  amc: {
    title: tk('AMC'),
    content: tk('Annual maintenance contract details. Fill in only after the warranty has ended.'),
  },
  liveIp: {
    title: tk('Live IP'),
    content: tk('Public IP the data collector reaches the machine on.'),
    example: '103.81.119.106',
  },
  localIp: {
    title: tk('Local IP'),
    content: tk("Machine's IP inside the customer's network."),
    example: '192.168.1.10',
  },
  port: {
    title: tk('Port'),
    content: tk('Port of the machine controller data service (OPC UA).'),
    example: '4840',
  },
  password: {
    title: tk('Password'),
    content: tk('Controller login used by the data collector. It is never shown again after saving.'),
    rules: [tk('When editing, leave blank to keep the saved password')],
  },
  securityMode: {
    title: tk('Security Type'),
    content: tk('OPC UA security policy the controller connection uses.'),
  },
  healthIds: {
    title: tk('Machine Health'),
    content: tk('Health sensors to monitor on this machine.'),
  },
}
