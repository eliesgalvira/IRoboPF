"use client"

import dynamic from "next/dynamic"

const ProgressivitySimulator = dynamic(
  () =>
    import("@/components/progressivity-simulator").then((module) => module.ProgressivitySimulator),
  {
    ssr: false,
    loading: () => <div className="min-h-svh bg-background" />,
  },
)

export function ProgressivitySimulatorShell() {
  return <ProgressivitySimulator />
}
