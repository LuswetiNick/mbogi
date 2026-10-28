"use client"

import { Button } from "@/components/ui/button"

export default function DashboardError({ retry }: { retry: () => void }) {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl flex-col items-start gap-4 p-6">
      <h1 className="text-xl font-medium">Something went wrong.</h1>
      <p role="alert">Something went wrong. Please try again.</p>
      <Button onClick={() => retry()}>Try again</Button>
    </main>
  )
}
