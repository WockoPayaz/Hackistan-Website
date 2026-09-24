# Hackistan Website — Phase 1 PRD v2

## Product Requirements Document

### Project
**Hackistan — Official Website**

### Phase
**Phase 1: Landing Experience + Current Workshop**

### Primary visual reference
`https://alche.studio/`

The site should take inspiration from Alche Studio's level of polish, composition, motion discipline, use of large typography, 2D/3D interplay, spatial transitions, and logo-led visual language.

Do **not** create a pixel-for-pixel clone. Build an original visual identity around the Hackistan logo and content.

---

# 1. Organization

Hackistan is a student-led Hack Club based in **Quetta, Pakistan**.

The website eventually serves two purposes:

## Brand
Present Hackistan as a serious, experimental, creative technology community.

## Utility
Allow visitors and members to discover:
- what Hackistan is currently doing
- current workshops
- previous workshops
- planned workshops
- projects made during workshops
- independent member projects
- club information
- members
- ways to join

Phase 1 should establish the visual system and interaction system before the full website is built.

---

# 2. Phase 1 scope

Build only:

## A. Global shell
Including:
- loading experience
- navigation
- global typography
- page/section transitions
- motion system
- responsive behavior
- accessibility baseline
- performance baseline

## B. Landing / Hero
The main Hackistan landing experience.

## C. NOW / Current Workshop
A section displaying the workshop currently happening at Hackistan.

Stop after this section.

Do not build the full workshop archive, project archive, team page, About page, Join page, or CMS interface yet.

The architecture should anticipate those features.

---

# 3. No sound

**Do not implement sound anywhere in the website.**

This is a deliberate product decision.

Requirements:
- no sound-entry screen
- no music
- no ambience
- no hover sounds
- no autoplay audio
- no mute button
- no audio-related settings or dependencies
- no audio assets in the public bundle

Any interaction that would otherwise rely on sound should be communicated entirely through motion, typography, visual feedback, and spatial transitions.

---

# 4. Provided brand asset

Use the supplied Hackistan logo concept as the primary branding reference.

The identity contains:
- a large geometric **H**
- an angular mountain-like negative-space bridge in the center
- the **Hackistan** wordmark
- the phrase **IDEAS FUEL PROGRESS**

Ignore presentation-board annotations and surrounding mockup text.

The important assets are:
1. H symbol
2. Hackistan wordmark
3. optional supporting phrase: `IDEAS FUEL PROGRESS`

Do not simply place the supplied square image onto the page.

Create clean web-ready assets:
- SVG for the H symbol
- vector or text-based wordmark
- transparent background
- mathematically clean geometry
- separate vector groups for the left pillar, mountain/bridge, and right pillar

The mark must remain recognizable at favicon size.

---

# 5. Logo as an interactive system

The logo must not behave like a static navbar badge.

Treat the Hackistan H as one of the main visual objects of the site.

Design it as three reusable layers:

1. `left-pillar`
2. `mountain-bridge`
3. `right-pillar`

Supported visual states:

## State 1 — Flat
Clean 2D white/off-white H.

## State 2 — Dimensional
Very subtle depth/extrusion or lighting.

## State 3 — Separated
The three logo parts move apart slightly.

## State 4 — Responsive
Small perspective or parallax shifts based on pointer position.

## State 5 — Transition
Parts of the logo expand, crop, mask, or reposition to connect sections.

Do not overanimate.

Motion should feel deliberate, measured, and premium.

---

# 6. General art direction

Do not use standard Hack Club visual styling as the main design language.

Avoid:
- Hack Club red-dominated layouts
- cartoon sticker aesthetic
- generic developer visuals
- green terminal styling
- Matrix imagery
- code rain
- circuit-board graphics
- generic neon cyberpunk
- glassmorphism
- SaaS-style feature cards
- startup landing-page templates
- overuse of gradients
- rounded cards everywhere
- decorative particles without purpose

The desired direction is closer to an experimental creative studio.

The site should feel:
- editorial
- spatial
- restrained
- highly composed
- tactile
- slightly surreal
- contemporary
- youthful without looking childish
- technical without looking stereotypically "hacker"

---

# 7. Color system

Use a restrained palette.

## Base
Near black:
`#0B0C0D`

## Foreground
Warm off-white:
`#F2F0EA`

## Secondary text
Muted gray:
`#9C9C98`

## Alternate surface
Warm pale neutral:
`#EAE8E1`

## Divider / hairline
Dark mode:
`rgba(242, 240, 234, 0.18)`

Light mode:
`rgba(11, 12, 13, 0.14)`

## Atmospheric accents
Use only when needed:
- muted lavender
- desaturated pink
- pale gray-blue

These should appear in lighting, media treatment, or subtle gradient fields, not as a permanent UI accent.

Do not assign a bright "brand color" in Phase 1.

---

# 8. Typography

Typography is one of the primary visual systems.

## Display
Use a modern grotesk / geometric sans-serif.

Desired qualities:
- neutral
- sharp
- editorial
- slightly futuristic
- high legibility
- good variable-font support if possible

Preferred categories:
- Neue Montreal-like
- Helvetica Neue-like
- Suisse-like
- Geist
- Inter Tight
- another legally usable equivalent

Do not use a font with unclear licensing.

## Supporting labels
Uppercase with strong tracking.

Examples:
- `CURRENT WORKSHOP`
- `HACKISTAN / QUETTA`
- `01 / NOW`
- `SEP 19 — OCT 03`

## Large display type
Use very large responsive typography with `clamp()`.

Large words may occupy 50–80% of viewport width.

Avoid excessive text effects.

---

# 9. Global navigation

Navigation should be minimal.

Desktop concept:

`HACKISTAN                                      MENU +`

Alternative:
`H                                               MENU`

When opened, use a fullscreen navigation overlay.

Eventual navigation:
- TOP
- NOW
- WORKSHOPS
- PROJECTS
- ABOUT
- JOIN

For Phase 1:
- TOP must work
- NOW must work
- future sections should either remain hidden or be visibly unavailable during development
- do not create fake empty routes

---

# 10. Initial load

Create a short visual loading sequence.

Target:
approximately **0.8–1.8 seconds** after required assets are ready.

Suggested sequence:
1. logo fragments appear slightly separated
2. three parts align into the H
3. `HACKISTAN` appears
4. loader transitions into hero

Do not force the full animation on every navigation.

Subsequent visits in the same session should use a much shorter transition.

Respect `prefers-reduced-motion`.

---

# 11. Hero objective

The hero should establish Hackistan as:
- experimental
- young
- technical
- creative
- design-conscious

It should create curiosity before explaining details.

Avoid a conventional headline + paragraph + two-button layout.

---

# 12. Hero — desktop composition

Use a full viewport:
`100svh`

Suggested edge labels:

Top left:
`HACKISTAN`
`QUETTA / PK`

Top right:
`IDEAS`
`PEOPLE`
`PROGRESS`

Center:
large H symbol occupying roughly `35–55vh`.

Below, intersecting, or spatially related:
`Hackistan`

Supporting microcopy:
`IDEAS FUEL PROGRESS`

Bottom left:
`STUDENT-LED TECHNOLOGY COMMUNITY`
`QUETTA, PAKISTAN`

Bottom right:
`SCROLL TO EXPLORE →`

Do not perfectly center everything.

Use asymmetry and negative space.

---

# 13. Hero interaction

The H may be built with:
- SVG/CSS
- Three.js / React Three Fiber if genuinely beneficial

Use the simplest approach that creates the required visual quality.

## Pointer interaction
Allow subtle response to:
- pointer x/y
- simulated light direction
- shallow perspective
- tiny parallax

Maximum movement must remain restrained.

Do not spin the logo freely.

## Scroll interaction
As the user begins scrolling:
1. H scales slightly
2. camera/visual plane appears to move closer
3. mountain bridge becomes more prominent
4. wordmark drifts independently
5. edge labels fade/translate away
6. logo geometry becomes part of the transition into NOW

Do not simply fade the hero out.

---

# 14. Hero → NOW transition concept

Preferred concept:
the logo becomes the transition device.

Possible sequence:
1. wordmark recedes
2. H fragments separate by a small amount
3. mountain bridge grows or becomes a mask
4. the visual field transitions from abstract branding to workshop media
5. `01 / NOW` appears as the next scene locks into place

Alternative:
the full H expands and crops the viewport before resolving into the next layout.

Choose the concept that feels more natural and performs better.

Do not prioritize spectacle over clarity.

---

# 15. Texture

The site should not look sterile.

Use very subtle:
- film grain
- noise
- soft material texture
- lighting irregularity

Keep opacity low.

Prefer procedural CSS/canvas texture over large video overlays.

Texture must not reduce text readability.

---

# 16. Scrolling

Use smooth scrolling carefully.

Suggested:
- Lenis
- GSAP ScrollTrigger

The page should feel weighted but responsive.

No extreme scroll hijacking.

Mouse wheel, trackpad, keyboard, and touch scrolling must remain intuitive.

---

# 17. Mobile hero

Do not simply shrink the desktop composition.

Design a dedicated portrait layout.

Example:

`HACKISTAN`

large H symbol

`Hackistan`

`IDEAS FUEL`
`PROGRESS`

`QUETTA / PK`

`↓`

Reduce expensive 3D effects where needed.

Target smooth behavior on modern mid-range Android phones and iPhones.

Do not require orientation permissions.

---

# 18. Accessibility

Support:
- semantic HTML
- keyboard navigation
- visible focus states
- `prefers-reduced-motion`
- adequate contrast
- no essential information communicated only through motion
- clean screen-reader structure
- decorative 3D elements hidden from accessibility tree

Reduced-motion mode should replace large transitions with:
- short fades
- small translations
- instant section state changes where appropriate

---

# 19. NOW section purpose

Answer one question immediately:

**What is Hackistan doing right now?**

This is the first explicitly functional section.

It displays the current workshop.

---

# 20. Workshop data model

Do not hardcode the workshop directly in the component.

Create typed mock data.

Example:

```ts
export type WorkshopStatus = "upcoming" | "current" | "completed";

export interface Workshop {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  status: WorkshopStatus;
  startDate: string;
  endDate?: string;
  session?: number;
  totalSessions?: number;
  tags: string[];
  coverImage?: string;
  coverVideo?: string;
  location?: string;
}
```

Create a data source:
`src/data/workshops.ts`

Homepage logic:
select the workshop where:
`status === "current"`

This should later be replaceable by a CMS/database without rewriting the visual component.

---

# 21. NOW example content

Use temporary content:

`01 / NOW`

`CURRENT WORKSHOP`

# BUILD YOUR FIRST WEBSITE

`WEB / HTML / CSS / JAVASCRIPT`

`SEP 19 — OCT 03`

`SESSION 03 / 05`

Description:
`Learning how the web works by designing, building and shipping something of your own.`

CTA:
`EXPLORE WORKSHOP →`

Do not create an unfinished public workshop detail page during Phase 1.

If no route exists yet, the CTA may be present as a disabled development-only element or omitted until Phase 2.

---

# 22. NOW layout

Do not use a conventional card.

Treat the workshop as a featured work.

Desktop:
- large media region occupies roughly half or more of the viewport
- title may overlap or sit tightly beside it
- metadata sits at the edges
- use asymmetric placement
- allow typography to become part of the composition

Suggested structure:

`01 / NOW                    CURRENT`

Large workshop media

Large title:
`BUILD YOUR`
`FIRST WEBSITE`

Metadata:
`WEB / HTML / CSS / JAVASCRIPT`
`SEP 19 — OCT 03`

---

# 23. NOW media interaction

Media may:
- scale slowly with scroll
- respond subtly to pointer position
- reveal through a mask
- shift from monochrome to restrained color
- allow title layers to pass above/below media

Do not add interactions without a compositional reason.

---

# 24. Workshop status design

Status must remain clear without relying only on color.

Current:
`● CURRENT`

Upcoming:
`UPCOMING`

Completed:
`COMPLETED`

A subtle animated current indicator is acceptable.

---

# 25. End of Phase 1

After NOW, end naturally.

During development, a minimal final line may be used:
`MORE SOON.`

Do not expose "unfinished website" messaging in production.

Phase 2 will later continue directly into the Workshop archive.

---

# 26. Motion system

Define reusable timing tokens.

Suggested:

```ts
export const motion = {
  instant: 0.18,
  fast: 0.35,
  normal: 0.7,
  slow: 1.15,
  reveal: 1.4,
};
```

Use a small easing set consistently.

Recommended categories:
- standard ease
- cinematic ease
- exit ease

Build reusable primitives for:
- text reveal
- media reveal
- section entry
- page transition
- hover movement
- logo transform

---

# 27. Text reveals

Prefer clipped/masked reveals rather than pure opacity.

Example concept:

`translateY(110%) → translateY(0)`

Use subtle staggering.

Do not animate every word individually by default.

---

# 28. Cursor

Desktop only and optional.

If implemented:
- default small dot/circle
- on interactive media: `VIEW`
- on CTA: `OPEN →`

Disable on touch devices.

The website must still work perfectly with the default cursor.

---

# 29. Responsive testing

Test at minimum:
- 375 × 812
- 430 × 932
- 768 × 1024
- 1366 × 768
- 1440 × 900
- 1920 × 1080
- 2560 × 1440

Do not optimize only for one desktop screenshot.

---

# 30. Performance

Requirements:
- avoid large initial JS bundles
- lazy-load below-fold media
- use responsive images
- prefer AVIF/WebP
- compress textures
- dispose WebGL resources correctly
- avoid layout thrashing
- animate transform/opacity instead of layout properties
- keep layout shift minimal
- use dynamic import for heavy 3D components if necessary

On weaker devices reduce:
- shader complexity
- post-processing
- device pixel ratio
- texture resolution
- continuous pointer effects

---

# 31. Technology

Preferred:
- Next.js
- TypeScript
- React
- GSAP
- ScrollTrigger
- Lenis
- Three.js / React Three Fiber only where it materially improves the experience

Styling:
- CSS Modules, SCSS, or Tailwind
- choose based on precision and maintainability

Do not use a generic component framework for the public-facing design.

---

# 32. Code quality

Requirements:
- strict TypeScript
- reusable components
- data separate from presentation
- animation logic separated where practical
- shared design tokens
- no monolithic homepage component
- no unused packages
- no dead code
- no placeholder dependencies

---

# 33. Design-system requirement

The repository must include:

`/docs/design-system.md`

Treat that file as the source of truth for:
- color
- typography
- spacing
- layout
- motion
- interaction behavior
- logo usage
- media treatment
- accessibility
- responsive rules
- component conventions

Do not introduce new visual patterns in later phases without updating the design system first.

---

# 34. Core design rule

When deciding between:
- more effects
- better composition

choose better composition.

The page should still look strong when all motion is paused.

Animation should enhance design, not rescue weak layout.

---

# 35. What to learn from Alche

Study:
- oversized typography
- logo-led identity
- negative space
- transition pacing
- 2D/3D integration
- spatial composition
- motion hierarchy
- image scale
- microtypography
- subtle hover states
- minimal navigation
- restrained interface elements
- the feeling of moving through a designed environment

Do not copy:
- logo
- exact models
- exact imagery
- copywriting
- proprietary assets
- exact scene layouts
- exact shaders
- exact transitions

---

# 36. Success criteria

Phase 1 succeeds if:

## First impression
The site feels substantially more considered than a conventional student-club website.

## Identity
The viewer remembers the Hackistan H.

## Interaction
Motion feels intentional and coherent.

## Utility
Within one scroll, the visitor knows what Hackistan is currently doing.

## Performance
The experience remains smooth on mobile.

## Scalability
The structure can support workshops, projects, members, About, and Join later.

---

# 37. Do not do

Do not produce:
- generic React landing page
- centered hero with two CTAs
- three feature cards
- glass cards
- animated code backgrounds
- fake terminal windows
- particle clouds
- red Hack Club clone
- template-like sections
- excessive copy
- sound
- autoplay media with audio
- unfinished public routes

If the result resembles a generic startup landing page, redesign it.

---

# 38. Development process

Proceed in this order:

## Step 1
Inspect:
- Alche reference
- supplied Hackistan logo
- this PRD
- `docs/design-system.md`

Establish:
- typography
- grid
- palette
- spacing
- logo geometry
- motion principles

## Step 2
Build the static hero composition.

## Step 3
Implement the logo asset and subtle interaction.

## Step 4
Create the Hero → NOW scroll transition.

## Step 5
Build the static NOW section.

## Step 6
Connect the workshop data model.

## Step 7
Animate NOW.

## Step 8
Add navigation and loader.

## Step 9
Performance pass.

## Step 10
Accessibility and responsive pass.

Do not proceed to future sections.

---

# 39. Before coding

First return a concise implementation proposal covering:

1. visual concept
2. hero composition
3. H logo animation
4. Hero → NOW transition
5. typography
6. technical stack
7. desktop/mobile differences
8. performance risks

Then implement.

Do not propose multiple unrelated themes.

The direction is already defined.

---

# 40. Future roadmap — do not build yet

## Phase 1
Landing + Current Workshop

## Phase 2
Workshop archive
- Past
- Current
- Upcoming
- workshop detail pages

## Phase 3
Project archive
- project detail pages
- Workshop ↔ Project relationships
- individual projects

## Phase 4
About
- Members
- Join

## Phase 5
CMS/admin workflow
- content editing
- production optimization
- final motion polish

Build Phase 1 in a way that makes these extensions clean.
