# 0001. Clerk authentication

**Date**: 2026-10-28
**Status**: In Progress

## Summary

Use your existing Clerk app to let visitors create an account and sign in. Keep your home page at `/`, organized under `(marketing)`, and place the auth screens under `(auth)`. Both auth flows lead to a small protected dashboard. Clerk owns users and sessions, so you do not need a new database or custom credential handling.

## Context

This is a new web feature in a single Next.js App Router application. The project uses Next.js 16.4.2, React 19.3.1, TypeScript, pnpm, Tailwind, and shadcn components built on Base UI. The current home page is a small starter screen. There are no auth routes, auth dependencies, product data models, scope files, or earlier specs.

You already own a Clerk app and want to keep it. Its identity settings and existing accounts must remain intact. The app is not yet selected for this repository through the Clerk CLI. No credentials or environment files were inspected during design.

You selected a welcome dashboard as the destination, rather than returning users to the marketing page. No additional privacy or compliance requirements were declared. No delivery approach is recorded, so the build plan assumes Tracer Bullet (prove a small complete flow first, then fill out the remaining behavior). This spec governs a buildable feature and stays Proposed until implementation starts, even though no scope row exists yet.

## Requirements

**User stories**:

1. As a visitor, you can start from the home page, create an account or sign in, and reach your dashboard.
2. As a returning user, you can open your dashboard, inspect your account menu, and sign out.
3. As the project owner, you keep your existing Clerk app and avoid adding a second identity store.

**Acceptance criteria**:

1. **AC-1**: `/` is served by `app/(marketing)/page.tsx`. The old `app/page.tsx` no longer defines a competing route. The existing root layout, fonts, theme, toast, and tooltip providers remain working.
2. **AC-2**: Signed out visitors see a Get started link styled as the existing button, targeting `/sign-up`. Signed in visitors instead see Go to dashboard targeting `/dashboard`, plus Clerk's account menu.
3. **AC-3**: `/sign-in` and `/sign-up` use Clerk's standard components in optional catch all routes under `app/(auth)`. Each provides the link to the other flow and a home link. Existing Clerk sign in methods and verification rules remain unchanged.
4. **AC-4**: Completing either auth flow always navigates to `/dashboard`. A signed in visitor opening either auth route is redirected there on the server. Requested return destinations do not override this fixed destination.
5. **AC-5**: `/dashboard` requires an active Clerk session on the server before it exposes user content. Signed out visitors and visitors with expired sessions reach `/sign-in`. A valid session continues to work after refresh. No other application routes are made private in this slice.
6. **AC-6**: The dashboard shows a Dashboard heading, a Welcome message, the current user's primary email, a home link, and Clerk's profile and sign out menu. If there is no primary email, it shows No primary email. There are no product records, metrics, or invented data.
7. **AC-7**: Signing out through either account menu ends the session and returns to `/`. The marketing page then shows Get started, and reopening or refreshing `/dashboard` does not expose protected content.
8. **AC-8**: Setup uses the existing Clerk app that you select through the CLI. It creates no replacement app, local identity tables, custom sessions, webhooks, roles, or organizations. Credentials, tokens, and user emails are not printed or committed by application setup or custom logs.
9. **AC-9**: The new screens use the current visual style and work on small screens, with keyboard navigation and visible focus. Auth and dashboard pages are marked noindex and nofollow. Session checks show a neutral loading state. Clerk owns form validation and recovery; dashboard lookup failures show a generic retry screen without user data.

## Options considered

### Option 1: Existing Clerk app with standard components

Reuse the existing identity service and embed its auth and account components.

**Pros**: The smallest complete integration, retaining your existing methods and account recovery behavior.

**Cons**: The UI follows Clerk's component contracts, and dashboard identity lookup depends on Clerk availability and service limits.

### Option 2: Existing Clerk app with custom auth forms

Keep Clerk as the identity service but build forms and verification steps using its hooks.

**Pros**: More control over form composition and wording.

**Cons**: More states to implement and test, including verification, social callbacks, recovery, and session tasks. That work does not serve your requested slice.

## Decision

**Chosen option**: Option 1, your existing Clerk app with standard components.

Use the current stable `@clerk/nextjs` SDK and matching `@clerk/ui` theme package compatible with the installed Next.js and React versions. Resolve exact package versions during implementation and record them in the pnpm lockfile. Do not upgrade Next.js or React as part of this feature. If compatibility cannot be met without that upgrade, pause and report it.

**Implementation skills**: `clerk` (`clerk/skills`, `.agents/skills/clerk/`), `clerk-setup` (`clerk/skills`, `.agents/skills/clerk-setup/`), and `clerk-nextjs-patterns` (`clerk/skills`, `.agents/skills/clerk-nextjs-patterns/`).

The Clerk specific guidance governs SDK integration. In particular, keep `clerkMiddleware()` bare and enforce access in the dashboard resource with `await auth.protect()`. Do not introduce the deprecated `createRouteMatcher` pattern from older examples.

## Rationale

You already chose Clerk and have an application to retain. Standard components preserve its configured methods without building a second auth system or custom recovery flows. Custom forms are the runner up if a later design requires them, not a prerequisite for this feature.

A fixed `/dashboard` destination makes this slice predictable and avoids application code interpreting arbitrary redirect inputs. The tradeoff is that it cannot yet restore unrelated destinations. Resource level protection keeps the access check beside the protected page rather than depending on a public navigation control or only a layout check.

## Feature design

### Data model

All records below are owned by Clerk. There is no local schema or migration.

| Record | Fields used | Relationships and constraints |
| --- | --- | --- |
| User | `id` (required string), `primaryEmailAddress` (nullable object) | Clerk owns the unique ID. One user has many sessions and email addresses. |
| Session | Session identity and active state, verified by Clerk | Belongs to one user. An expired, revoked, or incomplete session does not grant dashboard access. |
| Email address | `emailAddress` (required string when the object exists) | Belongs to one user. Clerk selects and validates the primary email under the existing app settings. No new email uniqueness rule is added locally. |

Retention, credential storage, account recovery, and deletion remain under the existing Clerk configuration. This feature neither copies nor changes them.

### Routes and interface surface

| Path | Source file | Access and output | Important failures |
| --- | --- | --- | --- |
| `/` | `app/(marketing)/page.tsx` | Public GET, existing starter content with session aware navigation | Pending session check shows neutral loading, never a false signed in state |
| `/sign-in` and nested steps | `app/(auth)/sign-in/[[...sign-in]]/page.tsx` | Public GET, Clerk SignIn for signed out visitors, dashboard redirect for signed in visitors | Clerk displays validation, verification, and provider failures |
| `/sign-up` and nested steps | `app/(auth)/sign-up/[[...sign-up]]/page.tsx` | Public GET, Clerk SignUp for signed out visitors, dashboard redirect for signed in visitors | Clerk displays existing account, verification, and provider failures |
| `/dashboard` | `app/(app)/dashboard/page.tsx` | Protected GET, minimal current user dashboard | Missing session redirects to sign in, lookup failure shows generic retry |
| Account menu | Clerk UserButton on home and dashboard | Clerk managed profile and session operations for the current user | Clerk owns errors, signing out returns to `/` |

No custom API routes, Server Actions, password endpoints, or manual OAuth callbacks are added. Clerk's components and SDK own their service requests and permitted destinations. The sign in inputs and available methods come from the selected Clerk app, not a newly invented local form schema.

### Value sourcing

| Action | Value produced or displayed | Source |
| --- | --- | --- |
| Choose setup target | Existing Clerk application ID | Your explicit choice from the authenticated Clerk CLI app list |
| Establish session | Current user identity and active session | Clerk's verified request session, never a query parameter or browser supplied user ID |
| Render marketing page | Existing copy, fonts, colors, spacing | Current `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, and existing Button styles |
| Render home navigation | Get started or Go to dashboard, destination, account menu | Verified session state, static labels and `/sign-up` or `/dashboard` constants from this spec |
| Render auth | Fields, methods, validation, verification, profile interface | Existing Clerk app settings and Clerk standard components |
| Navigate between screens | Home and alternate auth links | `/`, `/sign-in`, and `/sign-up` constants from this spec |
| Complete auth or skip auth form | Destination | Fixed `/dashboard` constant from this spec, overriding return destination inputs |
| Render dashboard | Dashboard and Welcome headings | Static labels from this spec |
| Render dashboard identity | Primary email | Server `currentUser().primaryEmailAddress.emailAddress` for the authenticated user, or the literal No primary email if absent |
| Sign out | Cleared session and destination | Clerk's session termination, followed by the fixed `/` destination |
| Render pending or failure state | Loading, retry, and missing email copy | Loading…, Something went wrong. Please try again., Try again, and No primary email literals from this spec |
| Set indexing policy | noindex and nofollow | Auth and dashboard metadata configured in this spec |

### Session transitions

1. Signed out visitors can view `/` and either auth route. Dashboard access sends them to `/sign-in`.
2. Verification or other required session tasks remain inside Clerk's configured flow. Dashboard access requires completion, not merely a user record.
3. Successful sign in or account creation establishes an active session and opens `/dashboard`.
4. Active users can refresh the dashboard, open it from marketing, and skip auth forms.
5. Sign out, expiry, or revocation removes access. A subsequent protected request goes to sign in. A service lookup failure is an error, not permission to render the page.

### Layout and rendering

Keep one root `app/layout.tsx`. Put ClerkProvider inside the body and preserve the existing provider tree and font setup. Integrate `@clerk/ui`'s shadcn theme and its CSS with the current tokens. Let the existing theme provider continue controlling light and dark mode.

Keep the home page's existing starter composition rather than redesigning the marketing site. Replace its sample button with the selected navigation controls. Use the Button component's Base UI link composition, avoiding a nested button inside an anchor.

The auth group uses a shared layout containing a home link followed by one centered form area. Each auth page renders only its matching Clerk component, with the alternate flow link configured through Clerk. Keep the current fonts, teal primary color, neutral background, and rounded control style. Add no images, icons, external assets, new branding, hero sections, or promotional copy.

The dashboard uses a compact responsive column with the heading and account menu first, Welcome and primary email next, and a home link last. No sidebar or other sections are required.

Use Suspense (a loading boundary) around request dependent auth controls and catch all Clerk components. Use a dashboard loading boundary that reveals no user information. Do not enable Cache Components or change unrelated Next.js settings. Do not store session dependent HTML or identity reads in a shared cache.

### Security and failure behavior

Verify access on the server inside the dashboard page before reading or rendering the current user's email. A layout guard or hidden button is not sufficient. Use the default Node.js runtime and the SDK's supported proxy matcher, excluding framework internals and static files. Never copy a session into local storage or implement token verification manually.

Use the current session only, with no user ID input. Keep the secret key server only. Do not log raw Clerk responses, emails, credentials, session tokens, or environment values. Let Clerk retain responsibility for its configured authentication protections and abuse controls. No new public mutation endpoint or application rate limiter is needed.

Clerk handles form loading, invalid credentials, verification, account recovery, duplicate accounts, and social provider failures. The app must not replace those failures with a successful redirect. Wrap dashboard server lookup failures with `app/(app)/dashboard/error.tsx`, showing only the generic error text and a Try again button using the Next.js reset callback. Do not catch redirect control flow as a service error. If Clerk has no current user after the session check, require sign in rather than rendering partial identity data.

Suspense fallbacks show Loading… with an accessible status. Auth and dashboard metadata set `robots` to `{ index: false, follow: false }`. Preserve existing public page metadata; this is not an SEO redesign. No new telemetry service, user tracking, or infrastructure is added.

### Configuration and existing app setup

During implementation, you authenticate to Clerk in your own terminal if needed. List existing apps through the CLI, show their names and IDs, and wait for your explicit selection. Use `link --app <selected_application_id>` and pull development configuration only for that selected app. Never select an app automatically, run `clerk init`, provision through Marketplace, create an accountless app, or overwrite working credentials without confirmation. Never read claim files or print environment files. If an existing claim file or conflicting link is discovered, pause for your decision.

| Setting | Purpose and source |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Selected existing app's client configuration, supplied through Clerk CLI |
| `CLERK_SECRET_KEY` | Selected existing app's server credential, supplied through Clerk CLI and never exposed to the client |
| Sign in URL | `/sign-in`, explicit ClerkProvider configuration |
| Sign up URL | `/sign-up`, explicit ClerkProvider configuration |
| Sign in and sign up force redirect | `/dashboard` for both flows, explicit ClerkProvider configuration |
| Sign out destination | `/`, explicit supported Clerk provider or account menu configuration |

Keep nonsecret route settings explicit in code, not implicit CLI defaults. Use the installed SDK's supported configuration names. Existing environment redirect settings must not silently override the chosen policy. CLI verification reports status and missing setting names only, never values. Do not alter the Clerk app's methods, production instance, allowed domains, or deployment settings in this slice.

### Critical test scenarios

1. Visit `/`, confirm it resolves from the marketing group, and check existing theme and providers, verifies **AC-1**, **AC-9**.
2. Follow Get started to `/sign-up`, switch to sign in, and exercise Clerk's configured verification or callback steps, verifies **AC-2**, **AC-3**.
3. Finish both auth flows and attempt an alternate return destination, each must end at `/dashboard`, verifies **AC-4**.
4. Refresh an authenticated dashboard and inspect only the current user's primary email. Test the absent email fallback, verifies **AC-5**, **AC-6**.
5. Request `/dashboard` without a session, with an expired session, and after sign out. No protected data may appear, even if streaming makes the HTTP response status differ from a simple redirect, verifies **AC-5**, **AC-7**.
6. While signed in, visit home and both auth routes. Check the home menu and dashboard link and the auth route redirects, verifies **AC-2**, **AC-4**.
7. Sign out from each account menu and confirm `/` and subsequent dashboard denial, verifies **AC-7**.
8. Confirm setup targets the selected existing app, with no new identity resources or credential changes beyond the approved pull. Obtain permission before creating any test users in this existing app, verifies **AC-8**.
9. Exercise invalid form input, delayed auth state, failed dashboard lookup, retry, small screens, keyboard focus, and robots metadata, verifies **AC-3**, **AC-9**.

## Build plan

1. Select and link the existing Clerk app through the approved CLI flow. Install compatible Clerk packages with pnpm and run Clerk diagnostics without exposing secrets. This is a prerequisite, not permission to provision a new service. Satisfies **AC-8**.
2. Prove the first complete thread: preserve the root providers while adding ClerkProvider and bare proxy, move home into `(marketing)`, connect Get started, add the standard sign up screen, and protect a minimal dashboard showing the current primary email. Check the real sign up to dashboard flow with permission for any new account. Satisfies **AC-1**, **AC-2**, **AC-3**, **AC-5**, **AC-6**, **AC-8**.
3. Complete returning user behavior: add sign in and cross links, enforce both fixed auth destinations, redirect active users away from auth forms, and add the signed in home controls and both account menus. Check refresh and sign out through the real Clerk session. Satisfies **AC-2**, **AC-3**, **AC-4**, **AC-5**, **AC-6**, **AC-7**.
4. Apply the shared auth layout and theme, loading boundaries, missing email fallback, safe dashboard error and retry, and indexing metadata. Check expired sessions and service failures without bypassing the guard. Satisfies **AC-5**, **AC-6**, **AC-9**.
5. Run lint, typecheck, and production build. Verify every critical scenario through suitable automated tests or a recorded manual check, clearly marking anything blocked by account access. Do not claim real authentication has passed from route rendering alone. Satisfies **AC-1** through **AC-9**.

## Consequences

**Positive**: Your existing Clerk accounts and policies remain the single identity source. Route groups separate marketing, authentication, and private app screens without changing public URLs. The feature proves a real protected flow without a database migration.

**Negative / tradeoffs**: Auth and account UI depend on Clerk. Dashboard email lookup adds a service dependency. All successful auth flows go to one destination, so future deep links need a later redirect policy. The dashboard intentionally provides no product functionality yet.

**Neutral**: Existing app selection and local CLI login may require your input during the build. Production configuration and deployment verification remain separate work. This spec does not authorize changes to your production Clerk instance or a Vercel deployment.

## Follow-up

1. Optionally enroll this feature in scope tracking. No scope file exists, and this design step does not create one automatically.
2. Capture the installed `clerk` conventions in `app/AGENTS.md` for shared app auth usage.
3. Capture the existing app safety rules from `clerk-setup` in `app/AGENTS.md`.
4. Capture resource level protection and Suspense rules from `clerk-nextjs-patterns` in `app/AGENTS.md`, with a short root pointer for `proxy.ts`. These context edits belong to a later context update, not this spec change.
5. Additional skill or MCP discovery was deferred at your request. The installed Clerk guidance is sufficient for this feature.
6. Before a production launch, verify production Clerk configuration and deployment environment separately. No production credentials or instance settings are changed here.
