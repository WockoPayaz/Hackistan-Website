# Hackistan Website Design System

**Version:** 1.0  
**Status:** Source of truth for all public-facing Hackistan website design and interaction  
**Scope:** Phase 1 onward  
**Primary reference:** Alche Studio's level of visual polish and interaction discipline, translated into an original Hackistan identity

---

# 1. Purpose

This document defines the visual and interaction system for the Hackistan website.

Every new page, component, animation, archive, project page, workshop page, member page, or CMS-driven block must follow this system unless the design system is intentionally revised first.

The website should feel like one coherent environment rather than a collection of separately designed pages.

The core identity is built around:

- the Hackistan **H**
- the mountain-shaped center bridge
- large editorial typography
- controlled negative space
- black/off-white contrast
- restrained media
- subtle dimensionality
- spatial transitions
- minimal interface chrome
- consistent motion

The design must remain recognizable as Hackistan even when the H logo is not visible.

---

# 2. Core design principles

## 2.1 Composition before decoration

Every section must work as a static composition before animation is added.

Do not use motion to compensate for weak hierarchy.

## 2.2 Restraint creates impact

Use fewer elements at larger scale.

Prefer:
- one large title
- one strong image
- one precise metadata block

over:
- many cards
- many buttons
- many decorative effects

## 2.3 The logo is a system, not a sticker

The H can:
- anchor compositions
- become a mask
- become a transition
- break into geometric parts
- create framing
- establish spatial depth

It should not merely sit in a corner.

## 2.4 Typography is visual structure

Large type is not only content. It is part of the page geometry.

Text may:
- align to media edges
- intersect images
- stretch across multiple grid columns
- create rhythm between scenes

## 2.5 Motion should feel physical

Movement should have:
- weight
- direction
- continuity
- hierarchy

Avoid arbitrary bouncing, spinning, or looping.

## 2.6 Utility must remain obvious

Even when the interface is experimental, visitors should be able to answer:
- where am I?
- what is this?
- what is clickable?
- what is happening now?
- how do I reach the next section?

## 2.7 No sound

Hackistan's website is fully silent.

No design pattern should depend on audio feedback.

---

# 3. Brand assets

## 3.1 Primary symbol

The primary symbol is the geometric H containing an angular mountain-like bridge.

Internally treat it as three layers:

- `logo-left`
- `logo-bridge`
- `logo-right`

This allows motion and composition without redrawing the mark.

## 3.2 Wordmark

Primary text wordmark:

`Hackistan`

The wordmark should generally remain horizontally oriented.

Avoid:
- outlines
- gradients
- faux chrome
- glow effects
- excessive letter distortion

## 3.3 Supporting phrase

Preferred:
`IDEAS FUEL PROGRESS`

Use sparingly.

Appropriate locations:
- hero
- brand/about page
- print-style compositions
- footer lockup

Do not place it under the logo everywhere.

## 3.4 Logo clear space

Minimum clear space around the H:
approximately the width of one vertical pillar.

Do not allow body copy, controls, or unrelated icons to enter this space in static layouts.

Transitions may temporarily break this rule.

## 3.5 Minimum sizes

H symbol:
- desktop UI: minimum 24 px high
- mobile UI: minimum 22 px high
- favicon/app icon: simplified variant allowed if necessary

Wordmark:
- minimum rendered height: about 18 px

## 3.6 Logo color

Preferred:
- off-white on near black
- near black on warm off-white

Secondary:
- monochrome gray when intentionally de-emphasized

Do not create multiple arbitrary colored logo variants.

---

# 4. Color system

Use CSS custom properties.

```css
:root {
  --color-bg: #0B0C0D;
  --color-bg-soft: #111214;
  --color-fg: #F2F0EA;
  --color-fg-muted: #9C9C98;
  --color-surface-light: #EAE8E1;
  --color-surface-light-soft: #DDDAD2;

  --color-line-dark: rgba(242, 240, 234, 0.18);
  --color-line-light: rgba(11, 12, 13, 0.14);

  --color-overlay-dark: rgba(11, 12, 13, 0.62);
  --color-overlay-light: rgba(242, 240, 234, 0.68);

  --color-atmos-lavender: #B8B2C6;
  --color-atmos-pink: #C4AAA9;
  --color-atmos-blue: #AEB7C2;
}
```

## 4.1 Background usage

Primary site background:
`--color-bg`

Use warm light surfaces only for intentional scene changes.

A light section should feel like a deliberate tonal shift, not an alternating zebra pattern.

## 4.2 Accent policy

Atmospheric colors are not general UI accent colors.

They may appear in:
- image lighting
- subtle gradients
- blurred background fields
- 3D reflections
- hover tinting

Do not use them for every CTA.

## 4.3 Status colors

Do not rely only on color.

Status is primarily communicated by text.

If subtle colors are added later:
- Current: warm off-white
- Upcoming: muted blue-gray
- Completed: muted gray

The label remains mandatory.

---

# 5. Typography

## 5.1 Font roles

Use two roles maximum.

### Display / primary
Modern grotesk / geometric sans-serif.

### Utility / metadata
The same family may be used with:
- uppercase
- smaller size
- stronger tracking
- medium weight

Avoid adding a second font unless it clearly adds value.

## 5.2 Recommended implementation

Use a legally usable variable font where possible.

Preferred qualities:
- large x-height
- clean lowercase
- neutral proportions
- excellent rendering at 12–160 px
- multiple weights

## 5.3 Type tokens

Example:

```css
:root {
  --font-sans: "Geist", "Inter", "Helvetica Neue", Arial, sans-serif;

  --text-xs: clamp(0.68rem, 0.62rem + 0.12vw, 0.78rem);
  --text-sm: clamp(0.78rem, 0.72rem + 0.16vw, 0.9rem);
  --text-md: clamp(0.95rem, 0.88rem + 0.25vw, 1.12rem);
  --text-lg: clamp(1.2rem, 1rem + 0.7vw, 1.8rem);
  --text-xl: clamp(1.8rem, 1.2rem + 2vw, 3rem);
  --text-2xl: clamp(3rem, 2rem + 4vw, 6rem);
  --text-display: clamp(4.5rem, 8vw, 10rem);
  --text-display-xl: clamp(5.5rem, 12vw, 14rem);
}
```

## 5.4 Display style

Large headings:
- weight: 400–500
- tracking: `-0.03em` to `-0.055em`
- line-height: `0.88–0.98`

Avoid very heavy 800/900 weights unless used intentionally for one composition.

## 5.5 Body style

Body:
- 15–19 px depending on viewport
- line-height: `1.45–1.65`
- max width: approximately `42–62ch`

Do not allow paragraphs to run full width.

## 5.6 Metadata style

Utility labels:
- uppercase
- tracking: `0.18em–0.32em`
- weight: 500
- font size: 10–13 px desktop
- line-height: 1.3–1.5

Examples:
`01 / NOW`
`CURRENT WORKSHOP`
`SEP 19 — OCT 03`

## 5.7 Number formatting

Section numbers:
- `01`
- `02`
- `03`

Use leading zeroes consistently.

Dates:
`SEP 19 — OCT 03`

Avoid mixed date styles on the same page.

---

# 6. Spacing system

Use a controlled scale.

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --space-8: 4rem;
  --space-9: 6rem;
  --space-10: 8rem;
  --space-11: 12rem;
  --space-12: 16rem;
}
```

Use large vertical space generously.

Typical section padding:
- desktop: 8–16rem
- tablet: 6–10rem
- mobile: 4–7rem

Do not compress sections merely to show more content above the fold.

---

# 7. Layout grid

## 7.1 Desktop

Use a 12-column grid.

Suggested:
- outer margin: 32–64 px depending on width
- gutter: 16–28 px
- max content width: 1800–2200 px for large screens

## 7.2 Tablet

8-column grid.

## 7.3 Mobile

4-column grid.

Outer margin:
- 18–24 px

## 7.4 Alignment rule

Elements should align to:
- grid lines
- media edges
- typographic baselines
- other intentional anchors

Avoid arbitrary floating positions.

## 7.5 Full-bleed elements

Images, masks, and transitions may break the grid.

Metadata and navigation generally should not.

---

# 8. Section anatomy

Most major sections should contain some combination of:

1. section number
2. small label
3. primary title
4. media
5. supporting copy
6. metadata
7. CTA

Not every section needs all seven.

The system should feel consistent through repeated relationships rather than repeated identical templates.

---

# 9. Hero system

## 9.1 Purpose

The hero is a brand scene, not an information dump.

## 9.2 Required elements

- H symbol
- Hackistan wordmark
- Quetta / Pakistan locator text
- supporting phrase or descriptor
- scroll cue

## 9.3 Composition

Avoid:
- centered stack
- boxed content
- obvious marketing layout

Prefer:
- asymmetry
- edge labels
- oversized symbol
- controlled overlaps
- independent motion layers

## 9.4 Hero motion

Permitted:
- small parallax
- logo assembly
- shallow depth
- masked transitions
- subtle scale

Avoid:
- free rotation
- constant bobbing
- endless loops
- dramatic physics simulation

---

# 10. Workshop feature system

## 10.1 Current workshop

The NOW section uses a "featured editorial work" treatment.

Never present the current workshop as a small card.

## 10.2 Required metadata

- section number
- status
- title
- tags
- date range
- short description
- optional session count
- media
- CTA when destination exists

## 10.3 Title scale

Current workshop title should be one of the largest text elements on the page.

## 10.4 Tags

Use inline text:
`WEB / HTML / CSS / JAVASCRIPT`

Avoid pill badges in the public-facing design.

## 10.5 Status

Format:
`● CURRENT`

or:
`CURRENT`

Use subtle motion only for current.

---

# 11. Future workshop archive system

For later phases.

Archive entries may alternate:
- large image left / type right
- type left / image right
- full-width feature
- horizontal composition

Maintain consistent metadata placement.

Do not turn the archive into a grid of identical rounded cards.

Filters:
`ALL / CURRENT / PAST / UPCOMING`

Style as text navigation, not select menus on desktop.

Mobile may use horizontal scrolling or a compact segmented list.

---

# 12. Future project system

Projects should feel visually related to workshop entries but slightly more expressive.

Required project metadata:
- title
- creators
- short description
- tags
- date
- origin type
- workshop relationship if applicable
- cover media
- project URL if available
- source URL if available

Origin values:
- `workshop`
- `individual`
- `hackathon`
- `club-project`

Display relationship clearly:
`MADE DURING — ARDUINO FROM ZERO`

or:
`INDIVIDUAL PROJECT`

---

# 13. Media system

## 13.1 Image direction

Prefer:
- documentary club photography
- project closeups
- screens
- hands building
- workshop environments
- material textures

Avoid:
- generic stock imagery
- fake AI-tech imagery
- random code screenshots
- cheesy hacker photos

## 13.2 Cropping

Use strong intentional crops.

Possible aspect ratios:
- 16:9
- 4:3
- 3:4
- 1:1
- cinematic 2.2:1 for select heroes

Avoid using every image at its natural ratio.

## 13.3 Image treatment

Allowed:
- slight desaturation
- soft contrast
- monochrome-to-color hover
- grain
- subtle blur at transition moments

Avoid aggressive filters.

## 13.4 Video

Muted visual video may be used later if useful.

Requirements:
- always muted
- no audio track required
- autoplay only when permitted
- pause offscreen
- poster image fallback
- reduced-motion alternative

---

# 14. Motion system

## 14.1 Timing tokens

```ts
export const motion = {
  instant: 0.18,
  fast: 0.35,
  normal: 0.7,
  slow: 1.15,
  reveal: 1.4,
  scene: 1.8,
};
```

## 14.2 Easing tokens

Keep to a small set.

Example:

```ts
export const ease = {
  standard: [0.22, 1, 0.36, 1],
  cinematic: [0.16, 1, 0.3, 1],
  exit: [0.76, 0, 0.24, 1],
};
```

Exact implementation may differ by library.

## 14.3 Hierarchy

Primary motion:
- page/section transitions
- logo transformations
- major media reveals

Secondary motion:
- title reveal
- metadata movement
- image parallax

Tertiary motion:
- hover states
- cursor responses
- status pulse

Do not run all levels at once.

## 14.4 Reveal patterns

Preferred:
- clip reveal
- translate reveal
- mask reveal
- scale from 1.03 to 1
- opacity as secondary support

Avoid opacity-only reveals for major content.

## 14.5 Scroll motion

Scroll-linked effects should remain subtle.

A user should never struggle to reach content because an animation is controlling the scroll.

## 14.6 Reduced motion

When `prefers-reduced-motion: reduce`:
- disable parallax
- disable continuous pointer transforms
- replace mask zooms with short fades
- eliminate long scroll-bound sequences
- preserve all content

---

# 15. Interaction states

## 15.1 Hover

Hover changes should be:
- immediate enough to feel responsive
- subtle enough to remain premium

Typical changes:
- text shift by 2–6 px
- underline expansion
- image scale 1.00 → 1.025
- opacity shift
- subtle cursor label

Avoid dramatic hover transforms.

## 15.2 Active

Links/buttons may compress by approximately 1–2%.

## 15.3 Focus

Keyboard focus must be clearly visible.

Preferred:
- 1 px or 2 px outline
- offset from content
- high contrast
- no removal of default focus without replacement

## 15.4 Disabled

Use:
- lower contrast
- no hover animation
- cursor state that indicates inactivity

Do not leave dead links styled like active links.

---

# 16. Links and CTAs

Primary CTA style:
text + directional arrow.

Examples:
`EXPLORE WORKSHOP →`
`VIEW PROJECT →`
`JOIN HACKISTAN →`

Avoid filled rounded buttons by default.

Possible treatments:
- underline reveal
- line expansion
- arrow translation
- text clip swap

Use filled buttons only where functional clarity truly requires them.

---

# 17. Navigation system

## 17.1 Desktop header

Minimal:
- wordmark or H at left
- menu control at right

Header may sit over content.

## 17.2 Menu overlay

Fullscreen or near-fullscreen.

Large navigation labels:
`01 TOP`
`02 NOW`
`03 WORKSHOPS`
`04 PROJECTS`
`05 ABOUT`
`06 JOIN`

Do not crowd the overlay with secondary information.

## 17.3 Mobile menu

Same visual language, simplified for touch.

Ensure targets are at least 44×44 px.

---

# 18. Dividers and borders

Use 1 px hairlines.

Never use heavy panel borders around every component.

Dividers should organize:
- metadata rows
- archive entries
- footer structures
- dense functional areas

Opacity should remain subtle.

---

# 19. Radius policy

Default radius:
`0px`

Small functional UI may use:
`2–6px`

Do not use large 16–32 px rounded cards as a default design motif.

The site should feel architectural rather than bubbly.

---

# 20. Shadows

Avoid conventional UI drop shadows.

If depth is needed:
- use lighting
- tonal separation
- blur
- overlays
- soft environmental shadow in 3D

Do not create floating SaaS cards.

---

# 21. Grain / texture

Use one global grain implementation.

Recommended:
- fixed overlay
- very low opacity
- pointer-events none
- GPU-friendly

Avoid stacking multiple texture layers.

---

# 22. 3D usage rules

Use 3D only when it:
- reinforces the H identity
- creates spatial continuity
- improves the hero
- helps transitions

Do not use 3D because it is available.

Target:
- shallow depth
- restrained camera motion
- simple materials
- minimal geometry
- low shader complexity

Mobile should have a simplified fallback.

---

# 23. Cursor system

Optional.

Desktop only.

States:
- default dot
- `VIEW`
- `OPEN →`
- optional drag state for future horizontal archives

Never hide the OS cursor unless the custom cursor is fully functional.

Touch devices use no custom cursor.

---

# 24. Responsive principles

## 24.1 Desktop
Use scale, negative space, and asymmetry.

## 24.2 Tablet
Reduce overlap complexity.

Preserve:
- hierarchy
- typography
- image scale
- motion character

## 24.3 Mobile
Recompose, do not shrink.

Changes may include:
- stacking metadata
- reducing logo depth
- simplifying transitions
- removing pointer-reactive effects
- increasing body copy width relative to viewport
- preserving large type

Mobile should still feel designed, not like a fallback.

---

# 25. Breakpoints

Suggested:

```css
--bp-sm: 480px;
--bp-md: 768px;
--bp-lg: 1024px;
--bp-xl: 1440px;
--bp-2xl: 1920px;
```

Prefer content-driven breakpoints over blindly targeting devices.

---

# 26. Accessibility

Minimum requirements:
- WCAG-aware contrast
- keyboard operability
- visible focus
- semantic headings
- proper landmarks
- alt text
- decorative assets hidden appropriately
- reduced-motion support
- no information encoded only by color
- no interaction that depends solely on hover
- touch targets at least 44 px

Large experimental visuals must not interfere with document order.

---

# 27. Performance budget

Aim for:
- fast first meaningful paint
- minimal layout shift
- no blocking 3D bundle on low-end devices if avoidable
- lazy-loaded below-fold media
- responsive images
- optimized fonts
- no unnecessary third-party scripts

3D:
- dynamically import where possible
- cap device pixel ratio
- simplify mobile materials
- dispose resources
- pause animation when page is hidden

---

# 28. Design tokens

Recommended file:
`src/styles/tokens.css`

Example:

```css
:root {
  --color-bg: #0B0C0D;
  --color-fg: #F2F0EA;
  --color-muted: #9C9C98;
  --color-surface-light: #EAE8E1;

  --font-sans: "Geist", "Inter", sans-serif;

  --radius-none: 0px;
  --radius-sm: 4px;

  --line-dark: rgba(242, 240, 234, 0.18);
  --line-light: rgba(11, 12, 13, 0.14);

  --page-x: clamp(1.125rem, 2.6vw, 4rem);
  --section-y: clamp(5rem, 10vw, 12rem);

  --z-base: 0;
  --z-media: 10;
  --z-nav: 100;
  --z-cursor: 500;
  --z-transition: 1000;
}
```

---

# 29. Component naming

Use semantic names.

Good:
- `Hero`
- `HackistanMark`
- `CurrentWorkshop`
- `WorkshopMeta`
- `SectionLabel`
- `MediaReveal`
- `FullscreenMenu`

Avoid:
- `CoolSection`
- `FancyCard`
- `Thing`
- `Section2`

---

# 30. Animation architecture

Prefer reusable hooks/utilities.

Suggested:
- `useReducedMotionPreference`
- `usePointerParallax`
- `useSectionReveal`
- `useLogoTransition`

Keep GSAP timelines near the component they control unless the transition spans multiple page sections.

Shared timings/eases belong in:
`src/lib/motion.ts`

---

# 31. Content architecture

Separate structured content from components.

Suggested:
- `src/data/workshops.ts`
- `src/data/projects.ts` later
- `src/data/members.ts` later

Do not embed important content inside animation code.

---

# 32. Workshop schema

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

Later extend with:
- sessions
- resources
- gallery
- leaders
- linked projects

---

# 33. Project schema direction

Future:

```ts
export type ProjectOrigin =
  | "workshop"
  | "individual"
  | "hackathon"
  | "club-project";

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  creators: string[];
  date: string;
  tags: string[];
  origin: ProjectOrigin;
  workshopId?: string;
  coverImage?: string;
  gallery?: string[];
  projectUrl?: string;
  sourceUrl?: string;
}
```

---

# 34. Section transitions

Every transition should answer:
**What visual element from the outgoing scene becomes the anchor of the incoming scene?**

Preferred anchors:
- H geometry
- title baseline
- image edge
- mask
- section number

Avoid:
- random wipe directions
- unrelated page flashes
- repeated full-screen fades

---

# 35. Dark/light scene transitions

If a future section changes to light mode:
- transition should be gradual or spatial
- update text colors as a coordinated scene change
- do not simply toggle background between sections with no visual reason

Light scenes should be rare enough to feel intentional.

---

# 36. Empty states

Future dynamic content may occasionally be missing.

Examples:
- no current workshop
- no upcoming workshop
- no project image

Empty states should remain elegant.

Example:
`NO ACTIVE WORKSHOP`
`NEXT PROGRAM ANNOUNCEMENT SOON.`

Do not show broken cards or blank placeholders.

---

# 37. Loading states

Use minimal placeholders.

Do not use generic skeleton-card UI on the public site.

For media:
- solid neutral field
- subtle grain
- optional tiny loading indicator

For the initial page:
- logo assembly loader

---

# 38. Error states

Keep simple:
`SOMETHING DIDN'T LOAD.`

Offer:
`TRY AGAIN →`

Avoid technical error dumps in production.

---

# 39. Footer direction

Future footer should feel like a closing scene.

Possible content:
- Hackistan wordmark
- Quetta, Pakistan
- Hack Club relationship
- social links
- contact/join
- copyright
- small H symbol

Avoid multi-column corporate sitemap unless necessary.

---

# 40. Content tone

Writing should be:
- concise
- confident
- youthful
- direct
- not corporate
- not gimmicky

Avoid:
- "innovation ecosystem"
- "empowering the next generation"
- "cutting-edge solutions"
- generic startup language

Prefer:
- concrete descriptions
- what people are building
- what the workshop is
- what visitors can do

---

# 41. Do / don't summary

## Do
- use large type
- use negative space
- treat the H as a spatial device
- keep metadata precise
- use real club/project media
- build restrained motion
- design mobile intentionally
- maintain strong hierarchy
- prioritize performance

## Don't
- use Hack Club red as the dominant theme
- use green terminal visuals
- use glassmorphism
- use rounded SaaS cards
- use random particles
- use sound
- autoplay audio
- add visual effects without purpose
- copy Alche's proprietary assets
- make mobile a scaled-down desktop

---

# 42. Visual QA checklist

Before approving any new section:

### Composition
- Does the section work without animation?
- Is there one obvious focal point?
- Is whitespace intentional?
- Are alignments clean?

### Typography
- Are display sizes consistent?
- Are labels using the correct tracking?
- Is body copy readable?
- Is hierarchy clear?

### Color
- Is the palette restrained?
- Is contrast sufficient?
- Are atmospheric accents used sparingly?

### Motion
- Is there a reason for each animation?
- Are timings consistent?
- Does reduced motion work?
- Is scrolling still natural?

### Interaction
- Are clickable elements obvious?
- Do hover/focus states exist?
- Does touch work?
- Are dead links avoided?

### Performance
- Is heavy media lazy-loaded?
- Is 3D necessary?
- Is mobile smooth?
- Are resources paused/disposed when offscreen?

### Brand
- Does it feel like Hackistan?
- Is the H used meaningfully?
- Does the section belong to the same world as the hero?

---

# 43. Governance rule

Any future design change that introduces:
- a new color
- a new font
- a new card pattern
- a new animation style
- a new button type
- a new spacing convention
- a new interaction pattern

must either:
1. map to an existing token/pattern in this file, or
2. update this design system first.

This prevents later phases from drifting into a different visual language.

---

# 44. Final design character

The finished Hackistan site should feel like:

**an experimental creative studio website that happens to belong to a student technology community.**

It should not feel like:

**a school club template with fancy effects.**

The distinction is fundamental.
