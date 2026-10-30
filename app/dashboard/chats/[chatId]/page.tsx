import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chat | Mbogi",
  robots: { index: false, follow: false },
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>
}) {
  const { chatId } = await params

  return (
    <main className="flex min-h-full min-w-0 flex-col p-4 sm:p-6">
      <p className="text-sm break-all">Chat ID: {chatId}</p>
    </main>
  )
}
