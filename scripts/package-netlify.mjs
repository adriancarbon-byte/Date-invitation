import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const dist = new URL('dist/',root);
// Publish only the invitation. The public form key is read at function runtime, never bundled.
let html = await readFile(new URL('docs/preview.html',root),'utf8');
html = html.replace("connect-src 'none'", "connect-src 'self' https://api.web3forms.com");
if (!html.includes("connect-src 'self' https://api.web3forms.com") || html.includes('chatgpt.site')) throw new Error('Unexpected hosted page configuration');
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
await writeFile(new URL('index.html',dist),html);
const policy = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
await writeFile(new URL('_headers',dist),`/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: ${policy}; frame-ancestors 'none'
  X-Frame-Options: DENY
  X-Robots-Tag: noindex, nofollow, noarchive
/
  Cache-Control: no-cache
/index.html
  Cache-Control: no-cache
`);
console.log('Netlify public files ready in dist/; the email function deploys separately from netlify/functions/.');
