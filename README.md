# Next.js template

This is a Next.js template with shadcn/ui.

## Database (Neon + Drizzle)

The database client uses `pg` with Neon's pooled connection and Vercel's pool
lifecycle management. Import it only in server-side code (Node.js runtime):

```ts
import { db } from "@/lib/db"
import { sql } from "drizzle-orm"

const result = await db.execute(sql`select 1 as connected`)
```

Keep these variables in `.env.local` (already configured locally):

- `DATABASE_URL`: pooled Neon URL for application queries.
- `DATABASE_URL_UNPOOLED`: direct Neon URL for Drizzle Kit and migrations.

Drizzle Kit loads `.env*` using Next.js's environment loader. Set the same
variables in your deployment environment; never expose them with `NEXT_PUBLIC_`.

The application and Drizzle Kit explicitly use `sslmode=verify-full` to verify
the server certificate and hostname. This preserves the current security behavior
without the `pg` warning about future changes to `sslmode=require`.

Define and export application tables in `lib/db/schema.ts`. The schema starts
empty: this setup does not create tables or modify your existing database.
Neon-managed schemas such as `neon_auth` are not managed by this configuration.

After defining tables:

```bash
pnpm db:generate # Generate SQL migrations in drizzle/
# Review the generated SQL before applying it to the intended Neon branch.
pnpm db:migrate  # Apply migrations using the direct connection
pnpm db:studio   # Open Drizzle Studio
```

Commit the generated `drizzle/` migration files. If you already have application
tables, use `pnpm db:pull` to introspect them into `drizzle/`, then reconcile the
generated schema with `lib/db/schema.ts` and baseline migrations before applying
new ones. Test migrations on a development Neon branch first.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```
