import { auth } from "@clerk/nextjs/server"
import { formatDistanceStrict } from "date-fns/formatDistanceStrict"
import type { ReactNode } from "react"

import { DashboardFrame } from "@/components/dashboard-frame"
import { getUserChats } from "@/queries/bots"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  await auth.protect({ unauthenticatedUrl: "/sign-in" })

  const chats = await getUserChats()
  const now = new Date()

  return (
    <DashboardFrame
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
