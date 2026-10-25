# Publish without a ChatGPT address

The user supplied screenshots of the live Netlify project `openthisforme18` and a failed sending request. The matching Netlify-template repository is `adriancarbon-byte/Date-invitation-c8933`, whose `main` matched the prepared migration commit. The original repository retains its `codex/romantic-redesign` branch. See the repair section below; new live delivery is not verified from this workspace.

## Deploy from the prepared branch

[Deploy this invitation to Netlify](https://app.netlify.com/start/deploy?repository=https%3A%2F%2Fgithub.com%2Fadriancarbon-byte%2FDate-invitation&branch=codex%2Fromantic-redesign&fullConfiguration=true)

1. Sign in to Netlify and authorize GitHub if prompted. The link selects `codex/romantic-redesign`; main is historical and must not be selected for this build. The template flow creates a repository in your GitHub account for the Netlify project.
2. Enter your verified Web3Forms key in the prompted `WEB3FORMS_ACCESS_KEY` field. Use the key already provided for receiving plans; do not use a Gmail password. The value belongs in Netlify's environment settings, never a public file.
3. Choose a project name such as **just-for-christine**, subject to availability. If the flow assigns a random name, change it under Project configuration → General → Project details → Project name. The resulting site address ends in **.netlify.app**.
4. Deploy. The checked-in `netlify.toml` supplies the build command, publish folder and function directory. No installation is needed on your computer.
5. Open the URL returned by Netlify and complete the invitation. Actual email receipt is verified only after a real Send our plan action; check Inbox and Spam. No synthetic email has been sent by development checks.

If importing the existing GitHub repository instead of using the template link, choose **codex/romantic-redesign** as the production branch, retain the settings from `netlify.toml`, and add `WEB3FORMS_ACCESS_KEY` as a private environment variable available to **Functions**, then deploy. Netlify's template prompt handles this when using the link above.

## What moves

- The same full animation, envelope, calendar, scrolling time wheels, foods, activities, notes and explicit Send our plan action.
- `dist/index.html` embeds all fonts, illustrations, CSS and JavaScript. It connects to same-origin `/api/invitations` and `https://api.web3forms.com/submit`; no ChatGPT URL is present in the public page.
- `netlify/functions/invitations.mjs` validates and prepares the payload at that path; the browser then submits directly to Web3Forms. `WEB3FORMS_ACCESS_KEY` is read at function runtime and returned as a public submit-only form key. Nothing is sent during build, review or ordinary navigation.
- Missing configuration, invalid choices and provider failures still cannot produce a false success. No answer database or public response dashboard is introduced.

## Local checks and limits

`npm run build:netlify` compiles CSS, regenerates the embedded page and creates the public `dist/` files. `npm test` exercises the shared server relay and Netlify adapter without a real email. The deployment adapter uses Netlify's standard Request/Response function API with an explicit `/api/invitations` preparation path.

A new `netlify.app` URL cannot be claimed until an authenticated Netlify deployment succeeds. No connected Netlify account or token is available in this workspace, and the executor's current network policy does not permit Netlify API access. The sign-in/deploy link above lets the account owner publish through Netlify directly without exposing a management token here.

Official references: [Deploy to Netlify and branch/template configuration](https://docs.netlify.com/deploy/create-deploys/) · [Functions configuration](https://docs.netlify.com/build/functions/configuration/).

Prepared migration verification: `npm run build:netlify` succeeded; all **36 Node tests** passed; the packaged page completed a touch-phone Chromium journey at 390px, with explicit intercepted API submission and no page errors or horizontal overflow. The published folder contains only `index.html` and `_headers`; the page contains neither a ChatGPT hostname nor the supplied receiving key. This confirms local migration readiness, not a Netlify account deployment or real email receipt.

## Netlify 502 repair — 2026-10-26

The user confirmed GitHub-connected hosting and a runtime key configured for all
scopes/contexts, then supplied a browser capture showing `/api/invitations` 502.
The previous Netlify adapter proxied the email from its server. Web3Forms documents
that standard submissions must originate in the browser; server-side requests can
be blocked unless an eligible paid account and server-IP safelist are configured.
This is an integration defect consistent with the observed 502. The actual upstream
response was not available, so key/account/domain restrictions remain possible too.

The repaired Netlify flow keeps the existing runtime variable. After the explicit
Send button, `/api/invitations` validates the request and returns a normalized
payload with the **public, submit-only form access key**, marked `Cache-Control:
no-store`. The browser POSTs directly to the fixed Web3Forms endpoint and shows
success only after both HTTP success and `success: true`. It never automatically
retries or falls back to a second delivery route. Choices survive failure.

The hosted page CSP permits exactly the same origin and `https://api.web3forms.com`
for connections. The offline export remains network-disabled. The key is absent
from Git source and build files but visible in the browser network request, as
required by the provider's documented client integration. This is not a management
API credential. Recipient addresses remain configured through Web3Forms.

Redeploy the updated GitHub source branch to activate the repair. If Web3Forms then
returns a rejection, check the form's activation, domain/account restrictions or
rate limits; do not repeat submissions rapidly. The previous Sites Worker adapter
is retained for compatibility and is not republished by this Netlify repair.

Provider references:
- https://docs.web3forms.com/getting-started/troubleshooting
- https://docs.web3forms.com/getting-started/api-reference
- https://docs.web3forms.com/getting-started/faq
