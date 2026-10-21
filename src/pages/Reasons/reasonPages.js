import { tk } from '@/i18n/tk'
import {
  createDowntimeReason,
  deleteDowntimeReason,
  getDowntimeReasons,
  updateDowntimeReason,
} from '@/services/downtimeReasonService'
import { createIdleReason, deleteIdleReason, getIdleReasons, updateIdleReason } from '@/services/idleReasonService'

// Masters › Downtime has two screens with the same fields (customer, reason code, reason): the
// reasons a machine was down and the reasons it stood idle. <ReasonList kind={…} /> serves both;
// a kind holds the service calls and the wording of its screen — whole sentences (English keys,
// shown with t()), as languages with grammatical gender cannot assemble them from one noun.
export const REASON_KIND = {
  DOWNTIME: 'downtime',
  IDLE: 'idle',
}

export const REASON_PAGES = {
  [REASON_KIND.DOWNTIME]: {
    icon: 'bi-exclamation-octagon',
    list: getDowntimeReasons,
    create: createDowntimeReason,
    update: updateDowntimeReason,
    remove: deleteDowntimeReason,
    text: {
      eyebrow: tk('Masters · Downtime'),
      title: tk('Downtime List'),
      subtitle: tk('Reasons an operator picks when a machine is down.'),
      add: tk('Add Downtime Reason'),
      edit: tk('Edit Downtime Reason'),
      loading: tk('Loading downtime reasons…'),
      loadFailed: tk('Could not load downtime reasons.'),
      empty: tk('No downtime reasons yet.'),
      addFirst: tk('Add the first downtime reason'),
      noMatch: tk('No downtime reasons match these filters.'),
      search: tk('Search downtime reasons'),
      created: tk('Downtime reason created'),
      updated: tk('Downtime reason updated'),
      deleted: tk('Downtime reason deleted'),
      saveFailed: tk('Could not save downtime reason'),
      deleteFailed: tk('Could not delete downtime reason'),
      deleteTitle: tk('Delete downtime reason'),
    },
  },
  [REASON_KIND.IDLE]: {
    icon: 'bi-pause-circle',
    list: getIdleReasons,
    create: createIdleReason,
    update: updateIdleReason,
    remove: deleteIdleReason,
    text: {
      eyebrow: tk('Masters · Downtime'),
      title: tk('Idle List'),
      subtitle: tk('Reasons an operator picks when a machine stands idle.'),
      add: tk('Add Idle Reason'),
      edit: tk('Edit Idle Reason'),
      loading: tk('Loading idle reasons…'),
      loadFailed: tk('Could not load idle reasons.'),
      empty: tk('No idle reasons yet.'),
      addFirst: tk('Add the first idle reason'),
      noMatch: tk('No idle reasons match these filters.'),
      search: tk('Search idle reasons'),
      created: tk('Idle reason created'),
      updated: tk('Idle reason updated'),
      deleted: tk('Idle reason deleted'),
      saveFailed: tk('Could not save idle reason'),
      deleteFailed: tk('Could not delete idle reason'),
      deleteTitle: tk('Delete idle reason'),
    },
  },
}
