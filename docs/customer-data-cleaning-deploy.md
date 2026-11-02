# Customer Data Cleaning: deployment handoff

This change is prepared locally on `feat/customer-data-cleaning`, based on `origin/main`. Do not deploy the repository default `master`: its content is obsolete and differs from the live site.

## Change scope

- New `/projects/customer-data-cleaning/` static case study and contact-free downloads.
- Feature card on homepage and work.html; scoped CSS and native SVG preview.
- Sitemap URL, work page metadata and relevant project introduction copy.
- Reproducible audit/PDF tools, meaningful local tests and QA report.
- No changes to personal profile text, existing site assets, worker secrets, DNS or hosting configuration.

## Before any public action

1. Review the diff and `docs/customer-data-cleaning-qa.md`.
2. Obtain explicit user approval for the intended push and deployment steps. Local preparation does not authorize a push, PR publication, merge or production update.
3. In an authenticated GitHub session, verify repository Settings > Pages publishing source. Read-only evidence already ties origin/main content and CNAME to the live site, but exact branch/root settings are not exposed to the logged-out session. If settings differ, stop and reconcile before modifying production configuration.
4. Check current remote main for new commits. Preserve any incoming work and rerun relevant checks after integrating it.
5. After approval, push the feature branch for review. Merging into the confirmed publishing branch may trigger deployment; obtain approval for that action too unless it was expressly included.

## Local checks

```
npm test
python3 scripts/check_customer_site.py --base-url http://127.0.0.1:8765
```

Serve from the repository root with `python3 -m http.server 8765 --bind 127.0.0.1` before the HTTP check.
For the original-file audit, run `scripts/audit_customer_data.py SOURCE_DIRECTORY` with a Python environment containing openpyxl. Source inputs are intentionally not committed. `--public-dir projects/customer-data-cleaning/downloads` regenerates the contact-free CSVs and metrics; inspect the diff before accepting refreshed output. `scripts/build_customer_pdf.py` requires ReportLab and regenerates the revised PDF from the published metrics.

## Post-deployment verification

The intended URL is `https://ridhohariadi.com/projects/customer-data-cleaning/`; it is not a claim of a live integration.
Verify HTTP 200 and expected title/metrics at that URL, all four downloads, homepage/work feature links, mobile navigation, missing assets and console errors in a browser. Check the public CSV headers omit contact fields. Compare page and download hashes to the reviewed release, allowing for any documented hosting transformations.
