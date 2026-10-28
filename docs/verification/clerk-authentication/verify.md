# Verify Clerk authentication

Updated 2026-10-28. Governing spec: `docs/specs/0001-clerk-authentication.md`.

The code is implemented. Signed out browser checks passed against the production build at `http://localhost:3000`. You chose to run the signed in checks yourself. No test user was created, and full authentication is not yet verified. The spec remains In Progress. There is no matching scope row.

## Commands

1. [x] `pnpm install --frozen-lockfile` succeeds.
2. [x] `pnpm typecheck` succeeds.
3. [x] `pnpm build` succeeds and lists `/`, `/dashboard`, `/sign-in/[[...sign-in]]`, `/sign-up/[[...sign-up]]`, and Proxy.
4. [x] `pnpm exec eslint app proxy.ts` succeeds.
5. [x] `pnpm exec prettier --check 'app/**/*.tsx' proxy.ts` succeeds.
6. [x] `git diff --check` succeeds.
7. [x] `pnpm dlx clerk@latest doctor --json` confirms Mbogi, the selected development instance, and both required environment variables. Optional production setup and CLI update warnings remain. No secret values were read or printed.
8. [x] `git check-ignore .env.local` confirms that the credential file is ignored.
9. [ ] `pnpm lint` succeeds across the repository. It currently fails in untouched `components/ui/carousel.tsx` and `hooks/use-mobile.ts`, both under `react-hooks/set-state-in-effect`. It also warns about a template under `.agents/skills/clerk-tanstack-patterns/`. These are outside this auth change.

## Browser evidence already gathered

1. [x] Home exposes a semantic Get started link to `/sign-up`. Clicking it opens the real Clerk account creation form. Covers the signed out part of AC-2 and AC-3.
2. [x] Clerk's sign up and sign in screens link to one another. Their inputs accept keyboard focus and typing. Covers part of AC-3 and AC-9.
3. [x] A signed out visit to `/dashboard` reaches local `/sign-in`, without Dashboard or Welcome content. Covers the signed out part of AC-5.
4. [x] Home and both auth screens fit a 320 px viewport without horizontal overflow. Screenshots were inspected in light and dark themes. Covers part of AC-9.
5. [x] The existing `d` shortcut toggles the theme and the Clerk form remains visible. Covers part of AC-1 and AC-9.
6. [x] The sign up response includes noindex and nofollow metadata. Covers part of AC-9.
7. [x] No uncaught browser exceptions occurred during these checks.

The browser script and screenshots are temporary evidence under `/tmp/opencode/mbogi-*`. They are not an automated test suite committed to this repository.

## Complete manual checklist

Each item below exercises a named value source in the spec. Items remain unchecked until the complete behavior is verified.

1. [ ] Confirm CLI diagnostics identify your explicitly selected Mbogi development application, `app_3LKt6n54TO6vfhR8VnnTn7aKCMJ`. No replacement application, identity database, or production instance changes should exist. Covers AC-8, source: your app selection.
2. [ ] Sign in through Clerk, refresh `/dashboard`, and confirm access remains valid. Repeat signed out and after session expiry, expecting `/sign-in` with no protected content. A browser supplied user ID must not select another identity. Covers AC-5, source: the verified Clerk session.
3. [ ] Confirm `/` is served from `app/(marketing)/page.tsx`, with no competing `app/page.tsx`. Check the existing copy, fonts, theme, tooltip, and toast providers. Covers AC-1, source: the existing starter UI and root layout.
4. [ ] Check Get started targets `/sign-up` while signed out. While signed in, check Go to dashboard targets `/dashboard` and the account menu is visible. Covers AC-2, source: verified session state and static route constants.
5. [ ] Confirm the standard forms offer your existing Clerk methods. Exercise invalid input, recovery, and any enabled verification or social provider steps. Settings must stay unchanged. Covers AC-3, source: the selected Clerk app configuration and standard components.
6. [ ] Follow Home from each auth screen and move between sign in and sign up. Expect `/`, `/sign-in`, and `/sign-up`, without route group names in the URL. Covers AC-3, source: static navigation paths.
7. [ ] Complete sign in and sign up separately. Both should finish at `/dashboard`, including when the auth URL requests a different return destination. Signed in visits to either auth route should also open `/dashboard`. Covers AC-4, source: the fixed redirect policy.
8. [ ] Confirm the dashboard displays Dashboard and Welcome, with no invented product records or metrics. Covers AC-6, source: static dashboard copy.
9. [ ] Confirm the email matches the current user's primary email in Clerk. For an account without a primary email, expect No primary email. Do not alter an existing user's data solely to test this without separate approval. Covers AC-6, source: server `currentUser()` and the explicit missing email fallback.
10. [ ] Sign out through the account menu on home and dashboard separately. Expect `/`, the signed out Get started link, and denial when reopening or refreshing `/dashboard`. Covers AC-7, source: Clerk session termination and the fixed home destination.
11. [ ] Check delayed session reads show Loading… without user information. With a controlled dashboard lookup failure, expect Something went wrong. Please try again. and an operable Try again button. Restore service and retry, expecting a fresh server attempt. Do not expose raw errors or identity data. Covers AC-9, source: static status copy and the Next.js retry callback.
12. [ ] Inspect metadata on both auth screens and the authenticated dashboard. Expect noindex and nofollow. Covers AC-9, source: route metadata.
13. [ ] Use keyboard navigation through links, forms, and account menus. Check visible focus, dialog dismissal, small screens, long emails, and both themes. Covers AC-9, source: the existing components, theme tokens, and Clerk UI.

## Acceptance criteria coverage

| Criterion | Complete checklist items |
| --- | --- |
| AC-1 | 3 |
| AC-2 | 4 |
| AC-3 | 5, 6 |
| AC-4 | 7 |
| AC-5 | 2 |
| AC-6 | 8, 9 |
| AC-7 | 10 |
| AC-8 | 1, command checks 7 and 8 |
| AC-9 | 11, 12, 13 |

The installed Next.js 16.4 documentation names the error recovery callback `retry`. The dashboard uses it to fetch again, rather than only clearing the error boundary with `reset`.
