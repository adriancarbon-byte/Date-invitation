# Keeping the invitation online

The website runs on Netlify, not on the computer used to edit it. Logging out or
turning off the café computer does not stop hosting. All production source belongs
in GitHub; no café-computer installation is needed.

## Where things live

- Public invitation: https://openthisforme18.netlify.app/
- Netlify project: `openthisforme18`.
- Production repository: `adriancarbon-byte/Date-invitation-c8933`, branch `main`.
- Original source: `adriancarbon-byte/Date-invitation`, branch `codex/romantic-redesign`.
- Production settings: `netlify.toml`; build runs tests, compiles CSS, exports the
  page and verifies its script hashes, headers, provider connection and assets.
- The `WEB3FORMS_ACCESS_KEY` setting is needed in Netlify Functions for Production.
  It is a public form submission key, not a private account/management credential.
  Keep it out of Git; the browser receives it only when preparing a valid send.
- Receiving inbox and delivery account settings belong to Web3Forms. The site does
  not contain a Gmail password, receiving address, private answer database or login.

## What is protected

Requests must use same-origin JSON, known dates/times/choices and a bounded body.
Cross-site browser requests and extra fields are rejected. Reading request bodies
and waiting for delivery have time limits. The recipient and email subject cannot
be selected by the visitor. Success needs a provider receipt. Answers stay in
memory, not browser storage, URLs, public GitHub files or application logs.

The served page uses script hashes, a restricted connection list, frame protection,
no-referrer and noindex directives. These reduce injection, embedding and indexing
risks. They are not login protection: anyone holding the public link can open it.
Origin validation is a browser boundary, not proof of the sender's identity. Public
form keys can be reused by other clients; provider spam controls still apply.
Real private access requires an authenticated hosting layer, not a frontend password.

## After a code update

Open Netlify → Deploys. Confirm the intended commit is **Published** before testing
the invitation. If automatic builds are paused, use Trigger deploy. A failed build
should leave the previous successful production deploy in place. No email is sent
by the build or automated tests. Confirm a genuine submitted plan in the receiving
inbox (including Spam); provider acceptance does not prove inbox arrival.

## If sending fails

Choices remain editable in the same tab. Keep that tab open until the send finishes.
Do not repeatedly click after an uncertain timeout: the first email may have arrived.
The app prevents concurrent clicks but cannot guarantee exactly-once delivery across
tabs or refreshed sessions. There is no silent automatic retry.

Check Netlify's deployment first, then whether its `invitations` function exists and
the runtime variable is scoped to Production Functions. A 400 preparation response
means invalid/expired choices, 403 means a request-origin restriction, 408 means a
stalled body, 413 means oversized input and 503 means missing runtime configuration.
The browser's final request goes to `https://api.web3forms.com/submit`.
Provider rejection, quota/rate limits, activation and domain restrictions must be
resolved in the provider account. Never paste keys or actual request payloads into
public issues or logs.

## Recovery from a bad release

In Netlify → Deploys, open the last known good production deploy and use its publish
or restore action. Then repair the source in GitHub before releasing again. If an
older deploy uses the former server relay, restoring it may restore its email bug;
choose a version that has verified real delivery. Git history preserves each change.
Runtime environment changes need their own correction and redeployment; reverting
source does not restore an earlier environment variable.

## Limits to plan for

Netlify and Web3Forms availability, account status, quotas, network connectivity and
spam filtering are external dependencies. The account owner should retain account
recovery access and enable two-factor authentication. Sign out of GitHub, Netlify,
email and ChatGPT when leaving a shared computer; do not save passwords there.

Only October 28–31 and November 1–30, 2026 are approved, using Asia/Manila. After
November 30, the invitation intentionally stops accepting new plans until new dates
are approved in source. This is expiration, not a server crash. Refreshing discards
an unsent draft; no private answers are left in persistent storage on café computers.
