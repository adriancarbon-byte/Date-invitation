# Client revision: a little letter, a playful No, and a romantic calendar

This revision updates `codex/romantic-redesign` and draft PR #3 against `codex/phase1-foundation`. No merge, deployment, Pages enablement, email or live submission is included.

## What changed

1. **A closed-letter entrance.** The website starts with a glowing, floating ivory envelope and the exact caption “Hey, I want you to open this for me.” Tapping/clicking it opens the flap, lifts the paper and reveals the invitation. The seal, halo, orbiting heart and envelope float independently. It is keyboard operable, repeated activation is guarded, and reduced motion opens immediately.
2. **Yes and a playful No.** The question now has exactly **Yes** and **No**. Activating No makes it move to a different bounded position with captions such as “Oops. That button has butterflies.” Only Yes advances or records acceptance. No never becomes a hidden affirmative action. Its position excludes Yes and essential text, focus is retained, Escape returns it to the original slot, and leaving the question restores the layout. Touch and keyboard activation work; reduced motion removes the travel transition. Browser exit/navigation remains normal.
3. **Calendar stickers.** Original bouquet and ribbon-heart stickers, the letter illustration and small sparkles surround the scheduling card. They adapt to mobile corners without blocking date/time controls. The old “A little day for us · highlighted dates only” legend is removed.
4. **October 30 and 31 enabled.** The user explicitly added these dates. The allowlist is now Oct 28–31 and Nov 1–30, 2026: **34 dates before past filtering**. Manila date/time validation remains centralized and rejects dates outside that set or in the past.
5. **A new bottom message.** The original exact romantic note remains. After the ending controls, the page now closes with exactly: “One thing is for sure, i like you so much my christine.” The copied local plan includes both messages.
6. **Idle motion and background details.** Eight small original flower/star charms join the 22 floating hearts. Choices float gently after 4.5 seconds of inactivity, then stop on pointer, keyboard or scroll activity. Pause/reduced motion and hidden-tab handling stop nonessential motion. Effects use fixed pools and bounded timers.

The local fonts, four mandatory activities, provisional time/food settings, state retention, browser history, reset, summary, copy action and mock-only submission boundary are preserved. Reset/refresh now begins at the sealed letter. There are seven stages when food is enabled, six when omitted.

## Preview and captures

Download [invitation-preview.zip](docs/invitation-preview.zip), extract it and open **preview.html**. Replace a previous downloaded copy to see this revision. The [single HTML](docs/preview.html) includes all styles, fonts, scripts, original illustrations and licenses. No installation or internet connection is needed after downloading.

Current actual browser captures are in [docs/previews/client-revision/](docs/previews/client-revision/): desktop and mobile views of the closed letter, question, No after dodging, celebration, open calendar, selected time, food, activity and ending. Captures use a fixed October 25, 2026 test clock and synthetic choices; the calendar/ending demonstrate October 31. Desktop is 1440 × 1000; mobile is 390 × 844 touch emulation; longer pages use full-page capture.

## Verification

- `npm test`: **30 passed** after the state/date changes.
- Browser verification covers the sealed letter/caption, keyboard opening, pointer/touch/keyboard No movement and bounds, Yes remaining available, idle start/stop/pause, all 34 dates, stickers, exact bottom note, full mock journey, history/reset, clipboard, six widths, reduced motion, 200% zoom and disconnected standalone use. **The complete 24-check browser suite passed in 217.824 seconds. After final caption-clearance/zoom/glow refinements, five targeted checks passed in 68.723 seconds, including the additional reduced-motion/No-bounds test across all six widths and 200% zoom. That is 25 distinct passing browser checks, using Chromium 154.0.8037.57.**
- The first rendered review found a missing literal space at the letter caption's line break; it was corrected so the actual DOM wording matches the supplied caption exactly. Final refinements keep No clear of the small question eyebrow and correctly scale its position at 200% page styling zoom, and add a soft pulse to the wax heart. All 18 screenshots were recaptured afterward.
- CSS build, single-file export and ZIP packaging are regenerated together. **CSS, HTML and ZIP SHA-256 hashes matched after regeneration; the ZIP contains exactly the current HTML. All 19 local SVGs parsed without scripts or external resources. `git diff --check` passed.**

No physical-device, real Safari/Firefox or full screen-reader certification is claimed. Direct `file://` testing is blocked by environment policy; offline verification uses the exact standalone over local HTTP with networking disconnected. No live answer delivery was added or tested; final food/time availability and accepted answer retrieval remain separate decisions.
