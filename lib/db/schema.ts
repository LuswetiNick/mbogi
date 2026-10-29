// Define and export application tables here using drizzle-orm/pg-core.
// Keep Neon-managed schemas (such as neon_auth) outside Drizzle migrations.
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema } from "drizzle-zod"
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

export const insertBotSchema = createInsertSchema(bots, {
  name: (schema) => schema.trim().min(1, "Give your bot a name."),
  avatar: (schema) => schema.trim().min(1, "Choose a face for your bot."),
  job: (schema) => schema.trim().min(1, "Give your bot a job."),
  instructions: (schema) => schema.trim(),
})

// Only these fields can come from the form. Ownership and generated values
// stay on the server, even if a caller sends extra fields.
export const createBotSchema = insertBotSchema
  .pick({ name: true, avatar: true, job: true, instructions: true })
  .required({ avatar: true })
