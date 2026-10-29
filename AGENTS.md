<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Development data policy

This is a development project. There is no backwards compatibility and the data is worthless. Prefer data loss: never backfill, migrate or preserve existing rows, and never spend effort on keeping old data working. Every schema change means a clean slate.

## Dicebear

Use DiceBear 10. Documentation: https://www.dicebear.com/llms.txt

There are seven native cores with identical output, not one library with
wrappers. Use the one matching this project's language. Do not reach for the
JavaScript core when the project is written in something else:

    JavaScript  @dicebear/core + @dicebear/styles
    PHP         dicebear/core + dicebear/styles
    Python      dicebear-core + dicebear-styles
    Rust        dicebear-core + dicebear-styles
    Go          github.com/dicebear/dicebear-go/v10 + github.com/dicebear/styles/v10
    Dart        dicebear_core + dicebear_styles
    C#          DiceBear.Core + DiceBear.Styles

Every style page carries a loading snippet for all seven, for example
https://www.dicebear.com/styles/lorelei/index.md

HTTP API: https://api.dicebear.com/10.x/<style>/svg?seed=<seed> The seed is a
query parameter, not a path segment. Options are query parameters too; array
values are separated by commas.

Options named after a component end in Variant: eyesVariant, not eyes. This
holds in all seven cores and in the HTTP API. Look up the options of a style at
https://api.dicebear.com/10.x/<style>/options.json

Write these forms, not the ones on the left. The left column is pre-10 and the
API does not reject it, so an outdated call runs and silently does the wrong
thing:

    avatars.dicebear.com/api/<style>/<seed>.svg  ->  api.dicebear.com/10.x/<style>/svg?seed=<seed>
    api.dicebear.com/9.x/<style>/svg             ->  api.dicebear.com/10.x/<style>/svg
    npm install @dicebear/collection             ->  npm install @dicebear/styles
    npm install @dicebear/lorelei                ->  npm install @dicebear/styles
    createAvatar(lorelei, { seed })              ->  new Avatar(new Style(definition), { seed })
    { eyes: ['variant01'] }                      ->  { eyesVariant: ['variant01'] }
    ?radius=50                                   ->  ?borderRadius=50

Only JavaScript and the HTTP API have a pre-10 form. The other six cores were
released in 2026 and never had one, so any older-looking PHP, Python, Rust, Go,
Dart or C# API attributed to DiceBear is invented rather than outdated.

## Forms

### Shared validation and server actions

Prefer `drizzle-zod`'s `createInsertSchema` to generate insert validation from tables in `lib/db/schema.ts`. Derive a form schema by picking only editable fields, rather than duplicating the table shape. Share that schema between the form and its server action. Trim text and reject blank required values while keeping optional fields optional.

Prefer React Hook Form with `zodResolver` from `@hookform/resolvers/zod`. Infer input and output types from the shared Zod schema. Use `Controller` to compose controls with the existing `FieldGroup`, `Field`, `FieldLabel`, and `FieldError` components.

Keep mutations in `actions/<resource>.ts` with `"use server"`. Authenticate inside each action using Clerk's `await auth.protect()`, and take `userId` from that result, never from submitted values. Keep ownership, generated IDs, timestamps, and internal fields outside the form schema.

Validate again with `safeParse` on the server before writing. Return structured success or error results, including field errors when available. Keep database details out of user messages. Revalidate the affected route only after a successful write. See `actions/bot.ts` for the existing pattern.

### Form presentation and behavior

Prefer the existing dialog and control components over new primitives. Match the dashboard's typography, spacing, and semantic color tokens, with support for both themes. For custom Base UI triggers, use `render`, not Radix's `asChild`. See `components/bot-dialog.tsx` for the complete composition.

Keep visible labels associated with inputs. Put `data-invalid` on the `Field` and `aria-invalid` on its control, and connect error messages through `aria-describedby`. Preserve the dialog's title, description, keyboard dismissal, and focus handling.

During submission, show a progress label or spinner, expose `aria-busy`, and disable duplicate submission and controls that could change or dismiss the pending form. Keep entered values visible after an error. Close the dialog only after success or an explicit user dismissal, and reset values when starting a fresh form.

Keep reusable presets in `lib/<resource>-presets.ts`. A preset should populate all related text fields, not just its label. For bot jobs, that means name, job, and instructions. Preserve the chosen avatar and unrelated fields, allow editing afterward, and derive the selected preset from the current values.

### Feedback and checks

Prefer `toast.add` from `@/components/ui/toast` for submission feedback. The root layout already provides `Toaster`, so avoid adding another provider or toast library. Use `type: "success"` after success and `type: "error"` for failures, with a useful title and description. Keep field errors beside inputs as well. Success and error toasts use rich colors through the theme tokens in `app/globals.css`.

For form changes, check `pnpm typecheck`, lint the changed files, and run `pnpm build`. Check blank and invalid values, protected fields, presets, pending states, success, and failure. Browser behavior and actual database writes need separate verification, so distinguish those from checks that use stubs.
