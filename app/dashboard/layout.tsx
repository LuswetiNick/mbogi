import { auth } from "@clerk/nextjs/server"
import type { ReactNode } from "react"

import { DashboardFrame } from "@/components/dashboard-frame"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  await auth.protect({ unauthenticatedUrl: "/sign-in" })

  return <DashboardFrame>{children}</DashboardFrame>
}
