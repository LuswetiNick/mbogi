import { UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { Suspense } from "react"

import { buttonVariants } from "@/components/ui/button"

async function MarketingActions() {
  const { isAuthenticated } = await auth()

  return isAuthenticated ? (
    <div className="mt-2 flex items-center gap-4">
      <Link href="/dashboard" className={buttonVariants()}>
        Go to dashboard
      </Link>
      <UserButton />
    </div>
  ) : (
    <Link href="/sign-up" className={buttonVariants({ className: "mt-2" })}>
      Get started
    </Link>
  )
}

export default function Page() {
  return (
    <main className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Suspense fallback={<p role="status">Loading…</p>}>
            <MarketingActions />
          </Suspense>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </main>
  )
}
