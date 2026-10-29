"use client"

import { UserButton } from "@clerk/nextjs"
import { BotIcon, HomeIcon, LayoutDashboardIcon } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import {
  DashboardShell,
  type DashboardShellNavSection,
} from "@/components/block/dashboard-shell"

const navigation: DashboardShellNavSection[] = [
  {
    id: "workspace",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboardIcon,
        href: "/dashboard",
      },
    ],
  },
]

const secondaryNavigation = [
  { id: "home", label: "Home", icon: HomeIcon, href: "/" },
]

export function DashboardFrame({ children }: { children: ReactNode }) {
  return (
    <DashboardShell
      brand={{
        name: "Mbogi",
        description: "Your bot workspace",
        logo: <BotIcon aria-hidden className="size-6" />,
      }}
      navigation={navigation}
      secondaryNavigation={secondaryNavigation}
      activeItemId="dashboard"
      title="Dashboard"
      headerActions={<UserButton />}
      linkComponent={Link}
      className="h-dvh"
    >
      {children}
    </DashboardShell>
  )
}
