"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { db } from "@/lib/db"
import { bots, chatMembers, chats, createBotSchema } from "@/lib/db/schema"

export async function createBot(input: z.input<typeof createBotSchema>) {
  const { userId } = await auth.protect()
  const parsed = createBotSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false as const,
      error: "Check the highlighted fields and try again.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    }
  }

  let bot: { id: string }

  try {
    bot = await db.transaction(async (tx) => {
      const [createdBot] = await tx
        .insert(bots)
        .values({
          ...parsed.data,
          instructions: parsed.data.instructions || null,
          userId,
        })
        .returning({ id: bots.id })

      const [createdChat] = await tx
        .insert(chats)
        .values({ userId, kind: "direct", name: null })
        .returning({ id: chats.id })

      await tx.insert(chatMembers).values({
        chatId: createdChat.id,
        botId: createdBot.id,
      })

      return createdBot
    })
  } catch {
    return {
      success: false as const,
      error: "Your bot could not be created. Please try again.",
    }
  }

  revalidatePath("/dashboard")

  return { success: true as const, bot }
}
