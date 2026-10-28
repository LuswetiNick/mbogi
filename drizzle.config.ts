import { loadEnvConfig } from "@next/env"
import { defineConfig } from "drizzle-kit"

loadEnvConfig(process.cwd())

const url = process.env.DATABASE_URL_UNPOOLED

if (!url) {
  throw new Error("DATABASE_URL_UNPOOLED is required for Drizzle Kit.")
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  schemaFilter: ["public"],
  dbCredentials: { url },
  strict: true,
})
