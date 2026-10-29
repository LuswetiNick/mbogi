"use client"

import { Button } from "@/components/ui/button"

export default function DashboardError({ retry }: { retry: () => void }) {
  return (
    <main className="flex min-w-0 flex-col items-start gap-4 p-4 sm:p-6">
      <h2 className="text-xl font-medium">Something went wrong.</h2>
      <p role="alert">Something went wrong. Please try again.</p>
      <Button onClick={() => retry()}>Try again</Button>
    </main>
  )
}
