import Image from "next/image"

import { cn } from "@/lib/utils"

type ChatAvatarProps = {
  seed: string
  animated?: boolean
  className?: string
}

export function ChatAvatar({
  seed,
  animated = false,
  className,
}: ChatAvatarProps) {
  const params = new URLSearchParams({ seed })

  return (
    <span
      data-slot="chat-avatar"
      className={cn(
        "inline-flex size-10 shrink-0",
        animated && "motion-safe:animate-bounce",
        className
      )}
    >
      <Image
        src={`https://api.dicebear.com/10.x/bottts/svg?${params}`}
        alt="Bot avatar"
        width={40}
        height={40}
        className="size-full object-contain"
        unoptimized
      />
    </span>
  )
}
