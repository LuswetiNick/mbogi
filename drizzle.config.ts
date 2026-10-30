import { loadEnvConfig } from "@next/env"
import { defineConfig } from "drizzle-kit"

loadEnvConfig(process.cwd())

const url = process.env.DATABASE_URL_UNPOOLED

if (!url) {
  throw new Error("DATABASE_URL_UNPOOLED is required for Drizzle Kit.")
}

// Match the application's certificate and hostname verification.
const connectionUrl = new URL(url)
connectionUrl.searchParams.set("sslmode", "verify-full")

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  schemaFilter: ["public"],
  dbCredentials: { url: connectionUrl.toString() },
  strict: true,
})
