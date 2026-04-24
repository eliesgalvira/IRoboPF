"use client"

import * as React from "react"

export function HandUnderline({
  className,
  style,
}: {
  readonly className?: string
  readonly style?: React.CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      className={className}
      style={style}
      aria-hidden
    >
      <path
        d="M2 7 Q 50 1, 100 7 T 198 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function HandArrow({
  className,
  style,
}: {
  readonly className?: string
  readonly style?: React.CSSProperties
}) {
  return (
    <svg viewBox="0 0 60 30" className={className} style={style} aria-hidden>
      <path
        d="M2 22 C 18 4, 38 4, 56 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M50 10 L 56 18 L 48 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PaperTexture() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
      width="100%"
      height="100%"
    >
      <filter id="v3-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#v3-grain)" />
    </svg>
  )
}
