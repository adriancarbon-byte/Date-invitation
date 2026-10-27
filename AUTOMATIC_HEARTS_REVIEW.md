# Automatic full effects and a clearly visible flowing heart background

Prepared October 26, 2026 (Asia/Singapore), on the existing `codex/romantic-redesign` branch and draft PR #3 against `codex/phase1-foundation`. No merge, deployment, Pages enablement or live submission is included.

## Requested behavior

The animation selector, its explanation and all alternate animation options are removed. Full effects run immediately by default, including when the device reports reduced motion, as explicitly requested by the user. There is no menu, hidden mode switch, stored preference or device-setting mutation. Opening the downloaded file is enough to see the complete experience.

The background is now much more visible:

- **240 small hearts in a fixed pool:** 160 drift across an even field and 80 flow upward through the whole viewport.
- **Clearer color and stronger glow:** warmer rose/champagne tones, stronger opacity, bright filled cores, clearer outlines and a soft two-stage shadow. Inner glow pulses through opacity/scale; the shadows remain static to avoid animating hundreds of filters every frame.
- **Continuous movement:** upward hearts follow gently swaying paths on 20–36-second cycles. Negative delays populate the whole screen immediately. Field hearts drift on 8–13-second alternating cycles; inner glow takes 3.2–5.6 seconds. No flash or strobe is added.
- **Responsive coverage:** desktop/mobile positions differ so the portrait background stays filled. The background is fixed to the viewport while scrolling. Hearts remain behind the invitation and opaque interaction/note cards, with slightly quieter central placement and a small text halo preserving readability.

The large letter/heart celebrations, wax seal, stickers, small No dodge, idle choices, exact messages, 34 approved Manila dates and full mock journey remain. Normal browser navigation/exit is preserved. The background pauses when the tab is hidden, transient effects are cleared, and timers/elements do not accumulate. There is no manual animation option, per the latest request.

## Open the current preview

Download [invitation-preview.zip](docs/invitation-preview.zip), extract it and open **preview.html**. Replace the older preview rather than reopening it. No animation setting needs to be selected. The exact standalone includes all code, styles, fonts, original illustrations and licenses, and works offline after downloading.

The 20 current actual desktop/mobile renders, including bottom-of-ending viewport captures, are in [docs/previews/automatic-hearts/](docs/previews/automatic-hearts/). Browser contexts report reduced motion, demonstrating that full effects start automatically with the controls absent. Captures use synthetic choices and a fixed October 25, 2026 test clock, not recipient responses.

## Verification

- `npm test`: **30 passed**.
- Browser checks cover automatic motion without options, preference changes/refresh, visible heart opacity/count, actual upward movement, hidden-tab pause/cleanup, full mock journey, local copy, dates/messages, small No behavior, keyboard/touch, six widths, zoom and disconnected standalone use. **All 27 distinct browser checks passed across the verification runs. The initial full run passed 25/27 and exposed a 2.5px rotating-sticker overflow at 320px and an SVG reload/CSP error during the visibility test. After bounding the sticker, avoiding repeated summary-image assignments and restoring the native visibility property in the test, all four affected/expanded checks passed in 123.716 seconds. This included all six responsive widths/zoom, hidden-tab lifecycle, actual upward movement plus full journey/bottom scroll, and all screenshots. Chromium version: 154.0.8037.57.**
- Actual renders were reviewed against the user's screenshot: the upper-right menu is gone; the field is visibly denser/brighter across desktop/mobile; and the form and original note remain readable.
- **CSS/HTML/ZIP SHA-256 values matched after regeneration; ZIP content equals the exact current HTML. `git diff --check` passed.**

This is Chromium desktop/mobile emulation, not real-device/Safari/Firefox or full screen-reader certification. Direct `file://` testing remains blocked by environment policy, so the exact standalone is exercised over local HTTP with networking disconnected. No live service or answer delivery is added.
