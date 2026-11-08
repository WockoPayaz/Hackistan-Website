# Workshop images and editing

The supplied reference banner was not used as final artwork. Simple SVG placeholders keep the layout complete until you add your own images.

## Backgrounds for the workshop tiles

- Make each image **1600 × 1000 px (8:5)**. WebP recommended; JPG/PNG also work.
- Put the main illustration in the **upper-right half**. Leave the bottom **55%**, particularly the lower-left, quiet for the title, description and button.
- Leave the top 15% quiet for the workshop number/tags and status. Keep important artwork at least 8% away from the edges.
- The button is in the lower-left, with approximately 19–32 px of padding. Do not draw text or buttons into your image: the site supplies them.
- A dark gradient is added by the site for readability. The compact cards crop images to fit their available space; keep the main subject near the center-right, not at the extreme edge.
- Save images in `public/workshops/`: `bakebuild.webp`, `boba-drops.webp`, or `vibes.webp`.
- In `src/data/workshops.ts`, change each `tileImage` from `/workshops/NAME.svg` to `/workshops/NAME.webp`. This also updates the background on that workshop's details page.

## Existing BakeBuild banner

- Recommended: **1720 × 1000 px** (approximately 1.72:1).
- Save to `public/images/bakebuild.webp`.
- In `src/data/workshops.ts`, change BakeBuild's `coverImage` to `/images/bakebuild.webp`.
- The existing banner layout crops to 4:3 on mobile. Keep important artwork in the central 70%. Avoid important details near the bottom-left where the large workshop heading overlaps on desktop; keep the bottom-right quiet for the workshop number.

## BakeBuild bookshelf cover

- Make **800 × 1200 px (2:3 portrait)**, with the full finished cover including any title you want on it.
- Save to `public/shelf/covers/bakebuild.webp`.
- In `src/data/shelfItems.ts`, change BakeBuild's `coverImage` to `/shelf/covers/bakebuild.webp`.
- The shelf uses the entire cover, so use the exact 2:3 ratio and keep lettering 6–8% from the edge.

## November 2026 uploads

Add the WebP files at these repository paths and rebuild. Empty BakeBuild slots display a numbered photo frame. Fusering and The Lost Key use line illustrations until their image files are present.

| Placement | Upload path | Recommended size |
| --- | --- | --- |
| BakeBuild photo 01 | `public/workshops/bakebuild-01.webp` | 1200 × 900, 4:3 |
| BakeBuild photo 02 | `public/workshops/bakebuild-02.webp` | 1200 × 900, 4:3 |
| BakeBuild photo 03 | `public/workshops/bakebuild-03.webp` | 1200 × 900, 4:3 |
| Fusering NOW, archive tile and detail header | `public/images/fusering-banner.webp` | 1720 × 1000, 1.72:1 |
| The Lost Key archive tile and detail header | `public/workshops/the-lost-key-cover.webp` | 1600 × 1000, 8:5 |

Keep the main subject within the central 70% of each cover and leave the lower left quiet for the site title. The NOW banner crops to 4:3 on small screens. When adding photos, update their alt text in `src/data/workshops.ts` to describe what each photo shows.

## Content and pages

`src/data/workshops.ts` supplies the NOW feature, archive tiles, static detail pages and sitemap. The shelf consumes the BakeBuild and Fusering records in `src/data/shelfItems.ts`, alongside the existing book artwork and dimensions.

Archive routes under `/workshops/` are `bakebuild/`, `boba-drops/`, `vibes/`, `fusering/` and `the-lost-key/`.

## Build

Run `npm ci`, then `npm run build`. Deploy the generated `out/` folder as before. Rebuild after changing images or content. Dependencies and generated build directories are excluded from the ZIP.

The workshop tiles sit inside the existing ProjectsGallery section, after the image rail. They use normal document flow and reserved card dimensions. The pinned About sequence begins after the archive.
