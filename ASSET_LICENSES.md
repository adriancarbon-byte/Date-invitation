# Asset and dependency notices

## Artwork and type

The original `assets/art/flower.svg` is retained from Phase 1. Phase 2A replaces the envelope illustration and adds a coordinated family of original local SVG artwork:

- Romantic stationery: `envelope.svg`, `celebration.svg`, `keepsake.svg`.
- Scheduling: `calendar.svg`, `clock.svg`.
- Provisional food choices: `pizza.svg`, `sushi.svg`, `burgers.svg`, `pasta.svg`, `tacos.svg`, `ramen.svg`.
- Required activities: `city-lights.svg`, `around-city.svg`, `movie-date.svg`, `arcade.svg`.

These fifteen illustrations were drawn directly as SVG paths for this project during Phase 2A. They share warm pastel gradients, rounded strokes, subtle shadows, and small heart or sparkle details. No image-generation output, emoji artwork, icon library, reference-video frame, third-party illustration, stock photo, or soundtrack was reused. Inline navigation, floating hearts, heart-shaped bursts and selection paths are simple project-created SVG interface graphics; no third-party particle artwork is used. SVGs contain no scripts, external resources, embedded fonts, or personal information. Artwork provenance does not imply final client approval of provisional food options.

Headings use locally bundled Cormorant Garamond Latin 500 regular and italic WOFF2 files, obtained from `@fontsource/cormorant-garamond@5.2.8` on npm. Cormorant is by Christian Thalmann and contributors, licensed under the SIL Open Font License 1.1; the full copyright and license are retained in `assets/art/CORMORANT-LICENSE.txt`. The unmodified font files are also embedded in the offline review document. No remote font service is used. Body text and controls now use locally bundled DM Sans Latin 400/600 from `@fontsource/dm-sans@5.2.8`; short handwritten accents use Allura Latin 400 from `@fontsource/allura@5.2.7`. Both are unmodified WOFF2 files licensed under SIL OFL 1.1, with complete notices in `assets/art/DM-SANS-LICENSE.txt` and `assets/art/ALLURA-LICENSE.txt`. All font licenses accompany the offline HTML and ZIP. System fallbacks remain available. Exact client-approved fonts and final image/music assets remain open. The repository has not selected an outbound project license; this notice does not select one.

`docs/previews/**/*.png` are actual Playwright/Chromium screenshots of this project's mock invitation, created for review. They contain no recipient identity, real submitted answer, or private conversation.

## Tailwind CSS

Tailwind CSS and its CLI are pinned to 4.3.3 as development dependencies. The browser receives compiled CSS, which retains its upstream license header. The package lock records build-tool dependencies; no node_modules files or native binaries are shipped as website assets.

Tailwind CSS license (from the installed package):

```text
MIT License

Copyright (c) Tailwind Labs, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
