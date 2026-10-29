import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <main className="flex flex-col gap-2 p-4 sm:p-6" role="status">
      <span className="sr-only">Loading dashboard…</span>
      <Skeleton className="h-7 w-28" />
      <Skeleton className="h-6 w-56 max-w-full" />
    </main>
  )
}
