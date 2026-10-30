"use client"

import { UserButton } from "@clerk/nextjs"
import { SearchIcon } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"

import {
  DashboardButton,
  DashboardShell,
  type DashboardShellNavSection,
} from "@/components/block/dashboard-shell"
import { BotDialog } from "@/components/bot-dialog"
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
import { DialogTrigger } from "@/components/ui/dialog"
import { InputGroup, InputGroupButton } from "@/components/ui/input-group"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type SidebarChat = {
  id: string
  botId: string
  name: string
  avatar: string
  job: string
  instructions: string | null
  lastMessagePreview: string | null
  lastMessageAt: string
  lastMessageAge: string
}

export function DashboardFrame({
  children,
  chats,
  defaultSidebarCollapsed = false,
}: {
  children: ReactNode
  chats: SidebarChat[]
  defaultSidebarCollapsed?: boolean
}) {
  const router = useRouter()
  const { chatId } = useParams<{ chatId?: string }>()
  const [searchOpen, setSearchOpen] = useState(false)
  const selectedChat = chats.find((chat) => chat.id === chatId)

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
      leading: <ChatAvatar seed={chat.avatar} className="size-8" />,
      description: chat.lastMessagePreview ?? "No messages yet",
      metadata: (
        <time dateTime={chat.lastMessageAt}>{chat.lastMessageAge}</time>
      ),
    })),
  }

  return (
    <>
      <DashboardShell
        defaultSidebarCollapsed={defaultSidebarCollapsed}
        navigation={[chatNavigation]}
        sidebarFooter={
          <UserButton
            showName
            appearance={{
              elements: {
                rootBox: "w-full min-w-0",
                userButtonTrigger: "w-full min-w-0 justify-start",
                userButtonBox: {
                  width: "100%",
                  minWidth: 0,
                  flexDirection: "row-reverse",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                },
                userButtonOuterIdentifier: "min-w-0 truncate",
                avatarBox: "size-8 shrink-0",
              },
            }}
          />
        }
        sidebarCollapsedFooter={
          <UserButton appearance={{ elements: { avatarBox: "size-8" } }} />
        }
        sidebarHeaderActions={<SidebarCreateMenu />}
        sidebarCollapsedSearch={
          <Tooltip>
            <TooltipTrigger
              render={
                <DashboardButton
                  variant="ghost"
                  size="icon"
                  className="size-10"
                  aria-label="Search chats"
                  aria-haspopup="dialog"
                  aria-expanded={searchOpen}
                  aria-keyshortcuts="Meta+K Control+K"
                  onClick={() => setSearchOpen(true)}
                />
              }
            >
              <SearchIcon aria-hidden />
            </TooltipTrigger>
            <TooltipContent side="right">
              Search chats
              <KbdGroup aria-hidden>
                <Kbd>⌘ / Ctrl</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </TooltipContent>
          </Tooltip>
        }
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
        activeItemId={selectedChat?.id ?? ""}
        defaultSidebarWidth={300}
        title={
          selectedChat ? (
            <BotDialog
              key={selectedChat.id}
              bot={{
                id: selectedChat.botId,
                name: selectedChat.name,
                avatar: selectedChat.avatar,
                job: selectedChat.job,
                instructions: selectedChat.instructions,
              }}
            >
              <DialogTrigger
                render={
                  <DashboardButton
                    variant="ghost"
                    size="md"
                    className="h-auto max-w-full min-w-0 gap-2 py-1 text-left focus-visible:ring-inset"
                    aria-label={`Edit ${selectedChat.name}`}
                  />
                }
              >
                <span aria-hidden>
                  <ChatAvatar seed={selectedChat.avatar} className="size-8" />
                </span>
                <span className="truncate">{selectedChat.name}</span>
              </DialogTrigger>
            </BotDialog>
          ) : (
            "Dashboard"
          )
        }
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
