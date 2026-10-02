// Copy check, run with `npm run lint:copy`. See "Checks before every commit" in CLAUDE.md.
// Fails, naming the file and line, on:
//   - em-dashes or en-dashes anywhere in src/
//   - anything that looks like a phone number in src/ or in the text of public/resume.pdf
//   - Block, Square, Cash App or Afterpay in the support-content case study
import { readFile, readdir } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const root = new URL('..', import.meta.url).pathname;
const textTypes = new Set(['.astro', '.md', '.mdx', '.ts', '.js', '.mjs', '.css', '.json', '.svg', '.txt', '.xml', '.html']);

const dashes = /[–—]/;
// 555-123-4567, (555) 123-4567, 555.123.4567, +1 555 123 4567, 5551234567
const phone = /(?:\+?1[\s.-]?)?(?:\(\d{3}\)\s?|\b\d{3}[\s.-])\d{3}[\s.-]\d{4}\b|\b\d{10}\b/;
const brands = /\b(?:Block|Square|Cash App|Afterpay)\b/;
const supportCase = 'src/content/projects/support-content-hub/';

const problems = [];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

for await (const path of walk(join(root, 'src'))) {
  if (!textTypes.has(extname(path))) continue;
  const file = relative(root, path);
  const lines = (await readFile(path, 'utf8')).split('\n');
  lines.forEach((line, i) => {
    const where = `${file}:${i + 1}`;
    if (dashes.test(line)) problems.push(`${where}  em-dash or en-dash: ${line.trim()}`);
    if (phone.test(line)) problems.push(`${where}  looks like a phone number: ${line.trim()}`);
    if (file.startsWith(supportCase) && brands.test(line)) {
      problems.push(`${where}  names ${line.match(brands)[0]} in the support-content case study: ${line.trim()}`);
    }
  });
}

// The résumé PDF is only checked for phone numbers. Dashes are fine there.
const pdfPath = join(root, 'public/resume.pdf');
try {
  const pdf = await getDocument({ data: new Uint8Array(await readFile(pdfPath)), verbosity: 0 }).promise;
  for (let n = 1; n <= pdf.numPages; n++) {
    const { items } = await (await pdf.getPage(n)).getTextContent();
    // Rebuild lines from the text runs so a number split across runs is still caught.
    const lines = [];
    let current = '';
    for (const item of items) {
      current += item.str;
      if (item.hasEOL) { lines.push(current); current = ''; }
    }
    lines.push(current);
    lines.forEach((line, i) => {
      if (phone.test(line)) problems.push(`public/resume.pdf page ${n}, line ${i + 1}  looks like a phone number: ${line.trim()}`);
    });
  }
} catch (error) {
  if (error.code === 'ENOENT') problems.push('public/resume.pdf  is missing');
  else throw error;
}

if (problems.length) {
  console.error(`Copy check failed with ${problems.length} problem(s):\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}
console.log('Copy check passed: no dashes or phone numbers in src/, no phone number in resume.pdf, no brand names in the support-content case study.');
