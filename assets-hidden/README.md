# Hidden assets

`resume.pdf` lives here so it is not copied into `dist/` or deployed while the public site is the holding page.

`npm run lint:copy` still checks this file for phone numbers.

To put the résumé back on the site, set `HOLDING` to `false` in `src/lib/site.ts` and rebuild. The build copies this file to `dist/resume.pdf`. You do not need to move it back to `public/`.
