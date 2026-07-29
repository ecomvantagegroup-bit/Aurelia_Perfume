# Aurelia Perfume — Interactive Luxury Experience

> **A cinematic luxury perfume experience combining scroll-driven image sequences with interactive 3D fragrance bottles.**

![Aurelia Preview](https://placehold.co/1600x900/0b0b0b/c8a96a?text=AURELIA+PERFUME)

---

## Overview

**Aurelia** is a premium single-page luxury perfume website designed to demonstrate the **Launch + Interactive 3D** package.

Instead of rendering entire environments in real time, Aurelia uses a **hybrid visual architecture**:

* Pre-rendered cinematic image sequences for environments
* Lightweight interactive Three.js perfume bottles
* GSAP-driven scroll storytelling
* Lenis smooth scrolling
* Subtle particle effects
* Premium editorial typography
* Dark luxury visual system

The experience takes the visitor through three fragrance worlds:

```text
FOREST ESSENCE
      ↓
OCEAN BLOOM
      ↓
GOLDEN AMBER
      ↓
THE COLLECTION
      ↓
DISCOVER AURELIA
```

The objective is to make the website feel like an **interactive luxury fragrance campaign**, rather than a conventional ecommerce landing page.

---

# Project Information

| Item                  | Details                        |
| --------------------- | ------------------------------ |
| Project               | Aurelia Perfume                |
| Industry              | Luxury Product / Fragrance     |
| Package               | Launch + Interactive 3D        |
| Demo Price            | $2,800                         |
| Base Package          | $2,000                         |
| Interactive 3D Add-on | +$800                          |
| Project Type          | Premium Single-Page Experience |
| Framework             | Vue 3                          |
| Build Tool            | Vite                           |
| Rendering             | Hybrid 2D + 3D                 |
| Responsive            | Desktop / Tablet / Mobile      |

---

# Project Goal

The primary goal is to create a website that demonstrates how a luxury product can be presented through:

* Cinematic storytelling
* Interactive 3D
* High-end typography
* Scroll-based animation
* Atmospheric environments
* Minimal user interface
* Premium product presentation

The site should communicate:

> **Aurelia is not simply a perfume. It is an experience.**

---

# Design Philosophy

Aurelia follows a **luxury editorial + cinematic product campaign** aesthetic.

The design should feel:

* Elegant
* Minimal
* Sophisticated
* Cinematic
* Atmospheric
* Expensive
* Modern
* Restrained

The website should **not** feel like:

* A generic ecommerce template
* A technology showcase
* An over-animated Three.js experiment
* A conventional product catalogue

The goal is:

```text
Luxury
   +
Editorial Design
   +
Cinematic Motion
   +
Interactive 3D
   =
Aurelia
```

---

# Design Style

## Visual Direction

### Theme

**Dark Luxury**

Primary environment:

```text
Deep Black
Charcoal
Soft White
Muted Gold
Forest Green
Ocean Blue
Amber
```

The majority of the interface remains dark so the perfume bottles and cinematic sequences become the visual focus.

---

# Colour System

```text
Background
#0B0B0B

Surface
#151515

Primary Text
#F8F8F8

Muted Text
#999999

Luxury Gold
#C8A96A

Forest
#304B3B

Ocean
#254B61

Amber
#9A5B24
```

The scene-specific colours should be used subtly rather than changing the entire interface.

---

# Typography

## Display Typeface

**Cormorant Garamond**

Used for:

* Hero headlines
* Fragrance names
* Large editorial statements
* Storytelling sections

## UI Typeface

**Inter**

Used for:

* Navigation
* Buttons
* Labels
* Descriptions
* Fragrance notes
* Footer

Typography hierarchy:

```text
AURELIA
Large / Elegant / Editorial

THE ART OF SCENT
Medium / Refined

FOREST ESSENCE
Small / Uppercase / Spaced

Explore Collection
Minimal UI
```

---

# Motion Philosophy

Animation should feel **slow, intentional and expensive**.

Avoid excessive movement.

The hierarchy is:

```text
Image Sequence      50%
3D Product          30%
Typography          15%
Effects              5%
```

Every animation should support the product story.

---

# Core Technology

## Frontend

* Vue 3
* Vite
* TypeScript

## Animation

* GSAP
* GSAP ScrollTrigger
* Lenis

## 3D

* Three.js
* GLTFLoader
* KTX2Loader
* HDR Environment Maps
* Particle Systems

## Assets

* WebP / AVIF image sequences
* Optimised GLB models
* KTX2/Basis textures
* Draco / Meshopt compression

## Styling

* CSS
* CSS Variables
* Responsive media queries

Tailwind can optionally be used for utility styling, but the core visual system should remain custom.

---

# Hybrid Rendering Architecture

The main architectural concept is:

```text
                  AURELIA EXPERIENCE
                         │
              ┌──────────┴──────────┐
              │                     │
       IMAGE SEQUENCE          THREE.JS
              │                     │
     Cinematic Environment     3D Perfume
              │                     │
      Forest / Ocean / Amber   Interactive Bottle
              │                     │
              └──────────┬──────────┘
                         │
                    GSAP + Lenis
                         │
                  Scroll Experience
```

### Image sequences

Responsible for:

* Forest environment
* Ocean environment
* Desert / amber environment
* Cinematic camera movement
* Environmental lighting
* Atmospheric effects

### Three.js

Responsible for:

* Perfume bottles
* Bottle rotation
* Mouse interaction
* Touch interaction
* HDRI reflections
* Lightweight particles

This keeps the experience visually rich without requiring a fully real-time 3D environment.

---

# Website Structure

## 01 — Preloader

A minimal luxury loading screen.

```text
A U R E L I A

LOADING EXPERIENCE

████████████░░░░ 78%
```

### Purpose

The preloader provides enough time to load:

* Hero assets
* First image sequence
* First GLB model
* Required textures

### Animation

* Logo fade in
* Progress indicator
* Fade into hero

No unnecessary visual effects.

---

# 02 — Hero

The hero introduces Aurelia before the fragrance journey begins.

### Content

```text
AURELIA

THE ART OF SCENT

Three worlds.
Three compositions.
One signature.

[ Explore the Collection ]
```

### Visual

* Dark background
* Signature 3D bottle
* Subtle rotation
* Soft HDRI reflection
* Fine film grain
* Minimal glow

### Animation

* Logo reveal
* Bottle fade/scale
* Slow bottle rotation
* Typography reveal
* Scroll indicator

### Scroll Indicator

```text
SCROLL TO DISCOVER
        ↓
```

---

# 03 — Forest Essence

### Fragrance Direction

**Fresh / Botanical / Earthy**

The first fragrance introduces Aurelia through nature.

### Background

Cinematic image sequence:

* Misty forest
* Sunlight through trees
* Soft green atmosphere
* Slow camera movement

Target:

```text
180–220 frames
```

### 3D Product

**Frosted Green Bottle**

### Effects

* Subtle floating leaves
* Gentle bottle rotation
* Small vertical floating movement
* Mouse parallax

The environmental lighting should primarily come from the pre-rendered sequence.

### Typography

```text
01

FOREST ESSENCE

Fresh
Botanical
Earthy
```

---

# 04 — Fragrance Notes

A minimal editorial section following Forest Essence.

### Content

```text
FOREST ESSENCE

Fresh / Botanical / Earthy

TOP
Bergamot

HEART
Cedar Leaf

BASE
Moss
```

### Design

* Black background
* Large whitespace
* Fine separator lines
* Small uppercase labels
* Elegant typography

Avoid traditional ingredient cards.

The section should feel like a **luxury fragrance specification**, not a product catalogue.

---

# 05 — Ocean Bloom

### Fragrance Direction

**Aquatic / Mineral / Fresh**

The second fragrance transitions into a blue environment.

### Background

Cinematic sequence containing:

* Ocean surface
* Underwater light
* Coastal sunrise
* Soft waves

Target:

```text
180–220 frames
```

### 3D Product

**Blue Crystal Bottle**

### Effects

* Tiny bubbles
* Slow bottle rotation
* Reflective HDRI lighting
* Subtle mouse parallax

Avoid:

* Real-time water simulation
* Complex fluid physics
* Heavy caustics

The image sequence already provides the environmental realism.

---

# 06 — Aurelia Story

A visual breathing point between Ocean Bloom and Golden Amber.

### Main Statement

```text
A fragrance is more than a scent.

It is a place.
A memory.
A moment that stays.
```

### Brand Introduction

```text
THE AURELIA HOUSE

Aurelia creates fragrances inspired by
places, memories and moments that remain
long after the first impression.
```

### Animation

* Slow text reveal
* Subtle opacity transition
* Gentle vertical movement

No 3D scene required.

---

# 07 — Golden Amber

### Fragrance Direction

**Warm / Sensual / Rich**

The final fragrance is the visual climax of the experience.

### Background

Cinematic sequence:

* Golden sand dunes
* Sunset
* Warm light
* Amber atmosphere

Target:

```text
180–220 frames
```

### 3D Product

**Amber Glass Bottle**

### Effects

* Golden dust particles
* Very subtle smoke
* Slow bottle rotation
* Gentle camera dolly-in
* Warm HDRI reflection

This section can have slightly stronger visual effects because it represents the climax.

---

# 08 — The Collection

The three fragrances finally come together.

```text
THE COLLECTION

01
FOREST ESSENCE
Fresh / Botanical / Earthy

02
OCEAN BLOOM
Aquatic / Mineral / Fresh

03
GOLDEN AMBER
Warm / Sensual / Rich
```

### Visual

Three perfume bottles displayed together.

### Interaction

Hovering over a fragrance:

* Bottle slightly scales
* Soft highlight appears
* Text shifts subtly
* CTA becomes visible

### CTA

```text
Explore Fragrance
```

---

# 09 — Final CTA

The experience ends with a strong editorial statement.

```text
FIND THE SCENT
THAT BECOMES YOURS.

[ DISCOVER AURELIA ]
```

### Animation

* Large typography reveal
* Slow letter spacing transition
* Button magnetic hover
* Fade into footer

---

# 10 — Footer

Minimal luxury footer.

```text
AURELIA

Collection
Story
Contact

Instagram
Pinterest

© 2026 Aurelia
```

No unnecessary footer complexity.

---

# Interactive Features

## 3D Bottle Interaction

Users can:

* Rotate the bottle
* Move around the product with mouse movement
* Interact through touch on mobile
* Observe realistic reflections
* Experience subtle floating movement

The interaction should remain restrained.

---

# Mouse Parallax

Mouse movement subtly affects:

* Bottle position
* Bottle rotation
* Typography depth
* Background movement

The effect should be subtle enough that the visitor feels it rather than notices it.

---

# Scroll Storytelling

GSAP ScrollTrigger controls:

* Image sequence playback
* Bottle movement
* Bottle rotation
* Typography reveals
* Scene transitions
* Particle activation
* Section progress

Example:

```text
Scroll
  ↓
Image Sequence Progress
  ↓
Bottle Rotation
  ↓
Text Reveal
  ↓
Particle Activation
  ↓
Next Scene
```

---

# Smooth Scrolling

Use:

**Lenis**

Integrated with:

**GSAP ScrollTrigger**

Avoid using Locomotive Scroll.

---

# Particle System

Use a single reusable Three.js particle system.

```text
ParticleSystem.vue
```

Configured per scene:

```text
Forest
→ Leaves

Ocean
→ Bubbles

Amber
→ Golden Dust
```

The component should be reusable rather than creating three separate particle implementations.

---

# Three.js Architecture

Use **one persistent Three.js canvas** instead of three separate canvases.

```text
                 THREE.JS CANVAS
                       │
                 BottleScene.vue
                       │
          ┌────────────┼────────────┐
          │            │            │
      Forest.glb    Ocean.glb    Amber.glb
          │            │            │
          └────────────┼────────────┘
                       │
                   HDRI Light
                       │
                  ParticleSystem
```

Only the active bottle should be visible/rendered.

This reduces unnecessary GPU usage.

---

# Image Sequence Architecture

Reusable component:

```text
ImageSequence.vue
```

Responsibilities:

* Canvas rendering
* Frame loading
* Frame caching
* Scroll progress
* Responsive resizing
* Lazy loading
* Mobile quality selection
* Progressive loading

---

# Responsive Strategy

## Desktop

```text
180–220 frames
High-quality WebP / AVIF
High-resolution GLB
Full 3D interaction
```

## Mobile

```text
100–140 frames
Lower-resolution sequence
Optimised GLB
Reduced particle count
Simplified effects
Touch-based bottle interaction
```

Mobile should preserve the experience rather than simply shrinking the desktop version.

---

# Loading Strategy

The loading pipeline should be:

```text
1. Load application shell
        ↓
2. Display preloader
        ↓
3. Load first image sequence
        ↓
4. Load first 3D bottle
        ↓
5. Display hero
        ↓
6. Lazy-load Forest assets
        ↓
7. Lazy-load Ocean assets
        ↓
8. Lazy-load Amber assets
```

Only assets needed soon should be loaded immediately.

---

# Performance Strategy

## Image Sequences

Use:

* WebP
* AVIF where appropriate
* 180–220 desktop frames
* 100–140 mobile frames
* Responsive image dimensions
* Lazy loading
* Progressive loading

Avoid unnecessarily large PNG sequences.

---

# 3D Optimisation

Target:

```text
30k–60k triangles per bottle
```

Use:

* Draco
* Meshopt
* KTX2/Basis
* Compressed textures
* Baked details
* HDRI environment lighting

Avoid excessive geometry.

---

# Lighting Strategy

Each bottle should use a lightweight lighting setup.

```text
HDRI Environment
       +
Directional Light
       +
Subtle Rim Light
```

Avoid multiple real-time shadow-casting lights.

The cinematic image sequences already contain most of the environmental lighting.

---

# Effects Intentionally Excluded

To keep Aurelia premium and performant, the following are intentionally excluded:

* Real-time volumetric fog
* Real-time water simulation
* Complex fluid simulation
* Real-time depth-of-field
* Heavy chromatic aberration
* Excessive post-processing
* Complex glass caustics
* Background audio
* Multiple Three.js canvases
* Locomotive Scroll

The goal is **quality over quantity**.

---

# Navigation

Minimal sticky navigation:

```text
AURELIA

Collection
Story
Notes

                 Explore
```

Navigation should shrink slightly during scroll.

On mobile, use a minimal menu overlay.

---

# UI Interaction

Buttons should use subtle premium interactions.

### Hover

* Small magnetic movement
* Underline animation
* Slight letter-spacing change
* Soft opacity transition

### Cursor

Optional custom cursor:

```text
○
```

On interactive objects:

```text
EXPLORE
```

Keep the cursor subtle and disable it on touch devices.

---

# Components

```text
Preloader.vue
Navigation.vue
Hero.vue

ImageSequence.vue
BottleScene.vue
ParticleSystem.vue

FragranceNotes.vue
StorySection.vue

Collection.vue
FinalCTA.vue
Footer.vue
```

---

# Composables

```text
useImageSequence.ts
useThreeScene.ts
useScrollAnimation.ts
```

### useImageSequence

Handles:

* Frame loading
* Frame rendering
* Scroll progress
* Responsive behaviour

### useThreeScene

Handles:

* Renderer
* Camera
* Scene
* Lighting
* Model loading
* Animation loop
* Cleanup

### useScrollAnimation

Handles:

* ScrollTrigger
* Section transitions
* Text reveals
* Bottle movement

---

# Folder Structure

```text
aurelia-perfume/
│
├── public/
│   ├── models/
│   │   ├── forest.glb
│   │   ├── ocean.glb
│   │   └── amber.glb
│   │
│   ├── sequences/
│   │   ├── forest/
│   │   ├── ocean/
│   │   └── amber/
│   │
│   └── hdri/
│
├── src/
│   │
│   ├── assets/
│   │   ├── textures/
│   │   └── images/
│   │
│   ├── components/
│   │   ├── Preloader.vue
│   │   ├── Navigation.vue
│   │   ├── Hero.vue
│   │   ├── ImageSequence.vue
│   │   ├── BottleScene.vue
│   │   ├── ParticleSystem.vue
│   │   ├── FragranceNotes.vue
│   │   ├── StorySection.vue
│   │   ├── Collection.vue
│   │   ├── FinalCTA.vue
│   │   └── Footer.vue
│   │
│   ├── composables/
│   │   ├── useImageSequence.ts
│   │   ├── useThreeScene.ts
│   │   └── useScrollAnimation.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── typography.css
│   │
│   ├── views/
│   │   └── Home.vue
│   │
│   ├── App.vue
│   └── main.ts
│
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# Asset Requirements

## 3D Models

Three perfume bottles:

```text
forest.glb
ocean.glb
amber.glb
```

Each model should be:

* 30k–60k triangles
* GLB format
* Draco/Meshopt compressed
* KTX2/Basis textures
* Correctly UV mapped
* Optimised for WebGL

---

## Image Sequences

Three cinematic sequences:

```text
forest/
    frame_001.webp
    frame_002.webp
    ...
    frame_200.webp

ocean/
    frame_001.webp
    frame_002.webp
    ...
    frame_200.webp

amber/
    frame_001.webp
    frame_002.webp
    ...
    frame_200.webp
```

Recommended:

```text
Desktop: 180–220 frames
Mobile: 100–140 frames
```

---

# Scene Configuration

Instead of hardcoding each scene, use configuration data.

Example:

```ts
const scenes = [
  {
    id: 'forest',
    title: 'Forest Essence',
    description: 'Fresh / Botanical / Earthy',
    model: '/models/forest.glb',
    sequence: '/sequences/forest/',
    particleType: 'leaves'
  },
  {
    id: 'ocean',
    title: 'Ocean Bloom',
    description: 'Aquatic / Mineral / Fresh',
    model: '/models/ocean.glb',
    sequence: '/sequences/ocean/',
    particleType: 'bubbles'
  },
  {
    id: 'amber',
    title: 'Golden Amber',
    description: 'Warm / Sensual / Rich',
    model: '/models/amber.glb',
    sequence: '/sequences/amber/',
    particleType: 'dust'
  }
]
```

This makes the architecture scalable and maintainable.

---

# User Experience Flow

```text
                 PRELOADER
                     ↓
                   HERO
                     ↓
              FOREST ESSENCE
                     ↓
             FRAGRANCE NOTES
                     ↓
               OCEAN BLOOM
                     ↓
               BRAND STORY
                     ↓
               GOLDEN AMBER
                     ↓
              THE COLLECTION
                     ↓
                FINAL CTA
                     ↓
                  FOOTER
```

---

# Performance Targets

The experience should prioritise:

* Fast initial render
* Low memory usage
* Responsive interaction
* Minimal blocking assets
* Lazy-loaded scenes
* Optimised 3D models
* Reduced mobile particle count
* Efficient frame rendering

The first meaningful experience should not wait for all three fragrance scenes to load.

---

# Accessibility

Despite the cinematic experience, the website should maintain:

* Semantic HTML
* Keyboard navigation
* Visible focus states
* Accessible buttons
* Reduced-motion support
* Descriptive image alt text
* Sufficient text contrast

### Reduced Motion

If the user has enabled reduced motion:

```text
Disable:
- Smooth scrolling
- Large parallax
- Automatic bottle rotation
- Heavy scroll animation

Keep:
- Content
- Images
- Product information
- Navigation
```

---

# SEO

The website should include:

* Semantic headings
* Meta title
* Meta description
* Open Graph metadata
* Twitter/X card metadata
* Canonical URL
* Descriptive image alt text
* Structured content
* Favicon
* Sitemap-ready architecture

Suggested title:

```text
Aurelia — The Art of Scent
```

Suggested description:

```text
Discover Aurelia, a cinematic fragrance experience
inspired by nature, memory and timeless elegance.
```

---

# What This Demo Demonstrates

Aurelia is specifically designed to demonstrate the following agency capabilities:

### Frontend

* Vue 3 SPA development
* Responsive architecture
* Component-driven design

### Creative Development

* GSAP animation
* ScrollTrigger storytelling
* Smooth scrolling
* Interactive UI

### 3D Development

* Three.js
* GLB model integration
* HDRI lighting
* Interactive products
* Particle systems

### Performance Engineering

* Image sequence optimisation
* 3D compression
* Lazy loading
* Progressive loading
* Mobile optimisation

### Premium Design

* Luxury typography
* Editorial layout
* Cinematic transitions
* High-end product presentation

---

# Scope Control

Aurelia intentionally does **not** include:

* Ecommerce checkout
* Payment processing
* CMS
* Blog
* Customer accounts
* Product inventory
* Complex backend
* Real-time product configurator
* Full ecommerce catalogue

Those features can be offered as separate services for a real client.

The demo focuses on:

> **Premium visual design + interactive 3D + cinematic storytelling.**

---

# Final Feature Summary

### Core

* [x] Vue 3 SPA
* [x] Responsive design
* [x] Dark luxury theme
* [x] Premium typography
* [x] Preloader
* [x] Sticky navigation
* [x] Hero
* [x] Collection
* [x] Final CTA
* [x] Footer

### Cinematic Experience

* [x] Forest image sequence
* [x] Ocean image sequence
* [x] Amber image sequence
* [x] Scroll-controlled playback
* [x] Smooth transitions
* [x] Editorial storytelling

### Interactive 3D

* [x] 3 perfume bottle models
* [x] Three.js
* [x] GLTF/GLB
* [x] HDRI reflections
* [x] Mouse interaction
* [x] Touch interaction
* [x] Bottle rotation
* [x] Subtle floating

### Atmosphere

* [x] Forest leaves
* [x] Ocean bubbles
* [x] Amber dust
* [x] Subtle film grain
* [x] Mouse parallax
* [x] Magnetic buttons

### Performance

* [x] WebP/AVIF
* [x] Lazy loading
* [x] Progressive loading
* [x] Draco/Meshopt
* [x] KTX2/Basis
* [x] Mobile-specific assets
* [x] Single Three.js canvas
* [x] Reduced-motion support

---

# Project Positioning

**Aurelia is the $2,800 Launch + Interactive 3D showcase.**

It demonstrates that a relatively focused single-page experience can combine:

```text
                    AURELIA

             Premium UI / UX
                     +
          Cinematic Storytelling
                     +
             Scroll Animation
                     +
              Interactive 3D
                     +
           Performance Engineering
                     ↓
          Luxury Digital Experience
```

The final result should feel less like a website and more like a **digital fragrance campaign**.

---

# Development Principle

> **Make the experience feel expensive, not technically complicated.**

The environment should be cinematic.

The bottle should be interactive.

The typography should tell the story.

The animation should remain restrained.

The performance should remain invisible.

**Everything else is secondary.**
