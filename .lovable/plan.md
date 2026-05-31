## Goal

Add a "Send feedback" button at the bottom of the page. Clicking it opens a dialog with a single text area (no name, no email, no PII). Submissions save to Lovable Cloud so you can read them later.

## What the user sees

- New footer area below the Cooking Pot panel with a pixel-styled "Send Feedback" button (matches the existing Core Keeper amber/cyan look).
- Click → modal dialog opens with:
  - Heading: "Got a suggestion?"
  - Short helper text: "Anonymous — please don't include personal info."
  - Multi-line textarea (10–1000 chars)
  - "Cancel" and "Submit" buttons
- On submit → toast "Thanks for the feedback!" and dialog closes.
- Errors (empty, too long, network) show inline + toast.

## What you (the dev) see

Two ways to read submissions:

1. **Lovable Cloud dashboard** — open the `feedback` table directly to browse rows sorted newest-first. This is the primary path (zero extra UI to build/secure).
2. **Optional in-app page** at `/admin/feedback` — a simple list view, gated by a hardcoded check against `import.meta.env.VITE_ADMIN_EMAIL` after a magic-link login. Skip unless you want it; the dashboard is enough for a tool this size.

I'll default to **option 1 only** to keep scope tight. Say the word if you'd like the admin page too.

## Backend (Lovable Cloud)

Enable Lovable Cloud, then create one table:

```text
feedback
  id          uuid primary key default gen_random_uuid()
  message     text not null  (length 10–1000, checked)
  created_at  timestamptz default now()
  user_agent  text           (optional, for spam triage)
```

RLS:
- **INSERT**: allowed for anyone (anon + authenticated). No PII columns exist, so anonymous writes are safe.
- **SELECT / UPDATE / DELETE**: no policies → only the service role (you, via the dashboard) can read.

Grants: `INSERT` to `anon` + `authenticated`; full access to `service_role`.

Anti-abuse (lightweight, no captcha):
- Client-side: zod validation (10–1000 chars, trim, reject if only whitespace).
- Submit button disabled while in-flight; 5-second cooldown after a successful submit stored in `localStorage` to discourage button-mashing.

## Frontend pieces

- `src/components/FeedbackButton.tsx` — button + dialog using existing shadcn `Dialog`, `Textarea`, `Button`, `toast`.
- Mount in `src/routes/__root.tsx` (or the home route's bottom) so it appears on every page in a footer strip.
- Zod schema lives next to the component.
- Insert via the browser supabase client (`@/integrations/supabase/client`) — no server function needed since the only operation is an anonymous insert governed by RLS.

## Testing (manual, 3 steps)

1. Open the preview → scroll to bottom → click **Send Feedback** → a dialog appears with one text box.
2. Type "Loving the cozy theme — could you add a dark/light toggle?" → click **Submit** → toast says "Thanks for the feedback!" and the dialog closes.
3. Open the Lovable Cloud dashboard → `feedback` table → your message is the newest row, with a timestamp.

## README update

After build, I'll update README.md with: new Feedback feature location, the `feedback` table schema, and the note that submissions are read via the Cloud dashboard (not in-app).

## Out of scope (ask if you want any)

- Admin page in the app to browse feedback
- Email notification when feedback arrives
- Captcha / hard rate limiting
- Voting / threading / replies
