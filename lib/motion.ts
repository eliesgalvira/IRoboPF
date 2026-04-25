"use client"

import * as React from "react"

export function useCountUp(value: number, durationMs = 600) {
  const [display, setDisplay] = React.useState(value)
  const previous = React.useRef(value)

  React.useEffect(() => {
    const start = previous.current
    const end = value
    if (start === end) {
      setDisplay(end)
      return
    }
    const startTime = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3)
      const next = start + (end - start) * eased
      setDisplay(next)
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setDisplay(end)
        previous.current = end
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, durationMs])

  return display
}
