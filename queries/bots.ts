import "server-only"

import { auth } from "@clerk/nextjs/server"
import { and, asc, desc, eq, sql } from "drizzle-orm"

import { db } from "@/lib/db"
import { bots, chatMembers, chats } from "@/lib/db/schema"

export async function getUserChats() {
  const { userId } = await auth.protect()

  // Use the earliest member for both direct and group chats for now.
  // Check bot ownership too, so a bad membership cannot expose another user's bot.
  const firstBot = db
    .select({ name: bots.name, avatar: bots.avatar })
    .from(chatMembers)
    .innerJoin(bots, eq(bots.id, chatMembers.botId))
    .where(and(eq(chatMembers.chatId, chats.id), eq(bots.userId, userId)))
    .orderBy(asc(chatMembers.joinedAt), asc(chatMembers.botId))
    .limit(1)
    .as("first_bot")

  return db
    .select({
      id: chats.id,
      name: firstBot.name,
      avatar: firstBot.avatar,
      lastMessagePreview: chats.lastMessagePreview,
      lastMessageAt: chats.lastMessageAt,
    })
    .from(chats)
    .innerJoinLateral(firstBot, sql`true`)
    .where(eq(chats.userId, userId))
    .orderBy(desc(chats.lastMessageAt), desc(chats.id))
}
