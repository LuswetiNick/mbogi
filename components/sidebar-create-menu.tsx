"use client"

import { BotIcon, PlusIcon, UsersIcon } from "lucide-react"
import { useId, useRef } from "react"

import { DashboardButton } from "@/components/block/dashboard-shell"
import { BotDialog } from "@/components/bot-dialog"
import { DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SidebarCreateMenu() {
  const initialAvatar = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <BotDialog initialAvatar={initialAvatar} finalFocus={triggerRef}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <DashboardButton
              ref={triggerRef}
              variant="ghost"
              size="icon"
              aria-label="Create new"
            />
          }
        >
          <PlusIcon aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            <DialogTrigger render={<DropdownMenuItem />} nativeButton={false}>
              <BotIcon aria-hidden />
              Create a new bot
            </DialogTrigger>
            <DropdownMenuItem>
              <UsersIcon aria-hidden />
              Create a group chat
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </BotDialog>
  )
}
