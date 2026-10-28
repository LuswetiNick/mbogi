import { SignUp } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"

export const metadata: Metadata = { title: "Sign up | Mbogi" }

async function SignUpForm() {
  const { isAuthenticated } = await auth()

  if (isAuthenticated) {
    redirect("/dashboard")
  }

  return (
    <SignUp
      routing="path"
      path="/sign-up"
      signInUrl="/sign-in"
      forceRedirectUrl="/dashboard"
      signInForceRedirectUrl="/dashboard"
      appearance={{ elements: { rootBox: "w-full", cardBox: "w-full" } }}
    />
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<p role="status">Loading…</p>}>
      <SignUpForm />
    </Suspense>
  )
}
