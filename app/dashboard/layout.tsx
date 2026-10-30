import { auth } from "@clerk/nextjs/server"
import { formatDistanceStrict } from "date-fns/formatDistanceStrict"
import { cookies } from "next/headers"
import type { ReactNode } from "react"

import { DashboardFrame } from "@/components/dashboard-frame"
import { SIDEBAR_COOKIE_NAME } from "@/lib/sidebar-preferences"
import { getUserChats } from "@/queries/bots"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  await auth.protect({ unauthenticatedUrl: "/sign-in" })

  const [chats, cookieStore] = await Promise.all([getUserChats(), cookies()])
  const now = new Date()

  return (
    <DashboardFrame
      defaultSidebarCollapsed={
        cookieStore.get(SIDEBAR_COOKIE_NAME)?.value === "false"
      }
      chats={chats.map((chat) => ({
        ...chat,
        lastMessageAt: chat.lastMessageAt.toISOString(),
        lastMessageAge: formatDistanceStrict(chat.lastMessageAt, now),
      }))}
    >
      {children}
    </DashboardFrame>
  )
}
