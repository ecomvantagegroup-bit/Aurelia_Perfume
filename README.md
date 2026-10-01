# Aurelia Perfume — Interactive Luxury Experience

> **A cinematic luxury perfume experience combining scroll-driven image sequences, interactive 3D fragrance bottles, and editorial storytelling.**

> **Sample / demo project.** Aurelia is a fictional fragrance brand created as a portfolio showcase. The brand, copy, fragrance names, notes, links and imagery are sample content, and the site is not a real store.

---

## Overview

**Aurelia** is a premium single-page luxury perfume website created to demonstrate the **Launch + Interactive 3D** package.

The experience combines:

* Cinematic, scroll-driven image sequences (canvas)
* Interactive Three.js perfume bottles
* GSAP ScrollTrigger storytelling
* Atmospheric particle effects
* Premium editorial typography
* Dark luxury visual design
* Looping background ambience
* A fully data-driven setup (text, sequences, models and audio live in JSON)

Rather than rendering an entire environment in real time, Aurelia uses a **hybrid 2D + 3D architecture**.

```text
Cinematic Image Sequence
          +
Interactive 3D Product
          +
Editorial Typography
          +
Scroll Animation
          ↓
Premium Digital Fragrance Experience
```

---

## Project Information

| Item        | Details                                          |
| ----------- | ------------------------------------------------ |
| Project     | Aurelia Perfume                                  |
| Status      | Sample / demo (fictional brand)                  |
| Industry    | Luxury Product / Fragrance                       |
| Package     | Launch + Interactive 3D                          |
| Type        | Premium single-page experience                   |
| Framework   | Vue 3 (JSX components)                           |
| Language    | JavaScript                                       |
| Build tool  | Vite 7                                           |
| Styling     | Tailwind CSS 4                                   |
| Animation   | GSAP + ScrollTrigger                             |
| 3D          | three.js (GLTF + Draco)                          |
| Rendering   | Hybrid 2D + 3D                                   |
| Hosting     | Cloudflare Pages                                 |

---

## Design Philosophy

Aurelia follows a **dark luxury + cinematic editorial** design language: elegant, minimal, sophisticated, atmospheric and restrained. It should feel like a perfume campaign you can interact with, not a technology demo, an ecommerce template or an over-animated WebGL experiment.

> **Make the experience feel expensive, not technically complicated.**

### Visual hierarchy

```text
Image Sequence       50%
3D Product           30%
Typography           15%
Effects               5%
```

The image sequence creates the world, the 3D bottle creates interaction, typography tells the story, and effects add atmosphere. Nothing should compete unnecessarily with the perfume.

### Colour system

```text
Background      #0B0B0B
Surface         #151515
Primary text    #F8F8F8
Muted text      #999999
Luxury gold     #C8A96A
Forest          #304B3B
Ocean           #254B61
Amber           #9A5B24
```

Forest, ocean and amber colours appear primarily inside their own scenes rather than changing the whole site theme.

### Typography

* **Display** (hero, fragrance names, editorial statements): serif — Cormorant Garamond
* **UI** (navigation, buttons, labels, notes, footer): sans / mono — Inter

Large, elegant, high-contrast headlines with generous letter-spacing; supporting text stays minimal.

### Motion

Slow, intentional, smooth, organic, cinematic. The site should feel like one continuous visual journey, not a collection of animation demos.

---

## Experience Flow

```text
PRELOADER → HERO → FOREST ESSENCE → FRAGRANCE NOTES → OCEAN BLOOM
          → AURELIA STORY → GOLDEN AMBER → THE COLLECTION → FINAL CTA → FOOTER
```

| #  | Section          | Element id        | Pinned scroll length | 3D bottle        | Particles          |
| -- | ---------------- | ----------------- | -------------------- | ---------------- | ------------------ |
| —  | Hero             | `sec-hero`        | not pinned           | procedural hero  | —                  |
| 01 | Forest Essence   | `sec-forest`      | +200%                | forest           | fireflies          |
| 04 | Fragrance Notes  | `sec-notes`       | +180%                | forest (shared)  | fireflies          |
| 05 | Ocean Bloom      | `sec-ocean`       | +150%                | ocean            | mist               |
| 06 | Aurelia Story    | `sec-story`       | +150%                | amber (shared)   | —                  |
| 07 | Golden Amber     | `sec-amber`       | +150%                | amber            | sand / golden dust |
| 08 | The Collection   | `sec-collection`  | +180%                | all three        | —                  |
| 09 | Final CTA        | `sec-cta`         | +150%                | none             | —                  |
| —  | Footer           | `sec-footer`      | not pinned           | none             | —                  |

Sections that share a bottle (Forest + Notes, Story + Amber) keep the same model on screen instead of replaying its entrance.

### Section notes

* **Hero** — logo, tagline and call to action over a slow-rotating signature bottle.
* **Forest Essence** — fresh / botanical / earthy; frosted green bottle.
* **Fragrance Notes** — editorial top / heart / base pyramid for Forest Essence.
* **Ocean Bloom** — aquatic / mineral / fresh; blue crystal bottle; note cards are built into this section.
* **Aurelia Story** — a typographic breathing point between Ocean and Amber.
* **Golden Amber** — warm / sensual / rich; the visual climax.
* **The Collection** — the three bottles side by side with hover highlight; the bottles are positioned and sized to fit each card.
* **Final CTA** — large typography reveal with a magnetic button.
* **Footer** — minimal luxury footer with navigation, social and legal links.

---

## How It Works

### Three stacked layers

```text
z-30  Content layer            HTML sections (text, cards, buttons)
z-20  Interactive 3D layer     one persistent three.js canvas
z-0   Background layer         canvas drawing the image sequence frames
      + Preloader / Navbar / Sound button overlays
```

### Scroll → frames

1. `content_layer.jsx` creates one **master ScrollTrigger** spanning every sequence section (Forest → CTA).
2. As it scrubs, it dispatches a `global-sequence-progress` event with a 0–1 progress value.
3. `BackgroundLayerController.jsx` maps that progress onto the combined frame list and eases toward the target frame (lerp) before drawing it to the canvas.
4. All frames of all sequences form one continuous timeline, in the order listed in `sequences.json`.

### Scroll → active section → 3D bottle

1. `App.jsx` creates a ScrollTrigger per section and tracks the **active section**.
2. `Interactive3DLayer.jsx` watches the active section and runs a GSAP timeline: outgoing bottle slides out, incoming bottle scales in, and lighting, fog, exposure and particles crossfade.
3. Each bottle has a **minimum dwell time** (about 2.2 s) so fast scrolling cannot cut a fragrance's moment short; only the latest requested section is honoured.
4. In the Collection, bottles are positioned and scaled every frame from their card elements, because that section is pinned and scrubbed.

### Mouse interaction

Mouse movement subtly tilts the active bottle. Hovering a bottle in the Collection scales it up and lights it with a spotlight.

### 3D rendering

* One persistent `WebGLRenderer` (transparent canvas, ACES tone mapping, pixel ratio capped at 1.5).
* GLB models are normalised to a common height, and glass parts are upgraded to physically-based transmissive glass while keeping label textures and UVs.
* Lighting: ambient + key + fill + rim lights, a procedurally generated studio environment map for reflections, and per-section colour, fog and exposure.
* If a model fails to load, a procedural fallback bottle is used so the site never breaks.

---

## Data-Driven Configuration

Nothing about sequences, models or copy is hard-coded in the components. Everything is read from JSON in `public/data/` before it is used.

| File                       | Controls                                                              |
| -------------------------- | --------------------------------------------------------------------- |
| `public/data/content.json`   | All section text, labels, note pyramids and footer links            |
| `public/data/sequences.json` | Image sequence folders, frame counts (mobile / desktop), file naming |
| `public/data/models.json`    | GLB model paths and the Draco decoder path                          |
| `public/data/audio.json`     | Background sound file, volume, loop and fade times                  |

### Base-aware paths

Every asset path is resolved through `assetUrl()` in `src/utils/dataLoader.js`, which prefixes Vite's `BASE_URL`. This keeps every path correct whatever base the site is served from (set in `vite.config.js`, currently `/`).

**Rule: write paths without a leading `./` or `/`.**

```text
forest_essence/mobile      ✅
models/forest_bottle.glb   ✅
/forest_essence/mobile     ❌
./models/forest_bottle.glb ❌
```

### `sequences.json`

```json
{
  "mobileMaxWidth": 768,
  "extension": "webp",
  "padLength": 4,
  "startIndex": 1,
  "sequences": [
    {
      "key": "forest",
      "frames":  { "mobile": 120, "desktop": 250 },
      "folders": { "mobile": "forest_essence/mobile", "desktop": "forest_essence/laptop_and_desktop" }
    }
  ]
}
```

The order of the `sequences` array is the order of the scroll timeline. Frame totals are calculated from this file (currently 1,854 frames on desktop and 840 on mobile).

### `models.json`

```json
{
  "dracoDecoderPath": "https://www.gstatic.com/draco/versioned/decoders/1.5.6/",
  "models": [
    { "key": "forest", "path": "models/forest_bottle.glb" },
    { "key": "ocean",  "path": "models/ocean_bottle.glb" },
    { "key": "amber",  "path": "models/amber_bottle.glb" }
  ]
}
```

To host the Draco decoder yourself, copy `node_modules/three/examples/jsm/libs/draco/` to `public/draco/` and set `"dracoDecoderPath": "draco/"`.

### `audio.json`

```json
{
  "src": "audio/bg_ambient.mp3",
  "loop": true,
  "volume": 0.35,
  "fadeInSeconds": 3,
  "fadeOutSeconds": 0.8
}
```

### `content.json`

One block per section (`hero`, `forest`, `notes`, `ocean`, `story`, `amber`, `collection`, `cta`, `footer`). Each block is passed to its section component as a `content` prop.

> **Tailwind classes cannot live in JSON.** Tailwind only generates classes it finds in source files, so colour themes and layout classes (for example the Collection card colours or the Ocean card layout) stay in the `.jsx` files. JSON holds text and plain values only (for example `widthPercent` instead of a width class).

---

## Loading Strategy

The preloader stays on screen until **every** required resource is ready. It exits only when all of these are true:

* `content.json` is loaded and the sections are mounted
* every image sequence frame has loaded (or failed)
* every GLB model and embedded texture has loaded, and shaders are compiled
* web fonts are ready
* the browser `load` event has fired
* a minimum display time has passed (so a cached load doesn't flash)

The progress bar is driven by the real number of sources loaded, and the preloader shows the counts:

```text
312 / 744 sources loaded

CONTENT         1 / 1
IMAGE FRAMES    300 / 650
3D MODELS       2 / 5
```

The bar holds at 99% until every gate is open and never moves backwards. Page scrolling is locked while the preloader is visible.

**Failure behaviour:** a missing frame or model counts as "settled" and a fallback is used, and a 15-second watchdog in the 3D layer reveals the site anyway. A broken file therefore never traps a visitor on the loader.

---

## Background Audio

`BackgroundAudio.jsx` plays a looping ambient track.

* Starts after the preloader exits and fades in.
* Browsers block sound until the visitor interacts, so if autoplay is refused the button reads **Tap to enable sound** and playback starts on the first click, tap or key press.
* A small sound on/off button sits at the bottom right; the choice is remembered between visits.
* Pauses while the tab is hidden and resumes when it is visible again.
* iPhones ignore the volume setting, so the fade doesn't apply there.

Put the file at `public/audio/bg_ambient.mp3` (or change `src` in `audio.json`).

### Prompt for generating the sound

> Luxury perfume brand ambient soundtrack, slow cinematic atmosphere, warm evolving synth pads and soft airy textures, subtle low drone, gentle shimmering high bells, faint organic layers drifting in and out (distant forest air, soft ocean swell, warm desert wind), very slow tempo, minimal and elegant, spacious reverb, sensual and mysterious, premium editorial mood. No vocals, no drums, no percussion, no melody hooks, no sudden changes. Seamless loop, same energy from start to end, soft fade-in and fade-out. Instrumental, 90 seconds.

Exclude: vocals, lyrics, drums, beat, bass drops, distortion, harsh or sudden sounds, dramatic builds, cheerful pop, EDM.

Tips: keep the track 60–120 s, make the end blend into the start, export MP3 at 128–160 kbps.

---

## Project Structure

```text
aurelia_perfume/
│
├── public/
│   ├── _headers                       Cloudflare caching rules
│   ├── data/
│   │   ├── content.json
│   │   ├── sequences.json
│   │   ├── models.json
│   │   └── audio.json
│   ├── models/
│   │   ├── forest_bottle.glb
│   │   ├── ocean_bottle.glb
│   │   └── amber_bottle.glb
│   ├── audio/
│   │   └── bg_ambient.mp3
│   ├── forest_essence/        { mobile/, laptop_and_desktop/ }  0001.webp …
│   ├── fragrance_notes/       { mobile/, laptop_and_desktop/ }
│   ├── ocean_bloom/           { mobile/, laptop_and_desktop/ }
│   ├── aurelia_story/         { mobile/, laptop_and_desktop/ }
│   ├── golden_amber/          { mobile/, laptop_and_desktop/ }
│   ├── collection/            { mobile/, laptop_and_desktop/ }
│   └── cta/                   { mobile/, laptop_and_desktop/ }
│
├── src/
│   ├── App.jsx
│   ├── utils/
│   │   └── dataLoader.js              base-aware URLs + cached JSON loading
│   └── components/
│       ├── preloader/                 preloader.jsx
│       ├── navbar/                    navbar.jsx
│       ├── background_layer/          BackgroundLayerController.jsx
│       ├── interactive-3d-layer/      Interactive3DLayer.jsx
│       ├── background_audio/          BackgroundAudio.jsx
│       ├── content_layer/             content_layer.jsx
│       └── sections/
│           ├── hero/                  hero.jsx
│           ├── forest_essence/        forest_essence.jsx
│           ├── fragrance_notes/       fragrance_notes.jsx
│           ├── ocean_bloom/           ocean_bloom.jsx
│           ├── aurelia_story/         aurelia_story.jsx
│           ├── golden_amber/          amber.jsx
│           ├── collection/            collection.jsx
│           ├── cta/                   cta.jsx
│           └── footer/                footer.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── .gitignore
└── README.md
```

Each component keeps its own stylesheet next to it (`hero.css`, `collection.css`, and so on).

---

## Getting Started

**Requirements:** Node.js `^20.19.0` or `>=22.12.0`.

```bash
npm install
npm run dev        # local dev server
npm run build      # production build into dist/
npm run preview    # preview the production build
npm run type-check # vue-tsc (source is JS, so this mainly checks the configs)
```

Locally the site is served at `http://localhost:5173/`.

> **Visual Studio:** it locks files inside `.vs/`, which can crash the dev watcher with `EBUSY`. `.vs/` is ignored in both `vite.config.js` (`server.watch.ignored`) and `.gitignore`.

---

## Deployment (Cloudflare Pages)

The site is hosted on **Cloudflare Pages** and built straight from the Git repository, so no CI workflow file is needed.

1. In the Cloudflare dashboard go to **Workers & Pages → Create → Pages → Connect to Git** and select the repository.
2. Use these build settings:

   | Setting                  | Value           |
   | ------------------------ | --------------- |
   | Framework preset         | None            |
   | Build command            | `npm run build` |
   | Build output directory   | `dist`          |
   | Root directory           | `/`             |

3. Add an environment variable **`NODE_VERSION`** = `24` (Vite 7 needs Node `20.19+` or `22.12+`).
4. Save and deploy. Every push to the production branch redeploys; other branches get preview URLs.
5. To use your own domain, open the Pages project and add it under **Custom domains**.

Keep `package-lock.json` committed so Cloudflare installs the exact dependency versions.

### Base path

`vite.config.js` uses `base: '/'` because Cloudflare serves the site from the root of the domain (`*.pages.dev` or a custom domain). Every path goes through `assetUrl()`, so if the site is ever served from a sub-path, only this one setting needs changing.

### Limits to keep in mind

Cloudflare Pages (free plan) allows up to **20,000 files per site** and **25 MiB per file**. The current frame sets total about 2,700 files, which fits comfortably, but keep each GLB model and the audio file under 25 MiB. Check the Cloudflare Pages limits page for the latest numbers.

### Caching

`public/_headers` is copied to `dist/` on build and sets the caching rules:

* `/assets/*` (hashed build output) is cached for a year as immutable.
* `/data/*` (the JSON config) is always revalidated, so copy edits go live immediately.
* Frame folders, `/models/*` and `/audio/*` are cached for a week. If you replace a file without changing its name, visitors may see the old one until the cache expires.

---

## Performance Strategy

* All frames are preloaded behind the preloader, so scrolling never shows a blank frame.
* Separate, smaller mobile frame sets (device chosen at `mobileMaxWidth`, default 768 px).
* WebP frames; `three` and `gsap` are split into their own chunks.
* Long-lived caching for build output and media through `public/_headers`, served from Cloudflare's global network.
* Draco-compressed GLB support.
* Single WebGL renderer, pixel ratio capped at 1.5, shader warm-up before reveal.
* Small particle systems (about 90 points each) that share one base geometry, with only the active one updated per frame.
* Frame loading is tracked per image, so a missing file can't hang the preloader.

---

## Responsive Design

* **Desktop** — full experience: image sequences, 3D bottles, mouse tilt, particles, hover interactions.
* **Tablet / mobile** — mobile frame sets, adjusted camera framing (the camera pulls back and widens on narrow screens), and responsive card layouts. Ocean Bloom note cards form a pyramid on mobile.

---

## Troubleshooting

| Problem                                          | Likely cause and fix                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Blank page or 404s for assets after deploy       | `base` in `vite.config.js` isn't `'/'` — Cloudflare serves from the domain root       |
| Frames or models don't load on deploy            | A path in the JSON starts with `/` or `./` — remove it                                |
| Page stays on the loader                         | A JSON file is missing or malformed; check the console and Network tab                |
| Text changes don't show                          | Edit `public/data/content.json`, then restart or hard-refresh                         |
| New Tailwind classes have no effect              | They were put in JSON; move them into the `.jsx` file                                 |
| No sound                                         | Browser blocked autoplay — click the sound button; check `audio.json` and the file path |
| Dev server crashes with `EBUSY` on `.vs`         | Make sure `server.watch.ignored` includes `**/.vs/**`                                 |
| Cloudflare build fails                           | Set `NODE_VERSION` to 22 or 24, read the build log, and keep `package-lock.json` committed |
| Deploy rejects a file                            | A file is over 25 MiB — compress it (models, audio) or split it                       |
| Old frames or models still showing               | Cached for a week — rename the file or purge the cache in Cloudflare                  |

---

## Scope Control

Aurelia is a **sample / demo** that intentionally focuses on a **premium visual experience**, not ecommerce functionality. Footer, social and legal links are placeholders, and a real client project would replace them along with the sample copy in `content.json`.

**Included:** looping background ambience with a mute control.

**Not included:** checkout, payments, customer accounts, inventory, CMS, blog, backend, real-time water or fluid simulation, full 3D environments, heavy post-processing, real-time volumetric fog.

---

## Roadmap — Not Yet Implemented

These were part of the original creative direction but are **not** in the current codebase:

* Lenis smooth scrolling integrated with ScrollTrigger
* Reduced-motion support (disable smooth scroll, large parallax and auto-rotation)
* Touch drag interaction for bottles (current interaction is mouse tilt and hover)
* Custom cursor
* KTX2 / Basis textures and Meshopt compression
* External HDRI files (a procedurally generated studio environment is used)
* Dedicated orbital camera-arc transition between Forest and Ocean (current bottle changes use slide and scale transitions)
* Full SEO set: Open Graph metadata, canonical URL, sitemap
* Progressive loading after the first scene (currently everything is preloaded)

---

## What Aurelia Demonstrates

* **Frontend:** Vue 3 component architecture, JSON-driven configuration, base-path-safe deployment.
* **Creative development:** GSAP ScrollTrigger, scroll-scrubbed image sequences, cinematic section transitions.
* **3D:** three.js, GLB/Draco loading, glass materials, themed particles, interactive products.
* **Performance engineering:** real preload tracking, fallbacks and watchdogs, capped pixel ratio, code splitting.
* **Premium design:** luxury typography, editorial layouts, art-directed scenes.

**Aurelia — The Art of Scent.**
