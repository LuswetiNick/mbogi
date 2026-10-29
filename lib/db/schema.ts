// Define and export application tables here using drizzle-orm/pg-core.
// Keep Neon-managed schemas (such as neon_auth) outside Drizzle migrations.
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const bots = pgTable(
  "bots",
  {
    id: text("id").primaryKey().$defaultFn(nanoid),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    avatar: text("avatar").notNull().$defaultFn(nanoid),
    job: text("job").notNull(),
    instructions: text("instructions"),
    sandboxId: text("sandbox_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("bots_user_id_idx").on(table.userId)]
)
