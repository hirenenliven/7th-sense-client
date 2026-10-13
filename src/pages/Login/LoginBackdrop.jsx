import { useId } from 'react'

// Concentric rounded rings broken into arcs (the "fingerprint" behind the login form),
// plus a soft glow in the middle. Purely decorative; colours come from .ts-login-* tokens.
const RING_COUNT = 11
const CENTER = { x: 800, y: 450 }

const RINGS = Array.from({ length: RING_COUNT }, (_, index) => {
  const width = 520 + index * 150
  const height = 620 + index * 115
  return {
    key: index,
    x: CENTER.x - width / 2,
    y: CENTER.y - height / 2,
    width,
    height,
    radius: Math.min(width, height) * 0.38,
    // Long arcs with short gaps, a different rhythm on every ring
    dash: `${180 + index * 47} ${26 + (index % 4) * 14}`,
    offset: index * 113,
  }
})

function LoginBackdrop() {
  const blurId = useId()

  return (
    <svg className="ts-login-backdrop" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <filter id={blurId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="40" />
        </filter>
      </defs>
      <rect className="ts-login-glow" x="570" y="160" width="460" height="580" rx="190" filter={`url(#${blurId})`} />
      {RINGS.map((ring) => (
        <rect
          key={ring.key}
          className="ts-login-ring"
          x={ring.x}
          y={ring.y}
          width={ring.width}
          height={ring.height}
          rx={ring.radius}
          strokeDasharray={ring.dash}
          strokeDashoffset={ring.offset}
        />
      ))}
    </svg>
  )
}

export default LoginBackdrop
