import type { Metadata } from "next"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-svh flex-col p-6">
      <header>
        <Link href="/" className={buttonVariants({ variant: "ghost" })}>
          Home
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center py-8">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  )
}
