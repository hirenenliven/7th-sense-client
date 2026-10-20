// Round axis ticks for a value range: evenly spaced at 1 / 2 / 2.5 / 5 × 10ⁿ, covering min … max.
// The first and last tick are the axis domain. `count` is the rough number of ticks wanted.
const STEP_MULTIPLES = [1, 2, 2.5, 5, 10]

export const niceTicks = (min, max, count = 5) => {
  const span = max - min || Math.abs(max) || 1
  const raw = span / Math.max(1, count - 1)
  const power = 10 ** Math.floor(Math.log10(raw))
  const step = STEP_MULTIPLES.map((multiple) => multiple * power).find((candidate) => candidate >= raw)
  const start = Math.floor(min / step) * step
  const end = Math.ceil(max / step) * step
  const ticks = []
  for (let value = start; value <= end + step / 2; value += step) ticks.push(Number(value.toFixed(6)))
  return ticks
}
