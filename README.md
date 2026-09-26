# Hackistan Website

The Hackistan homepage is a static Next.js export. Its sections are Hero, Now, About, Upcoming, Join, and The Crew. GSAP coordinates scroll transitions; the Hero, prism, and Upcoming shelf use separate Three.js scenes with SVG/DOM fallbacks where applicable.

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

- `src/data/workshops.ts` supplies the current Boba Drops workshop. Its color banner is `public/images/boba-drops.webp`.
- `src/data/shelfItems.ts` supplies the Upcoming books. Their cover artwork lives in `public/shelf/covers/`.
- `src/data/crew.ts` supplies the public roster. Portraits live in `public/crew/`; missing files use a neutral placeholder at build time.
- Geist is self-hosted. Its SIL Open Font License is in `public/fonts/OFL.txt`.

## Launch URLs

The production origin is `https://hackistan.vercel.app`. Static builds emit a canonical URL, Open Graph/Twitter image URLs, `robots.txt`, and a homepage-only `sitemap.xml` from that origin by default. If Hackistan later moves to a custom domain, set `NEXT_PUBLIC_SITE_URL` to its HTTPS origin at build time. Do not set it to a preview deployment URL.
