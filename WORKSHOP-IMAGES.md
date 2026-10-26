# Workshop images and editing

The supplied reference banner was not used as final artwork. Simple SVG placeholders keep the layout complete until you add your own images.

## Backgrounds for the workshop tiles

- Make each image **1600 × 1000 px (8:5)**. WebP recommended; JPG/PNG also work.
- Put the main illustration in the **upper-right half**. Leave the bottom **55%**, particularly the lower-left, quiet for the title, description and button.
- Leave the top 15% quiet for the workshop number/tags and status. Keep important artwork at least 8% away from the edges.
- The button is in the lower-left, with approximately 19–32 px of padding. Do not draw text or buttons into your image: the site supplies them.
- A dark gradient is added by the site for readability. The compact cards crop images to fit their available space; keep the main subject near the center-right, not at the extreme edge.
- Save images in `public/workshops/`: `bakebuild.webp`, `boba-drops.webp`, `vibes.webp`, `fusering.webp`.
- In `src/data/workshops.ts`, change each `tileImage` from `/workshops/NAME.svg` to `/workshops/NAME.webp`. This also updates the background on that workshop's details page.

## Current BakeBuild banner

- Recommended: **1720 × 1000 px** (approximately 1.72:1).
- Save to `public/images/bakebuild.webp`.
- In `src/data/workshops.ts`, change BakeBuild's `coverImage` to `/images/bakebuild.webp`.
- The existing banner layout crops to 4:3 on mobile. Keep important artwork in the central 70%. Avoid important details near the bottom-left where the large workshop heading overlaps on desktop; keep the bottom-right quiet for the workshop number.

## BakeBuild bookshelf cover

- Make **800 × 1200 px (2:3 portrait)**, with the full finished cover including any title you want on it.
- Save to `public/shelf/covers/bakebuild.webp`.
- In `src/data/shelfItems.ts`, change BakeBuild's `coverImage` to `/shelf/covers/bakebuild.webp`.
- The shelf uses the entire cover, so use the exact 2:3 ratio and keep lettering 6–8% from the edge.

## Content and pages

`src/data/workshops.ts` controls tiles, workshop pages, dates, descriptions, resource links and accepted submission totals. `src/data/shelfItems.ts` controls bookshelf text and covers. Keep these two records in sync when changing workshop status.

Pages: `/workshops/bakebuild/`, `/workshops/boba-drops/`, `/workshops/vibes/`, `/workshops/fusering/`.

BakeBuild dates are intentionally unspecified. Boba Drops is marked concluded for 19–27 October 2026 with 12 accepted submissions, as requested. Its details page links to the supplied Hack Club club page.

## Build

Run `npm ci`, then `npm run build`. Deploy the generated `out/` folder as before. Rebuild after changing images or content. Dependencies and generated build directories are excluded from the ZIP.

The workshop tiles sit inside the existing ProjectsGallery section, after the image rail. They use normal document flow and reserved card dimensions. The About/prism/shelf/join scroll animation files and their distances are unchanged; the animation begins at the new section boundary.
