import { UserButton } from "@clerk/nextjs"
import { auth, currentUser } from "@clerk/nextjs/server"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Dashboard | Mbogi",
  robots: { index: false, follow: false },
}

export default async function DashboardPage() {
  await auth.protect({ unauthenticatedUrl: "/sign-in" })
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-8 p-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-medium">Dashboard</h1>
        <UserButton />
      </header>
      <section className="flex min-w-0 flex-col gap-2">
        <h2 className="text-lg font-medium">Welcome</h2>
        <p className="wrap-anywhere text-muted-foreground">
          {user.primaryEmailAddress?.emailAddress ?? "No primary email"}
        </p>
      </section>
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          className: "self-start",
        })}
      >
        Home
      </Link>
    </main>
  )
}
