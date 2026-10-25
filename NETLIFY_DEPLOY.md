# Publish without a ChatGPT address

Migration status: source and configuration prepared; no Netlify deployment or replacement live URL has been verified. The existing live invitation remains available while the replacement is set up. Do not disable it until the new URL is working.

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
- `dist/index.html` embeds all fonts, illustrations, CSS and JavaScript. It connects only to the same-origin `/api/invitations`; no ChatGPT URL is present in the public page.
- `netlify/functions/invitations.mjs` exposes that path and reuses the existing private, validated email relay. `WEB3FORMS_ACCESS_KEY` is read only at function runtime. Nothing is sent during build, review or ordinary navigation.
- Missing configuration, invalid choices and provider failures still cannot produce a false success. No answer database or public response dashboard is introduced.

## Local checks and limits

`npm run build:netlify` compiles CSS, regenerates the embedded page and creates the public `dist/` files. `npm test` exercises the shared server relay and Netlify adapter without a real email. The deployment adapter uses Netlify's standard Request/Response function API with an explicit `/api/invitations` path.

A new `netlify.app` URL cannot be claimed until an authenticated Netlify deployment succeeds. No connected Netlify account or token is available in this workspace, and the executor's current network policy does not permit Netlify API access. The sign-in/deploy link above lets the account owner publish through Netlify directly without exposing a management token here.

Official references: [Deploy to Netlify and branch/template configuration](https://docs.netlify.com/deploy/create-deploys/) · [Functions configuration](https://docs.netlify.com/build/functions/configuration/).

Prepared migration verification: `npm run build:netlify` succeeded; all **36 Node tests** passed; the packaged page completed a touch-phone Chromium journey at 390px, with explicit intercepted API submission and no page errors or horizontal overflow. The published folder contains only `index.html` and `_headers`; the page contains neither a ChatGPT hostname nor the supplied receiving key. This confirms local migration readiness, not a Netlify account deployment or real email receipt.
