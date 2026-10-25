// Review artifact only: a deterministic, offline, single-file copy of this exact
// foundation. It is not a public deployment or a separate application.
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const data = (mime, source) => `data:${mime};base64,${Buffer.from(source).toString('base64')}`;

const config = data('text/javascript', await read('assets/js/config.js'));
const state = data('text/javascript', (await read('assets/js/state.js')).replace("'./config.js'", `'${config}'`));
const submission = data('text/javascript', await read('assets/js/submission.js'));
const app = (await read('assets/js/app.js'))
  .replace("'./config.js'", `'${config}'`)
  .replace("'./state.js'", `'${state}'`)
  .replace("'./submission.js'", `'${submission}'`);
let html = await read('index.html');
html = html.replace('<link rel="stylesheet" href="./assets/css/app.css">',
  `<style>${(await read('assets/css/app.css')).replace(/<\/style/gi, '<\\/style')}</style>`);
html = html.replace('<script type="module" src="./assets/js/app.js"></script>',
  `<script type="module">${app.replace(/<\/script/gi, '<\\/script')}</script>`);
for (const name of ['flower', 'envelope']) {
  html = html.replaceAll(`./assets/art/${name}.svg`, data('image/svg+xml', await read(`assets/art/${name}.svg`)));
}
html = html.replace('<meta charset="UTF-8">', `<meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' data:; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'">`);
if (/\b(?:src|href)="\.\/assets\//.test(html)) throw new Error('Offline preview still references external assets');
await mkdir(new URL('docs/', root), { recursive: true });
await writeFile(new URL('docs/preview.html', root), html);
console.log('Offline review preview saved: docs/preview.html (no server or installation required)');
