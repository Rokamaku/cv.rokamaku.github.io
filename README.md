# cv.rokamaku.dev

Personal CV website, built with Next.js (static export) and hosted on Cloudflare Workers.

## Editing the CV

All content lives in `public/resume.json`. Both the web page and the downloadable PDF are generated
from it, so there is nothing else to update.

## Commands

- `yarn dev` - Run the site locally
- `yarn build` - Generate the PDF into `public/`, then build the static site into `out/`
- `yarn generate-cv` - Generate only the PDF
- `yarn watch-cv` - Regenerate the PDF whenever `resume.json` changes
- `yarn deploy` - Build and deploy to Cloudflare with Wrangler

## How the PDF download works

`scripts/generate-cv.js` draws the PDF from `resume.json` with PDFKit and writes it to
`public/<name>.pdf`, where the name comes from `basics.cvPdf`. The file is git-ignored and
rebuilt on every build, so it ships with the site as a static asset and the Download PDF button
links to it on the same domain.

## Hosting

The site is a static-assets-only Cloudflare Worker, configured in `wrangler.jsonc`
(assets directory `out/`, custom domain `cv.rokamaku.dev`).

Deploys run on Cloudflare through Workers Builds, connected to this repository:

- Build command: `yarn build`
- Deploy command: `npx wrangler deploy`

Every push to `master` builds and deploys; no GitHub Actions or R2 bucket are involved.
