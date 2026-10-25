# Floating hearts and typography revision

Latest revision: [CLIENT_REVISION.md](CLIENT_REVISION.md) supersedes the earlier dates, two-Yes buttons and initial screen described below.

This follow-up updates the same `codex/romantic-redesign` branch and draft PR #3, targeting `codex/phase1-foundation`. It does not merge, deploy, enable Pages or send anything.

## Requested changes

- Removed the **Not now** button and its unused decline state. The opening has exactly **Yes!** and **Yes, of course!**.
- Removed the visible “a little invitation.” branding, header/divider and the “Just a preview. Your choices stay in this tab.” notice.
- Paired locally bundled Cormorant Garamond headings with DM Sans body/control text and Allura handwritten accents. All font files and licenses are included offline.
- Refined the opening's spacing, deliberate two-line question, rose buttons, illustrated letter glow and handwritten signoff. Progress appears from the celebration onward, keeping the opening focused.
- Added 22 small rose/champagne hearts floating and softly glowing behind the page. A small **Pause hearts** control stops the decoration; reduced-motion users receive static decoration and no bursts.
- Either affirmative choice triggers a 64-piece heart-of-hearts animation from the chosen button. It forms a heart, then spreads and fades. Selection accents use ten small hearts; calendar/card/time feedback stays responsive without waiting for animation.
- Kept the ending's heart flourish above the keepsake summary so selected values and the exact note stay readable.

The exact question, approved date set/Manila validation, four activities, configurable provisional food/time, history, selection retention, copy action and full mock journey are preserved. The final view still states clearly that nothing was sent or booked.

## Download and open

1. Download [invitation-preview.zip](docs/invitation-preview.zip) using GitHub's **Download raw file** button, or its raw download link.
2. Extract the ZIP.
3. Double-click **preview.html**.

The ZIP contains one file, identical to [docs/preview.html](docs/preview.html), with no installation or connection needed after downloading. Replace an older downloaded preview to see these changes. `npm run preview:export` regenerates the HTML; `npm run preview:download` packages the ZIP using Python 3.

## Verification

- `npm test`: **28 passed**.
- `npm run test:browser`: **20 passed** in 133.449 seconds, Chromium 154.0.8037.57.
- After a final heading/heart-placement refinement, the four affected browser checks were rerun: screenshots, font/motion lifecycle, disconnected standalone journey, and all six responsive widths/reduced motion/200% zoom. **All four passed** in 64.164 seconds; all 14 screenshots were recaptured after this refinement.
- CSS build, standalone export and ZIP packaging passed. The ZIP contains exactly the exported HTML; **SHA-256 was identical for CSS, standalone HTML and ZIP after regenerating all three.**
- Browser checks cover the two-button opening/removals, all three loaded font families, fixed heart count, pause state, burst cleanup, selection cleanup, reduced motion, full journey/history, calendar validation, local clipboard and offline behavior. No external requests, missing assets or runtime errors were observed in tested flows.

Actual current desktop/mobile screenshots for all seven stages are in [docs/previews/heart-refresh/](docs/previews/heart-refresh/). The celebration captures show the real heart animation during its formed-heart phase; the rest are actual page captures. Desktop viewport is 1440 × 1000; mobile is 390 × 844 touch emulation, with full-page capture for longer views. A fixed October 25, 2026 clock and synthetic choices keep evidence reproducible. This is not physical-device certification.

The historical Phase 2A review and captures remain available in [PHASE2A_REVIEW.md](PHASE2A_REVIEW.md). Direct `file://` opening remains blocked by environment browser policy, so the exact standalone was exercised over local HTTP with networking disconnected. Real Safari/Firefox/phones and a full screen-reader audit remain outside completed coverage. No live delivery was added or tested.
