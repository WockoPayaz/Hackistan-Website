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

- `src/data/workshops.ts` supplies the current workshop. Its credited Hack Club / Outernet image is community reference photography, not a claim to depict a Hackistan workshop. Replace it when local photography is available. Source: https://hackclub.com/press/
- `src/data/shelfItems.ts` supplies the Upcoming books. Their cover artwork lives in `public/shelf/covers/`.
- `src/data/crew.ts` supplies the public roster. Portraits live in `public/crew/`; missing files use a neutral placeholder at build time.
- Geist is self-hosted. Its SIL Open Font License is in `public/fonts/OFL.txt`.

## Launch URLs

Set `NEXT_PUBLIC_SITE_URL` to the confirmed HTTPS production origin before the final production build, for example `https://<confirmed-domain>`. The build then emits an absolute canonical URL and absolute Open Graph/Twitter image URLs for `public/og-image.png`. Do not set it to a preview deployment URL. `public/robots.txt` works without a domain; add a sitemap after the public production origin is confirmed.
