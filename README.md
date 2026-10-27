# Ridho Hariadi — Hospitality & Operations Portfolio

Recruiter-focused static website for https://ridhohariadi.com/.

## Publishing

GitHub Pages publishes the root of the `main` branch. The repository default branch `master` contains an older version and is not the live source. Preserve `CNAME`, the Google verification page, project previews, and unrelated assets.

## Pages

- `index.html`: professional overview, Master of Management, experience, and digital projects.
- `background.html`: selected experience, education, and training.
- `career-summary.html`: printable career overview; browser Print / Save as PDF.
- `contact.html`: email, clipboard action with manual-copy fallback, and LinkedIn.
- `work.html`: selected digital portfolio.
- `mulan.html`, `fresh-soy-tempeh.html`, `tbc.html`: project case studies, screenshots, and interactive previews.
- `case-study.html`: legacy template URL redirects to the project index.
- `previews/`: retained interactive project websites.

## Implementation

Buildless HTML, CSS, and vanilla JavaScript. No dependency install or build step is required. Main-page styling and navigation are in `assets/styles.css` and `assets/main.js`. Project previews keep their existing assets.

## Content

Primary positioning is hospitality and operations, based in Malang, Indonesia. Highest qualification is Master of Management (NZQF Level 9), ICL Graduate Business School, Auckland, Certified 2026. Digital projects support the main career narrative. No unverified performance figures, employer endorsements, or senior cruise titles are asserted.

## Validation and rollback

Validate local links, anchors, images, JavaScript syntax, desktop/mobile layouts, and contact actions before deployment. Monitor the GitHub Pages workflow after updating `main`, then verify the custom domain. Clipboard access requires a secure origin and permission; manual copy remains available.

Rollback by reverting the redesign commit on `main`; avoid rewriting branch history. The pre-redesign live commit is `153a919a5579894e7ac7ec0f7a791a7bd5d1de6c`.
