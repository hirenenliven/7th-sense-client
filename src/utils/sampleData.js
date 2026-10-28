// Seeded random numbers for the SAMPLE data of screens whose server API does not exist yet (Machine
// Health, Productivity): the same machine, date and salt always give the same numbers.

// Small seeded PRNG (mulberry32): repeatable numbers for a seed
const seededRandom = (seed) => {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let next = Math.imul(state ^ (state >>> 15), 1 | state)
    next = (next + Math.imul(next ^ (next >>> 7), 61 | next)) ^ next
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296
  }
}

// FNV-1a: a string → 32-bit seed
const hashSeed = (text) => {
  let hash = 0x811c9dc5
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

export const randomFor = (machineId, isoDate, salt) => seededRandom(hashSeed(`${machineId}|${isoDate}|${salt}`))

export const round = (value, decimals) => Number(value.toFixed(decimals))
