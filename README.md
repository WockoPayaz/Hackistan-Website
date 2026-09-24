# Hackistan — Phase 1

Next.js, React, TypeScript and GSAP. The homepage contains the site shell, a three-part SVG H, the identity scene, the H-to-workshop scroll transition, and the current workshop. This is a private review build using the supplied temporary workshop content.

## Run

```sh
npm ci
npm run dev
```

Use Node.js 22 or later. Normal development runs Next.js. `npm run build` produces the static `out/` directory. `npm run typecheck` checks strict TypeScript. No environment variables or external services are needed.

## Structure

- `docs/phase-1-prd.md` and `docs/design-system.md`: original specifications.
- `docs/reference/hackistan-original-logo.png`: original supplied logo reference.
- `src/components/brand`: shared H geometry, SVG rendering, wordmark and pointer scene.
- `src/components/sections`: separate Hero and CurrentWorkshop compositions.
- `src/components/layout`: header, native fullscreen dialog navigation and minimal closing line.
- `src/components/motion` and `src/hooks`: coordinated scroll scene and pointer behavior.
- `src/lib/motion.ts`, `easing.ts`: shared motion vocabulary.
- `src/styles`: palette, typography, grid, spacing and interaction tokens.
- `src/types/workshop.ts`: typed workshops, sessions and resources.
- `src/data/workshops.ts`: mock data and `getCurrentWorkshop`, selecting `status === "current"`.

## Content and assets

The workshop title, dates, session count and description are fixtures from the brief. The credited Hack Club / Outernet photograph is community reference imagery, not a claim to depict Hackistan's workshop. Replace it with local workshop photography when supplied. Source: https://hackclub.com/press/

WebP variants are served at 640, 960, 1440 and 1920 pixels. When adding a cover, generate the same suffix variants or replace the image-loader adapter. Geist is self-hosted; its SIL Open Font License is included at `public/fonts/OFL.txt`.

## Motion and accessibility

Native scrolling drives a reversible GSAP timeline. The actual workshop image opens through the H ridge and settles into its final composition. There is no duplicated media, WebGL, scroll interception or perpetual visual loop. Pointer effects are disabled for coarse pointers, small screens, reduced motion and lower-capability hardware.

Reduced motion uses the complete static two-section layout. Without JavaScript, both sections and anchor navigation still work. The native dialog handles focus containment and Escape; section navigation transfers focus after scrolling finishes. The first assembly lasts about 1.5 seconds and is shortened for repeat visits in the same session.

The website contains no audio code, assets, controls or dependencies.

## Review and extension

`npm run preview` serves the production export with a local-only `/__review` tool for all seven target viewport sizes, reduced-motion simulation and a sandboxed JavaScript-disabled view. It is excluded from the published output. Rebuild after changing application source; the review server serves the exported build.

The local review's reduced-motion mode supplies the preference before hydration; JavaScript-disabled mode blocks scripts in the browser sandbox. This complements, but does not replace, testing on physical mobile devices and other browser engines.

No future archive, project, member, About, Join or CMS routes are shipped. An optional workshop `href` is rendered only when a real destination is supplied. Replace the data adapter later without changing the homepage presentation.
