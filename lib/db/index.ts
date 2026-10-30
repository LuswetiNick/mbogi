import "server-only"

import { attachDatabasePool } from "@vercel/functions"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import * as schema from "./schema"

const globalForDb = globalThis as typeof globalThis & {
  dbPool?: Pool
}

function createPool() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error("DATABASE_URL is required to connect to Neon.")
  }

  // Keep certificate and hostname verification explicit across pg versions.
  const url = new URL(connectionString)
  url.searchParams.set("sslmode", "verify-full")

  const pool = new Pool({
    connectionString: url.toString(),
    max: 10,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 10000,
  })

  attachDatabasePool(pool)

  return pool
}

const pool = globalForDb.dbPool ?? createPool()

// Reuse connections across Next.js hot reloads in development.
if (process.env.NODE_ENV !== "production") {
  globalForDb.dbPool = pool
}

export const db = drizzle({ client: pool, schema })
