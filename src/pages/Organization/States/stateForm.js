import { z } from 'zod'

export const INITIAL_VALUES = {
  userCountryIds: [],
  states: [],
}

// A picked state is "<userCountryId>:<name>", so one list can hold states of several countries
export const toStateKey = (userCountryId, name) => `${userCountryId}:${name}`

const fromStateKey = (key) => {
  const at = key.indexOf(':')
  return { userCountryId: Number(key.slice(0, at)), name: key.slice(at + 1) }
}

// The countries whose states are dropped from `states` when they are no longer picked
export const keepStatesOf = (states, userCountryIds) =>
  states.filter((key) => userCountryIds.includes(String(fromStateKey(key).userCountryId)))

// Any number of the user's countries, then any number of their states (country library)
export const stateSchema = z.object({
  userCountryIds: z.array(z.string()).min(1, 'Select at least one country'),
  states: z.array(z.string()).min(1, 'Select at least one state'),
})

// ---------------------------------------------------------------------------
// API mapping — form values → /user-state bodies ({ userCountryId, name }), one per state
// ---------------------------------------------------------------------------

export const toStatePayloads = (values) =>
  values.states.map((key) => {
    const { userCountryId, name } = fromStateKey(key)
    return { userCountryId, name: name.trim() }
  })
