import {
  createDowntimeReason,
  deleteDowntimeReason,
  getDowntimeReasons,
  updateDowntimeReason,
} from '@/services/downtimeReasonService'
import { createIdleReason, deleteIdleReason, getIdleReasons, updateIdleReason } from '@/services/idleReasonService'

// Masters › Downtime has two screens with the same fields (customer, reason code, reason): the
// reasons a machine was down and the reasons it stood idle. <ReasonList kind={…} /> serves both;
// a kind holds the wording and the service calls of its screen.
export const REASON_KIND = {
  DOWNTIME: 'downtime',
  IDLE: 'idle',
}

export const REASON_PAGES = {
  [REASON_KIND.DOWNTIME]: {
    eyebrow: 'Masters · Downtime',
    title: 'Downtime List',
    singular: 'Downtime Reason',
    noun: 'downtime reason',
    plural: 'downtime reasons',
    subtitle: 'Reasons an operator picks when a machine is down.',
    icon: 'bi-exclamation-octagon',
    list: getDowntimeReasons,
    create: createDowntimeReason,
    update: updateDowntimeReason,
    remove: deleteDowntimeReason,
  },
  [REASON_KIND.IDLE]: {
    eyebrow: 'Masters · Downtime',
    title: 'Idle List',
    singular: 'Idle Reason',
    noun: 'idle reason',
    plural: 'idle reasons',
    subtitle: 'Reasons an operator picks when a machine stands idle.',
    icon: 'bi-pause-circle',
    list: getIdleReasons,
    create: createIdleReason,
    update: updateIdleReason,
    remove: deleteIdleReason,
  },
}
