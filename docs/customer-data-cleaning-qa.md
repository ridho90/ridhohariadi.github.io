# Customer Data Cleaning: validation and QA

Date: 2026-11-02. Local integration; not deployed.
Base: origin/main, 23a7ac3d9da130f8eb6ddb9999ed73ec45f00fda.

## Data audit

The nine-member supplied ZIP was extracted outside the public site. The generator was inspected, not executed. `scripts/audit_customer_data.py SOURCE_DIRECTORY` independently reproduces the CSV transformation and checks the original workbook using openpyxl. It compares all cleaned rows and all queue entries, not only aggregate counts.

| Measure | Verified result | Definition |
| --- | ---: | --- |
| Raw rows | 500 | CSV data rows, excluding header |
| Retained customer IDs | 470 | Distinct Customer_ID, not verified people |
| Excluded duplicate rows | 30 | Later occurrences of a retained ID |
| Review entries | 77 | Issue events, including duplicate exclusions |
| Missing email | 25 | Retained records with blank email |
| Missing address | 16 | Retained records with blank address |
| Quarantined registration dates | 6 | Generator's literal ambiguous marker |
| IDs touched by queue | 72 | Distinct IDs across all issue types |
| IDs with unresolved field issues | 46 | 47 nonduplicate issues; categories overlap |
| Retained spend sum | 1,197,969,255 | Invented units; source does not specify currency |

City counts: Jakarta 89, Malang 82, Surabaya 70, Yogyakarta 44, Bandung 37, Semarang 37, Bogor 35, Denpasar 31, Makassar 28, Medan 17. Total 470.

Queue reconciliation: 30 + 25 + 16 + 6 = 77. No retained date chronology errors or duplicate spend conflicts found. Workbook Clean Customers, Review Queue, 60-row Raw Sample, dashboard KPIs/city counts and README totals match the CSVs. The original workbook has zero formulas and no cell errors in either formula or cached-value mode. It is a static snapshot, not a refreshing model.

## Documented corrections and limits

- Original HTML omitted the 16 missing-address review entries in its visible exception summary. The new dashboard and PDF show all four issue types.
- Headline labels now say unique customer IDs and review entries. Multiple issues can affect the same ID; 77 is not the number of customers needing review.
- First observed raw row wins per Customer_ID. Later copies do not add spend. Source order matters; no verified timestamp-based survivorship is claimed.
- Date parsing reproduces generator conventions YYYY-MM-DD / DD-MM-YYYY / MM/DD/YYYY. Only the literal 03/04/2026 marker is quarantined. Ninety other raw slash-date field occurrences have both components <=12; their interpretation relies on the documented generator convention. The new copy corrects the original implication of general ambiguity detection without silently changing the output.
- Synthetic phone numbers resemble dialable +62 contacts. Public files omit names, email, phone and street-address values. Original contact-bearing CSVs and workbook stay outside the repository. Emails in the original use example.test; addresses are marked synthetic, but these values are also omitted.
- Public CSV keeps all 470 rows with only ID, city, dates, invented spend and missing-field indicators. Review queue preserves source-row references and generic actions. Full original source hashes appear in the metrics snapshot for provenance.
- Re-authored the PDF as two pages with all issue categories, duplicate retention rule, date caveat and privacy description. Rendered both pages with PyMuPDF and inspected them for clipping and pagination.
- Synthetic practice only, AI-assisted dataset design, no client engagement, measured revenue or growth claim.

## Verification

- `npm test`: two cleaning-rule unit tests and published-data/site consistency checks. Replaces the original deliberately failing placeholder; no dependency installation or failure suppression.
- `scripts/audit_customer_data.py`: exact original-data/workbook reconciliation passed with the document Python toolchain.
- `scripts/check_customer_site.py --base-url http://127.0.0.1:8765`: public CSV counts, field omissions, city/queue/spend totals, headline HTML values, homepage/work links, internal href/src targets, anchors and HTTP 200 checks passed.
- No build or lint scripts are defined; site is static HTML/CSS/JS. `git diff --check` is part of final validation.
- Local Chrome 128 through browser-harness and 127.0.0.1:9222 CDP; case study, homepage and work page tested at 375, 768 and 1440px. No document horizontal overflow or missing images. Mobile tables deliberately scroll inside keyboard-focusable named regions.
- Axe-core 4.10.3, WCAG 2 A / AA and 2.1 AA tags: zero violations across all nine page/viewport combinations. Color checks for decorative arrow glyphs, clipped mobile table content and existing homepage portrait text need manual interpretation; this is not a formal accessibility certification. The unsupported aria-label on the tools div was fixed by assigning role=group.
- Manual keyboard: native menu Enter opens; Escape closes and restores focus; dashboard anchor clears sticky header; ArrowRight scrolls the focused mobile table. Initial CDP Enter synthesis lacked carriage-return text and was corrected before interpreting the result as application behavior.
- Reduced-motion emulation: scroll behavior auto and transition duration 0s. New case styles add no animation.
- Runtime error, unhandled rejection, console.error and resource-failure collection during page loads: none observed. Existing shared JS remains unchanged.
- Homepage project link activated through keyboard and reached the local case study. PDF, redacted CSV, review CSV and metrics JSON return HTTP 200 with local bytes intact.
- SEO: one h1, descriptive title/meta, canonical and Open Graph tags, added sitemap URL. Home/work features include descriptive SVG alt text.
- Visual review: retained cream/forest palette, Georgia headings, original nav/footer and personal profile. Added scoped stylesheet, a native SVG project preview and one feature card above the existing project grid. Existing assets and project cards remain intact.

## Deployment boundary

No push, PR, merge, publication, hosting change or DNS write performed. Live homepage, work page, versioned CSS/JS and sitemap matched origin/main byte-for-byte during discovery. CNAME is ridhohariadi.com and DNS resolves GitHub Pages addresses. Authenticated Pages settings remain unverified: public API and logged-out settings page return 404. See deployment instructions before publishing.

## Independent review and manual contrast follow-up

A separate read-only code review found no Critical or Important issues. Its minor suggestion to enforce an exact public review-queue header allowlist was implemented. All ten city bar counts/proportions and all four review bar counts/proportions were also checked against the metric snapshot. Text contrast ratios include body 5.69:1, eyebrow 5.68:1 and ink 11.34:1. Olive large heading text is 4.43:1 (large text threshold 3:1); dark-panel labels and decorative arrows also meet applicable contrast requirements. Offscreen mobile table cells use the same checked palette. Existing homepage photo-overlay contrast remains a baseline manual-review limitation. HTTP checks compare downloaded bytes to local files, not only response status.

The final staged-file check caught CRLF CSV line endings and PDF text classification. CSV exporter now emits LF; .gitattributes classifies PDF files as binary. Data values and PDF rendering are unchanged. The staged diff is checked again before commit.
