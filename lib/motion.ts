"use client"

import * as React from "react"

export function useReveal<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = React.useRef<T | null>(null)
  const [revealed, setRevealed] = React.useState(false)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px", ...options },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [options])

  return [ref, revealed] as const
}

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

function getReducedMotion() {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(getReducedMotion)
  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const listener = (event: MediaQueryListEvent) => setReduced(event.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [])
  return reduced
}
