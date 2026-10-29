"use client"

import { UserButton } from "@clerk/nextjs"
import { HomeIcon, SearchIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"

import {
  DashboardShell,
  type DashboardShellNavSection,
} from "@/components/block/dashboard-shell"
import { ChatAvatar } from "@/components/chat-avatar"
import { SidebarCreateMenu } from "@/components/sidebar-create-menu"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { InputGroup, InputGroupButton } from "@/components/ui/input-group"
import { Kbd, KbdGroup } from "@/components/ui/kbd"

const secondaryNavigation = [
  { id: "home", label: "Home", icon: HomeIcon, href: "/" },
]

type SidebarChat = {
  id: string
  name: string
  avatar: string
  lastMessagePreview: string | null
  lastMessageAt: string
  lastMessageAge: string
}

export function DashboardFrame({
  children,
  chats,
}: {
  children: ReactNode
  chats: SidebarChat[]
}) {
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeChatId, setActiveChatId] = useState(chats[0]?.id)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.key.toLowerCase() !== "k" ||
        !(event.metaKey || event.ctrlKey) ||
        event.altKey ||
        event.shiftKey ||
        event.repeat ||
        event.isComposing ||
        event.defaultPrevented
      )
        return

      event.preventDefault()
      setSearchOpen((open) => !open)
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const chatNavigation: DashboardShellNavSection = {
    id: "chats",
    title: "Chats",
    emptyMessage: "No chats yet. Create a bot to get started.",
    items: chats.map((chat) => ({
      id: chat.id,
      label: chat.name,
      href: `/dashboard/chats/${encodeURIComponent(chat.id)}`,
      leading: <ChatAvatar seed={chat.avatar} className="size-10" />,
      description: chat.lastMessagePreview ?? "No messages yet",
      metadata: (
        <time dateTime={chat.lastMessageAt}>{chat.lastMessageAge}</time>
      ),
    })),
  }

  return (
    <>
      <DashboardShell
        navigation={[chatNavigation]}
        secondaryNavigation={secondaryNavigation}
        sidebarHeaderActions={<SidebarCreateMenu />}
        sidebarSearch={
          <InputGroup>
            <InputGroupButton
              type="button"
              size="sm"
              className="h-full w-full justify-start"
              data-slot="input-group-control"
              aria-label="Search chats"
              aria-haspopup="dialog"
              aria-expanded={searchOpen}
              aria-keyshortcuts="Meta+K Control+K"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon aria-hidden data-icon="inline-start" />
              <span className="min-w-0 flex-1 truncate text-left text-muted-foreground">
                Search chats…
              </span>
              <KbdGroup aria-hidden>
                <Kbd>⌘ / Ctrl</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </InputGroupButton>
          </InputGroup>
        }
        activeItemId={activeChatId}
        onActiveItemChange={setActiveChatId}
        defaultSidebarWidth={300}
        title="Dashboard"
        headerActions={<UserButton />}
        linkComponent={Link}
        className="h-dvh"
      >
        {children}
      </DashboardShell>
      <CommandDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        title="Search chats"
        description="Find a chat by bot name or message. Use the arrow keys to browse and Enter to select."
        className="sm:max-w-lg"
      >
        <Command loop vimBindings={false}>
          <CommandInput placeholder="Search chats…" aria-label="Search chats" />
          <CommandList>
            <CommandEmpty>
              {chats.length === 0
                ? "No chats yet. Create a bot to get started."
                : "No chats found."}
            </CommandEmpty>
            <CommandGroup heading="Chats">
              {chats.map((chat) => (
                <CommandItem
                  key={chat.id}
                  value={chat.id}
                  keywords={[chat.name, chat.lastMessagePreview ?? ""]}
                  onSelect={() => {
                    setActiveChatId(chat.id)
                    setSearchOpen(false)
                    router.push(
                      `/dashboard/chats/${encodeURIComponent(chat.id)}`
                    )
                  }}
                >
                  <span aria-hidden>
                    <ChatAvatar seed={chat.avatar} className="size-8" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate">{chat.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {chat.lastMessagePreview ?? "No messages yet"}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
