# Hackistan Website

The Hackistan homepage is a static Next.js export. Its sections are Hero, Now, Projects&Gallery, About, Upcoming, Join, and The Crew. GSAP coordinates scroll transitions; the Hero, prism, and Upcoming shelf use separate Three.js scenes with SVG/DOM fallbacks where applicable.

## Run

Use Node.js 22 or later.

```sh
npm ci
npm run dev
npm run typecheck
npm run build
```

`npm run build` writes the deployable site to `out/`. No server runtime is required. `npm run preview` serves that export with a local-only `/__review` viewport tool; rebuild after source changes. No lint script is configured.

## Content and assets

- `src/data/workshops.ts` supplies the current workshop content. Workshop artwork lives in `public/images/`.
- `src/data/projectsGallery.ts` supplies the Projects & Gallery items. Gallery images live in `public/projects-gallery/`.
- `src/data/shelfItems.ts` supplies the Upcoming books. Their cover artwork lives in `public/shelf/covers/`.
- `src/data/crew.ts` supplies the public roster. Portraits live in `public/crew/`; missing files use a neutral placeholder at build time.
- `src/components/layout/SiteEnd.tsx` contains the footer social/contact links.
- Geist is self-hosted. Its SIL Open Font License is in `public/fonts/OFL.txt`.

## Launch URLs

The production origin is `https://www.hackistan.club/`. Static builds emit a canonical URL, Open Graph/Twitter image URLs, `robots.txt`, and a homepage-only `sitemap.xml` from that origin by default.
