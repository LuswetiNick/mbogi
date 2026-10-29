import { PlusIcon } from "lucide-react"
import { connection } from "next/server"

import { ChatAvatar } from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export async function BotsEmptyState() {
  await connection()
  const seed = crypto.randomUUID()

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <ChatAvatar seed={seed} className="size-16" />
        </EmptyMedia>
        <EmptyTitle>
          <h2>Meet your first bot</h2>
        </EmptyTitle>
        <EmptyDescription>
          Every bot gets its own personality, memory and face. Spin one up and
          start a conversation.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button type="button">
          <PlusIcon aria-hidden data-icon="inline-start" />
          Create new bot
        </Button>
      </EmptyContent>
    </Empty>
  )
}
