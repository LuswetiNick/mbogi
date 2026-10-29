import type { Metadata } from "next"

import { BotsEmptyState } from "@/components/bots-empty-state"

export const metadata: Metadata = {
  title: "Dashboard | Mbogi",
  robots: { index: false, follow: false },
}

export default function DashboardPage() {
  return (
    <main className="flex min-h-full min-w-0 flex-col p-4 sm:p-6">
      <BotsEmptyState />
    </main>
  )
}
