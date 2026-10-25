from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright, expect
import shutil
import unittest
root=Path(__file__).resolve().parent.parent
html=(root/'dist/index.html').read_bytes()
headers={}
for line in (root/'dist/_headers').read_text().splitlines():
    if line.startswith('  ') and ':' in line:
        key,value=line.strip().split(':',1)
        headers[key]=value.strip()
class Handler(BaseHTTPRequestHandler):
    def log_message(self,*args): pass
    def do_GET(self):
        self.send_response(200 if self.path in ('/','/parent') else 404)
        self.send_header('Content-Type','text/html; charset=utf-8')
        if self.path == '/':
            for key,value in headers.items(): self.send_header(key,value)
        self.end_headers()
        self.wfile.write(b'<iframe src="/"></iframe>' if self.path=='/parent' else html if self.path=='/' else b'Not found')
class PackagedSecurityTests(unittest.TestCase):
    def test_headers_block_script_injection_and_framing(self):
        server=ThreadingHTTPServer(('127.0.0.1',0),Handler)
        Thread(target=server.serve_forever,daemon=True).start()
        try:
            with sync_playwright() as p:
                browser=p.chromium.launch(executable_path=shutil.which('chromium'),args=['--no-sandbox'])
                page=browser.new_page()
                base=f'http://127.0.0.1:{server.server_port}'
                page.goto(base)
                expect(page.locator('#script-fallback')).to_be_hidden()
                page.evaluate("() => { const s=document.createElement('script'); s.textContent='window.unapprovedScriptRan = true'; document.body.append(s); }")
                self.assertTrue(page.evaluate('window.unapprovedScriptRan === undefined'))
                page.goto(base+'/parent')
                page.wait_for_timeout(500)
                self.assertTrue(any(frame.url.startswith('chrome-error://') for frame in page.frames))
                browser.close()
        finally:
            server.shutdown()
            server.server_close()

if __name__ == '__main__':
    unittest.main(verbosity=2)
