import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const host = process.env.PREVIEW_HOST || '127.0.0.1';
const port = Number(process.env.PREVIEW_PORT || 4173);
const base = '/Date-invitation/';
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

const server = createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname === '/' || pathname === '/Date-invitation') {
    res.writeHead(302, { Location: base }); res.end(); return;
  }
  // Serve only the public site. Repository metadata, documentation, tests and
  // node_modules are never exposed through the local preview server.
  const relative = pathname === `${base}review.html` ? 'docs/preview.html' :
    pathname.startsWith(base) ? pathname.slice(base.length) || 'index.html' : '';
  if (!(relative === 'docs/preview.html' || /^(index\.html|assets\/(css|js|art)\/[a-zA-Z0-9._/-]+)$/.test(relative)) ||
      relative.split('/').includes('..')) {
    res.writeHead(404); res.end('Not found'); return;
  }
  try {
    const bytes = await readFile(resolve(root, relative));
    res.writeHead(200, {
      'Content-Type': mime[extname(relative)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': relative === 'docs/preview.html' ?
        "default-src 'none'; script-src 'unsafe-inline' data:; style-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'" :
        "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; font-src 'self'; media-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'",
    });
    res.end(req.method === 'HEAD' ? undefined : bytes);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(port, host, () => console.log(`Local preview: http://${host}:${port}${base}`));
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
