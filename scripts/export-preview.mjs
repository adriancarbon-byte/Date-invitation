// Deterministic single-file review copy of the current source, with no network dependency.
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { posix } from 'node:path';
const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const data = (mime, source) => `data:${mime};base64,${Buffer.from(source).toString('base64')}`;
const art = {};
for (const file of (await readdir(new URL('assets/art/', root))).sort()) {
  if (file.endsWith('.svg')) art[file.slice(0,-4)] = data('image/svg+xml', await read(`assets/art/${file}`));
}
const cache = new Map();
async function moduleSource(path) {
  if (cache.has(path)) return cache.get(path);
  let source = await read(path);
  for (const match of [...source.matchAll(/from '(\.\/[^']+)'/g)]) {
    const target = posix.join(posix.dirname(path), match[1]);
    const uri = data('text/javascript', await moduleSource(target));
    source = source.replaceAll(`from '${match[1]}'`, `from '${uri}'`);
  }
  if (path.endsWith('/app.js')) source = source.replace('const artPath = name => `./assets/art/${name}.svg`;', `const offlineArt = ${JSON.stringify(art)};\nconst artPath = name => offlineArt[name];`);
  cache.set(path, source);
  return source;
}
let css = await read('assets/css/app.css');
for (const file of (await readdir(new URL('assets/art/', root))).filter(name => name.endsWith('.woff2')).sort()) {
  const uri = data('font/woff2', await readFile(new URL(`assets/art/${file}`, root)));
  css = css.replaceAll(`../art/${file}`, uri);
}
let html = await read('index.html');
html = html.replace('</head>', `<!-- Bundled Cormorant Garamond font license\n${await read('assets/art/CORMORANT-LICENSE.txt')}\n-->\n</head>`);
html = html.replace('<link rel="stylesheet" href="./assets/css/app.css">', `<style>${css.replace(/<\/style/gi,'<\\/style')}</style>`);
html = html.replace('<script type="module" src="./assets/js/app.js"></script>', `<script type="module">${(await moduleSource('assets/js/app.js')).replace(/<\/script/gi,'<\\/script')}</script>`);
for (const [name, uri] of Object.entries(art)) html = html.replaceAll(`./assets/art/${name}.svg`, uri);
html = html.replace('<meta charset="UTF-8">', `<meta charset="UTF-8">\n<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' data:; style-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'">`);
if (/\b(?:src|href)="\.\/assets\//.test(html) || /url\(["']?\.\.\/art\//.test(html)) throw new Error('Offline preview still references external assets');
await mkdir(new URL('docs/',root),{recursive:true});
await writeFile(new URL('docs/preview.html',root),html);
console.log(`Offline review saved: docs/preview.html (${Buffer.byteLength(html)} bytes)`);
