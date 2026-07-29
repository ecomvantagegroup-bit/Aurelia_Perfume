# Aurelia Perfume — Interactive Luxury Experience

> **A cinematic luxury perfume experience combining scroll-driven image sequences, interactive 3D fragrance bottles, and editorial storytelling.**

---

## Overview

**Aurelia** is a premium single-page luxury perfume website created to demonstrate the **Launch + Interactive 3D** package.

The experience combines:

* Cinematic image sequences
* Interactive Three.js perfume bottles
* GSAP scroll-driven storytelling
* Lenis smooth scrolling
* Atmospheric particle effects
* Premium editorial typography
* Dark luxury visual design
* Art-directed scene transitions

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

# Project Information

| Item                  | Details                        |
| --------------------- | ------------------------------ |
| Project               | Aurelia Perfume                |
| Industry              | Luxury Product / Fragrance     |
| Package               | Launch + Interactive 3D        |
| Base Package          | $2,000                         |
| Interactive 3D Add-on | +$800                          |
| Total Demo Price      | **$2,800**                     |
| Project Type          | Premium Single-Page Experience |
| Framework             | Vue 3                          |
| Language              | TypeScript                     |
| Build Tool            | Vite                           |
| Rendering             | Hybrid 2D + 3D                 |
| Responsive            | Desktop / Tablet / Mobile      |

---

# Project Goal

The goal is to create a digital fragrance experience that feels closer to a **luxury perfume campaign** than a conventional website.

Aurelia should demonstrate the ability to combine:

* Premium UI/UX
* Creative frontend development
* Interactive 3D
* Cinematic motion
* Scroll storytelling
* Performance optimisation
* Responsive interaction

The visitor should not think:

> "This website uses Three.js."

Instead, they should feel:

> **"This feels like a perfume campaign I can interact with."**

---

# Design Philosophy

Aurelia follows a **dark luxury + cinematic editorial** design language.

The visual identity should feel:

* Elegant
* Minimal
* Sophisticated
* Cinematic
* Atmospheric
* Premium
* Modern
* Restrained

The experience should avoid feeling like:

* A generic ecommerce template
* A technology showcase
* An over-animated WebGL experiment
* A conventional product catalogue

### Core Philosophy

```text
Luxury
   +
Editorial Design
   +
Cinematic Motion
   +
Interactive 3D
   +
Performance
   =
Aurelia
```

---

# Visual Hierarchy

The experience follows a strict visual hierarchy:

```text
Image Sequence       50%
3D Product           30%
Typography           15%
Effects               5%
```

The image sequence creates the world.

The 3D bottle creates interaction.

Typography tells the story.

Effects provide atmosphere.

Nothing should compete unnecessarily with the perfume.

---

# Design Style

## Theme

**Dark Luxury**

The interface is primarily dark so the fragrance bottles, lighting, and cinematic sequences become the focus.

Visual language:

* Deep black backgrounds
* Soft white typography
* Muted gold accents
* Scene-specific colour accents
* Large editorial typography
* Fine separator lines
* Generous whitespace
* Subtle grain
* Minimal UI

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

The forest, ocean, and amber colours should primarily appear within their respective scenes rather than changing the entire website theme.

---

# Typography

## Display

**Cormorant Garamond**

Used for:

* Hero headlines
* Fragrance names
* Editorial statements
* Brand storytelling

## UI

**Inter**

Used for:

* Navigation
* Buttons
* Labels
* Descriptions
* Fragrance notes
* Footer

### Typography Direction

```text
AURELIA

Large
Elegant
Editorial
High contrast
Generous spacing
```

Supporting text should remain restrained and minimal.

---

# Motion Philosophy

Animation should feel:

* Slow
* Intentional
* Smooth
* Organic
* Cinematic
* Expensive

Avoid excessive motion.

The website should feel like a continuous visual journey rather than a collection of animation demos.

---

# Transition System

Aurelia uses different transitions depending on the type of content being connected.

The transition itself should communicate the relationship between two sections.

There are four primary transition styles.

---

## 01 — Orbital Transition

### Used for

```text
Forest Essence
        ↓
Ocean Bloom
```

This is the primary transition between major fragrance worlds.

The bottle and camera move through a subtle circular/orbital arc while the environment changes.

```text
Forest
   ↓
Bottle rotates slightly
   ↓
Camera arcs around product
   ↓
Forest fades
   ↓
Ocean emerges
   ↓
Blue bottle appears
```

### Motion

* 15–40° bottle/camera movement
* Environment crossfade
* Subtle parallax
* Smooth colour transformation
* No full 360° spinning

The goal is **organic movement**, not a spinning webpage.

---

# 02 — Linear Reveal

### Used for

* Fragrance Notes
* Collection
* Final CTA
* Editorial content

The content enters vertically as the visitor scrolls.

Example:

```text
FOREST ESSENCE

Fresh
Botanical
Earthy

        ↓

TOP
Bergamot

        ↓

HEART
Cedar Leaf

        ↓

BASE
Moss
```

This gives the visitor a visual breathing point after a cinematic sequence.

---

# 03 — Dissolve Transition

### Used for

```text
Ocean Bloom
      ↓
Aurelia Story
```

After an intense visual scene, the environment gradually disappears.

```text
Ocean
   ↓
Blue desaturates
   ↓
Image fades
   ↓
Bottle disappears
   ↓
Black space
   ↓
Typography appears
```

This creates an emotional pause.

It prevents the experience from becoming visually exhausting.

---

# 04 — Pull-Back Transition

### Used for

```text
Golden Amber
      ↓
The Collection
```

The camera slowly pulls away from the final fragrance.

```text
Amber Bottle
      ↓
Camera moves backward
      ↓
Environment recedes
      ↓
Black space expands
      ↓
Other bottles appear
      ↓
Collection is revealed
```

The three individual fragrance worlds finally become one collection.

---

# Complete Transition Map

```text
                         HERO
                           │
                    Linear Reveal
                           ↓
                   FOREST ESSENCE
                           │
                   Orbital Transition
                           ↓
                    OCEAN BLOOM
                           │
                    Linear Reveal
                           ↓
                  FRAGRANCE NOTES
                           │
                   Dissolve Transition
                           ↓
                    AURELIA STORY
                           │
              Colour Transformation
                           ↓
                   GOLDEN AMBER
                           │
                  Camera Pull-Back
                           ↓
                   THE COLLECTION
                           │
                    Linear Reveal
                           ↓
                      FINAL CTA
                           │
                         FOOTER
```

---

# Website Structure

## 01 — Preloader

Minimal loading experience.

```text
A U R E L I A

LOADING EXPERIENCE

████████████░░░░
```

### Purpose

Provides time to load the initial experience:

* Application shell
* Hero assets
* Initial 3D model
* Required textures

### Animation

* Logo reveal
* Progress animation
* Fade into hero

Keep the preloader simple.

---

# 02 — Hero

The hero introduces Aurelia before entering the fragrance worlds.

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

* Deep black background
* Signature 3D bottle
* Subtle HDRI reflection
* Slow bottle rotation
* Fine film grain
* Minimal glow

### Animation

* Logo fade-in
* Bottle reveal
* Slow rotation
* Typography reveal
* Scroll indicator

### Scroll Indicator

```text
SCROLL TO DISCOVER
        ↓
```

---

# 03 — Forest Essence

### Fragrance Character

**Fresh / Botanical / Earthy**

The first fragrance introduces Aurelia through nature.

### Environment

Cinematic forest image sequence featuring:

* Mist
* Trees
* Filtered sunlight
* Natural atmosphere
* Slow cinematic camera movement

### 3D Product

**Frosted Green Bottle**

### Effects

* Floating leaves
* Gentle bottle rotation
* Slight floating motion
* Mouse parallax

Environmental lighting should primarily come from the pre-rendered sequence.

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
* Thin separator lines
* Small uppercase labels
* Elegant typography
* Vertical scroll reveal

This should feel like a **luxury fragrance specification**, not a standard ingredient card layout.

---

# 05 — Ocean Bloom

### Fragrance Character

**Aquatic / Mineral / Fresh**

The second fragrance moves into a cooler blue environment.

### Environment

Cinematic ocean sequence featuring:

* Ocean surface
* Underwater light
* Coastal sunrise
* Waves
* Reflections

### 3D Product

**Blue Crystal Bottle**

### Effects

* Tiny bubbles
* Slow bottle rotation
* Reflective HDRI lighting
* Subtle mouse parallax

Avoid:

* Real-time water simulation
* Fluid physics
* Complex water caustics

The cinematic sequence provides the environmental realism.

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

### Brand Story

```text
THE AURELIA HOUSE

Aurelia creates fragrances inspired by
places, memories and moments that remain
long after the first impression.
```

### Transition

The Ocean scene dissolves into black.

Typography gradually appears.

No 3D environment is required.

---

# 07 — Golden Amber

### Fragrance Character

**Warm / Sensual / Rich**

The final fragrance acts as the visual climax.

### Environment

Cinematic golden sequence featuring:

* Sand dunes
* Sunset
* Warm light
* Amber atmosphere

### 3D Product

**Amber Glass Bottle**

### Effects

* Golden dust
* Subtle smoke
* Slow bottle rotation
* Gentle camera dolly-in
* Warm HDRI reflections

This scene can have slightly stronger atmosphere because it represents the climax of the fragrance journey.

---

# 08 — The Collection

The three fragrance worlds finally come together.

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

Three bottles displayed together:

```text
        [GREEN]

[BLUE]          [AMBER]
```

### Interaction

On hover:

* Bottle slightly scales
* Soft highlight appears
* Text shifts subtly
* CTA becomes visible

### Transition Into Collection

Use the **Golden Amber camera pull-back**.

The visitor should feel as though they are leaving the final fragrance world and discovering the complete Aurelia collection.

---

# 09 — Final CTA

The final section should be simple and memorable.

```text
FIND THE SCENT
THAT BECOMES YOURS.

[ DISCOVER AURELIA ]
```

### Animation

* Large typography reveal
* Subtle letter-spacing animation
* Magnetic button
* Slow fade into footer

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

# Interactive 3D Features

## Product Interaction

Users can:

* Rotate the perfume bottle
* Move around the product with mouse movement
* Interact through touch
* View realistic reflections
* Experience subtle floating motion

The 3D experience should remain restrained.

---

# Mouse Parallax

Mouse movement subtly affects:

* Bottle position
* Bottle rotation
* Typography depth
* Background movement

The effect should be noticeable only through the feeling of depth.

---

# Scroll-Driven Animation

GSAP ScrollTrigger controls:

* Image sequence playback
* Bottle rotation
* Bottle movement
* Typography reveals
* Scene transitions
* Particle activation
* Collection reveal

```text
Scroll
  ↓
Image Sequence
  ↓
Bottle Motion
  ↓
Typography
  ↓
Particles
  ↓
Transition
  ↓
Next Scene
```

---

# Smooth Scrolling

Use:

**Lenis**

Integrated with:

**GSAP ScrollTrigger**

Do not use Locomotive Scroll.

---

# Particle System

Use one reusable Three.js particle component.

```text
ParticleSystem.vue
```

Scene configuration:

```text
Forest
→ Leaves

Ocean
→ Bubbles

Amber
→ Golden Dust
```

The same particle system should be configured differently per scene rather than creating three independent implementations.

---

# Three.js Architecture

Use **one persistent Three.js canvas**.

```text
                  THREE.JS CANVAS
                         │
                  BottleScene.vue
                         │
          ┌──────────────┼──────────────┐
          │              │              │
      Forest.glb      Ocean.glb      Amber.glb
          │              │              │
          └──────────────┼──────────────┘
                         │
                    HDRI Lighting
                         │
                   Particle System
```

Only the active product scene should be rendered visibly.

---

# Image Sequence Architecture

Use a reusable:

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
* Progressive loading
* Mobile asset handling

The component should remain independent from the actual fragrance content.

---

# Loading Strategy

```text
Application Shell
        ↓
Preloader
        ↓
Hero Assets
        ↓
Hero 3D Bottle
        ↓
Hero Experience
        ↓
Forest Assets
        ↓
Ocean Assets
        ↓
Amber Assets
```

Only assets required immediately should block the initial experience.

Remaining assets should load progressively.

---

# 3D Optimisation

Perfume models should be optimised for real-time WebGL rendering.

Use:

* Draco compression
* Meshopt
* KTX2/Basis textures
* Baked details
* Optimised materials
* HDRI lighting

Avoid excessive geometry and unnecessary real-time effects.

---

# Lighting Strategy

Use a lightweight lighting system:

```text
HDRI Environment
       +
Directional Light
       +
Subtle Rim Light
```

The image sequences already provide most of the environmental lighting.

Avoid multiple dynamic shadow-casting lights.

---

# Performance Strategy

The experience should prioritise:

* Fast initial rendering
* Low GPU usage
* Low memory usage
* Responsive interaction
* Lazy-loaded scenes
* Optimised 3D models
* Progressive asset loading
* Mobile optimisation
* Reduced particle count on mobile

The first meaningful experience should not depend on loading every scene.

---

# Responsive Design

## Desktop

Full cinematic experience:

* Image sequence backgrounds
* Interactive 3D bottles
* Mouse parallax
* Full particle effects
* Advanced transitions

## Tablet

Maintain:

* Image sequences
* 3D interaction
* Scroll animation

Reduce unnecessary particle density.

## Mobile

Use:

* Touch-based bottle interaction
* Reduced particle density
* Simplified parallax
* Optimised image assets
* Reduced-motion fallback where appropriate

The mobile experience should feel intentionally designed rather than being a scaled-down desktop layout.

---

# Accessibility

The cinematic experience should still maintain:

* Semantic HTML
* Keyboard navigation
* Visible focus states
* Accessible buttons
* Descriptive image alt text
* Sufficient contrast
* Reduced-motion support

### Reduced Motion

When reduced motion is enabled:

Disable or reduce:

* Smooth scrolling
* Large parallax
* Automatic bottle rotation
* Heavy scroll animation

Keep:

* Content
* Product information
* Navigation
* Essential imagery
* Core interactions

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

Navigation becomes slightly smaller during scroll.

Mobile uses a minimal menu overlay.

---

# UI Interactions

## Buttons

Subtle premium interactions:

* Magnetic movement
* Underline animation
* Letter-spacing change
* Opacity transitions

## Cursor

Optional custom cursor:

```text
○
```

On interactive elements:

```text
EXPLORE
```

Disable the custom cursor on touch devices.

---

# SEO

The website should include:

* Semantic HTML
* Correct heading hierarchy
* Meta title
* Meta description
* Open Graph metadata
* Social sharing metadata
* Canonical URL
* Descriptive alt text
* Favicon
* Sitemap-ready architecture

### Suggested Title

```text
Aurelia — The Art of Scent
```

### Suggested Description

```text
Discover Aurelia, a cinematic fragrance experience
inspired by nature, memory and timeless elegance.
```

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

# Scene Configuration

Scenes should be configuration-driven rather than hardcoded.

```ts
const scenes = [
  {
    id: 'forest',
    title: 'Forest Essence',
    description: 'Fresh / Botanical / Earthy',
    model: '/models/forest.glb',
    sequence: '/sequences/forest/',
    particleType: 'leaves',
    transition: 'orbital'
  },
  {
    id: 'ocean',
    title: 'Ocean Bloom',
    description: 'Aquatic / Mineral / Fresh',
    model: '/models/ocean.glb',
    sequence: '/sequences/ocean/',
    particleType: 'bubbles',
    transition: 'dissolve'
  },
  {
    id: 'amber',
    title: 'Golden Amber',
    description: 'Warm / Sensual / Rich',
    model: '/models/amber.glb',
    sequence: '/sequences/amber/',
    particleType: 'dust',
    transition: 'pullback'
  }
]
```

This keeps the experience maintainable and makes future fragrance scenes easier to add.

---

# Recommended Components

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

### `useImageSequence`

Handles:

* Frame loading
* Frame rendering
* Scroll progress
* Caching
* Responsive behaviour

### `useThreeScene`

Handles:

* Renderer
* Camera
* Scene
* Lighting
* Model loading
* Animation loop
* Cleanup

### `useScrollAnimation`

Handles:

* ScrollTrigger
* Section transitions
* Typography reveals
* Bottle movement
* Scene transitions

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
                AURELIA STORY
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

# Feature Summary

## Core

* [x] Vue 3 SPA
* [x] TypeScript
* [x] Responsive design
* [x] Dark luxury theme
* [x] Premium typography
* [x] Preloader
* [x] Sticky navigation
* [x] Hero
* [x] Collection
* [x] Final CTA
* [x] Footer

## Cinematic Experience

* [x] Forest environment
* [x] Ocean environment
* [x] Amber environment
* [x] Scroll-driven image sequences
* [x] Cinematic scene transitions
* [x] Editorial storytelling
* [x] Colour transformations

## Interactive 3D

* [x] Three perfume bottle models
* [x] Three.js
* [x] GLB integration
* [x] HDRI reflections
* [x] Mouse interaction
* [x] Touch interaction
* [x] Bottle rotation
* [x] Subtle floating
* [x] Single persistent Three.js canvas

## Atmosphere

* [x] Forest leaves
* [x] Ocean bubbles
* [x] Amber dust
* [x] Subtle film grain
* [x] Mouse parallax
* [x] Magnetic buttons

## Transitions

* [x] Linear reveals
* [x] Orbital transitions
* [x] Dissolve transitions
* [x] Colour transformations
* [x] Camera pull-back
* [x] Editorial section reveals

## Performance

* [x] WebP / AVIF assets
* [x] Lazy loading
* [x] Progressive loading
* [x] Draco / Meshopt
* [x] KTX2 / Basis
* [x] Responsive assets
* [x] Single Three.js canvas
* [x] Mobile optimisation
* [x] Reduced-motion support

---

# Scope Control

Aurelia intentionally focuses on **premium visual experience**, not ecommerce functionality.

Not included:

* Ecommerce checkout
* Payment processing
* Customer accounts
* Product inventory
* CMS
* Blog
* Complex backend
* Full ecommerce catalogue
* Real-time water simulation
* Full 3D environments
* Complex fluid simulation
* Heavy post-processing
* Real-time volumetric fog
* Background audio

These can be offered as additional services for a real client.

---

# What Aurelia Demonstrates

### Frontend Development

* Vue 3
* TypeScript
* Component architecture
* Responsive SPA development

### Creative Development

* GSAP
* ScrollTrigger
* Lenis
* Scroll-driven experiences
* Cinematic transitions

### 3D Development

* Three.js
* GLB models
* GLTFLoader
* HDRI lighting
* Interactive products
* Particle systems

### Performance Engineering

* Progressive loading
* Lazy loading
* Image optimisation
* 3D compression
* Mobile optimisation
* GPU-conscious architecture

### Premium Design

* Luxury typography
* Editorial layouts
* Cinematic environments
* Art-directed transitions
* High-end product presentation

---

# Project Positioning

**Aurelia is the $2,800 Launch + Interactive 3D showcase.**

It demonstrates how a focused single-page website can combine:

```text
                 AURELIA
                    │
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

---

# Final Creative Direction

The experience should follow one central rule:

> **Make the experience feel expensive, not technically complicated.**

The environment should be cinematic.

The bottle should be interactive.

The typography should tell the story.

The transitions should feel intentional.

The effects should remain subtle.

The performance should be invisible.

### Final Experience

```text
             THE WORLD
        Cinematic Sequences
                 ↓
             THE PRODUCT
          Interactive 3D
                 ↓
             THE STORY
       Editorial Typography
                 ↓
           THE TRANSITION
       Organic Scene Motion
                 ↓
            THE BRAND
              Aurelia
```

**Aurelia — The Art of Scent.**
