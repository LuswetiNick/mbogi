import { SignIn } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"

export const metadata: Metadata = { title: "Sign in | Mbogi" }

async function SignInForm() {
  const { isAuthenticated } = await auth()

  if (isAuthenticated) {
    redirect("/dashboard")
  }

  return (
    <SignIn
      routing="path"
      path="/sign-in"
      signUpUrl="/sign-up"
      forceRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/dashboard"
      appearance={{ elements: { rootBox: "w-full", cardBox: "w-full" } }}
    />
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<p role="status">Loading…</p>}>
      <SignInForm />
    </Suspense>
  )
}
