# Verify bot creation

Updated: 2026-10-29

This checklist covers `createBot` in `actions/bot.ts`. You can run these checks against your development database. No scope row or governing spec exists for this task.

## Browser and database

1. [ ] You can sign in and create a bot through the dashboard form. Expect success feedback and a new bot in the dashboard. In the database, expect one new bot, one new direct chat, and one membership linking their generated IDs.
2. [ ] You can inspect the new records. Expect both `userId` values to match your authenticated Clerk user, the chat kind to be `direct`, and the chat name to be null. Expect generated IDs and default timestamps to be populated.
3. [ ] You can submit blank required fields and invalid values. Expect validation errors and no new records in any of the three tables.
4. [ ] You can call the action with extra ownership, ID, or chat fields in a controlled development test. Expect those fields to be ignored. Ownership should still come from Clerk, and the new chat should still be direct with a null name.
5. [ ] You can call the action without a valid session. Expect Clerk to deny access before any database writes.
6. [ ] You can use an isolated database test to make the bot, chat, and membership inserts fail in turn. Expect the transaction to roll back every new record, the action to return its generic creation error, and no dashboard revalidation. Stubs alone do not prove database rollback.
7. [ ] You can confirm that successful creation returns the existing `{ success: true, bot: { id } }` shape and revalidates `/dashboard` only after the transaction commits.

## Commands

1. [ ] You can run `pnpm typecheck` and expect no type errors.
2. [ ] You can run `pnpm exec eslint actions/bot.ts` and expect no lint errors.
3. [ ] You can run `pnpm exec prettier --check actions/bot.ts` and expect formatting to pass.
4. [ ] You can run `pnpm build` and expect a successful production build.

## Checks already completed

Typecheck, lint, formatting, and the production build passed during implementation.

An action check used real schema validation with stubbed Clerk and database calls. It covered successful creation, membership IDs, authenticated ownership, ignored protected fields, trimming, invalid input, failure at each insert, and revalidation timing.

The browser flow, actual database writes, and real database rollback have not been verified for this action change. No persistent automated test suite was added.
