# Full animation, more hearts, and a smaller No dodge

Revision prepared on October 26, 2026 (Asia/Singapore). Updates the existing `codex/romantic-redesign` branch and draft PR #3 against `codex/phase1-foundation`; no merge or deployment is included.

## Viewing every effect

The old page followed `prefers-reduced-motion` and disabled its motion button when that preference was reported. That made the full experience inaccessible from inside the page.

The top-right control now offers **Full animation**, **Gentle motion**, and **Pause animations**. The browser/device preference chooses the initial mode, but the control is always usable. Selecting **Full animation** explicitly overrides the reduced-motion CSS and JavaScript checks for this page. The device's actual accessibility setting is unchanged. An initial Gentle-mode note explains the reason and points to Full animation. Manual selection is preserved across stages and device-preference changes in the current tab; refreshing follows the device preference again. No setting or answer is stored persistently.

Download [invitation-preview.zip](docs/invitation-preview.zip), extract it and open **preview.html**. **Choose Full animation at the top right before opening the envelope.** Replace any older downloaded preview. There is no installation or internet dependency after downloading.

## Small details changed

- **No stays nearby.** It remains in the original button slot and moves only a small distance: candidate offsets are 0–28px horizontally and 4–24px upward, with maximum home distance under 30px. Each activation selects another nearby position, avoiding cumulative drift, Yes, essential text and viewport edges. CSS zoom is accounted for. Pointer, touch and keyboard activation remain playful; only Yes advances. Escape restores the starting position.
- **A full-screen heart field.** A fixed pool of 96 original SVG hearts is distributed across desktop and mobile grids with varied size, placement, delay, direction, tint and opacity. Eight small flower/star charms remain. Heart glow uses a static soft shadow with animated opacity; it avoids animating 96 blur/filter effects every frame. No particle interval or expanding element list is added.
- **Polished motion.** Slow ambient light, a brief current-progress-heart pulse, a tiny affirmative-button heart response, a clearer selected check and a soft focused-field halo add detail. Existing letter opening, wax-heart glow, sticker motion, idle choices, selection accents and heart-of-hearts celebrations remain available in Full mode.
- **Readable controls.** The motion selector is a native labeled control with keyboard/touch support, a visible focus state and a 44px target. The No helper is slightly larger, its joke captions describe a tiny nearby escape, and Escape retains keyboard focus. Hidden device-preference text is removed from the selector’s accessible description when it no longer applies. The question starts hidden until its letter is opened, avoiding a loading flash of two stages.

Gentle mode removes decorative animation and transitions. Pause stops animation without removing the controls. Hidden-tab cleanup and idle cancellation remain active in every mode. Mock-only transport, all 34 Manila dates, four activities, both exact romantic messages and the actual-choice summary are retained.

## Verification and actual captures

`npm test`: **30 passed**. Browser verification includes explicit Full animation under an emulated reduced-motion device, returning to Gentle/Pause, preference changes, bounded background counts, nearby No distance, keyboard/touch, six widths, zoom, the whole mock journey and disconnected standalone behavior. **The full 27-check browser suite passed in 246.627 seconds, Chromium 154.0.8037.57. Following the final readability/focus/accessible-description refinements, the three affected checks passed again in 54.767 seconds and all 20 screenshots were recaptured. The standalone offline journey was also rerun with the browser requesting reduced motion, explicitly selecting Full animation, then disconnecting networking; it passed.**

Actual current screenshots are in [docs/previews/full-animation/](docs/previews/full-animation/). Their browser contexts explicitly request reduced motion, then select Full animation before capturing the experience. The Gentle-mode images show the explanatory control; the remaining captures show the complete effects. This demonstrates the actual override rather than assuming a device has normal motion settings. Desktop/mobile captures are browser renders with a fixed October 25, 2026 test clock and synthetic choices.

The standalone export embeds all fonts, scripts, styles, illustrations and licenses. **CSS/HTML/ZIP SHA-256 hashes matched after regeneration, and ZIP content exactly matches the current HTML. `git diff --check` passed.** Real Safari/Firefox/phones and a full screen-reader audit remain unverified. The environment blocks direct `file://` testing, so the exact standalone is exercised over local HTTP with networking disconnected. No live service or answer delivery is added.
