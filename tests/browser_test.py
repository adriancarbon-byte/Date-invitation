"""Phase 1 browser checks. Starts its own loopback-only server; no live services."""
import os
from pathlib import Path
import shutil
import subprocess
import time
import unittest
from urllib.error import HTTPError
from urllib.request import urlopen

from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parent.parent
BASE = 'http://127.0.0.1:4174/Date-invitation/'


class FoundationBrowserTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = subprocess.Popen(
            ['node', 'scripts/preview.mjs'], cwd=ROOT,
            env={**os.environ, 'PREVIEW_PORT': '4174', 'PREVIEW_HOST': '127.0.0.1'},
            stdout=subprocess.DEVNULL, stderr=subprocess.PIPE,
        )
        for _ in range(50):
            if cls.server.poll() is not None:
                raise RuntimeError(cls.server.stderr.read().decode())
            try:
                with urlopen(BASE, timeout=1) as response:
                    if response.status == 200:
                        break
            except OSError:
                time.sleep(.1)
        else:
            cls.server.terminate()
            raise RuntimeError('Local preview server did not become ready')
        cls.playwright = sync_playwright().start()
        executable = os.environ.get('CHROMIUM_PATH') or shutil.which('chromium')
        options = {'headless': True}
        if executable:
            options.update(executable_path=executable, args=['--no-sandbox'])
        cls.browser = cls.playwright.chromium.launch(**options)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.terminate()
        cls.server.wait(timeout=5)
        cls.server.stderr.close()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width': 1440, 'height': 1000})
        self.errors = []
        self.external = []
        self.failed_assets = []
        self.context.on('page', self.observe_page)
        self.page = self.context.new_page()
        self.page.goto(BASE, wait_until='networkidle')

    def observe_page(self, page):
        page.on('pageerror', lambda error: self.errors.append(str(error)))
        page.on('request', lambda request: self.external.append(request.url)
                if not request.url.startswith('http://127.0.0.1:4174/') else None)
        page.on('response', lambda response: self.failed_assets.append(response.url)
                if response.status >= 400 else None)

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [], 'Browser runtime errors')
        self.assertEqual(self.external, [], 'External requests are forbidden')
        self.assertEqual(self.failed_assets, [], 'Failed local site resources')

    def assert_stage(self, name):
        expect(self.page.locator(f'[data-stage="{name}"]')).to_be_visible()
        self.assertEqual(self.page.locator('[data-stage]:visible').count(), 1)

    def next(self):
        self.page.locator('[data-stage]:visible [data-action="next"]').click()

    def test_full_journey_history_focus_and_sample_retention(self):
        self.next()
        self.assert_stage('dinner')
        expect(self.page.locator('#dinner-title')).to_be_focused()
        self.page.get_by_label('Sample preference').select_option('sample-b')
        self.next()
        self.assert_stage('activity')
        self.page.locator('[data-stage]:visible [data-action="back"]').click()
        self.assert_stage('dinner')
        expect(self.page.get_by_label('Sample preference')).to_have_value('sample-b')
        self.page.go_back()
        self.assert_stage('invitation')
        self.page.go_forward()
        self.assert_stage('dinner')
        self.next()
        self.next()
        self.assert_stage('scheduler')
        self.page.get_by_role('button', name='Preview the ending').click()
        self.assert_stage('ending')
        expect(self.page.locator('[data-preview-choice]')).to_have_text('A sweet little stop')
        expect(self.page.get_by_text('Nothing was submitted or sent. Your preview stays in this tab.')).to_be_visible()
        self.page.get_by_role('button', name='Start again').click()
        self.assert_stage('invitation')
        self.next()
        expect(self.page.get_by_label('Sample preference')).to_have_value('')

    def test_refresh_and_direct_hash_do_not_restore_or_leak_drafts(self):
        self.page.goto(BASE + '#ending')
        self.assert_stage('invitation')
        self.next()
        self.page.get_by_label('Sample preference').select_option('sample-a')
        self.page.reload()
        self.assert_stage('invitation')
        self.next()
        expect(self.page.get_by_label('Sample preference')).to_have_value('')
        self.assertEqual(self.page.evaluate('localStorage.length + sessionStorage.length'), 0)
        self.assertNotIn('sample', self.page.url)
        self.page.go_back()
        self.assert_stage('invitation')

    def test_keyboard_skip_focus_hidden_controls_and_decline(self):
        self.page.keyboard.press('Tab')
        expect(self.page.get_by_role('link', name='Skip to the invitation')).to_be_focused()
        self.page.keyboard.press('Enter')
        expect(self.page.locator('#invitation-title')).to_be_focused()
        self.page.keyboard.press('Tab')
        expect(self.page.get_by_role('button', name='Let’s take a look')).to_be_focused()
        self.page.keyboard.press('Enter')
        expect(self.page.locator('#dinner-title')).to_be_focused()
        self.page.keyboard.press('Tab')
        expect(self.page.get_by_label('Sample preference')).to_be_focused()
        self.page.locator('[data-action="home"]').click()
        self.page.get_by_role('button', name='Not now').click()
        self.assert_stage('declined')
        expect(self.page.locator('#declined-title')).to_be_focused()
        self.page.get_by_role('button', name='Back to the invitation').click()
        self.assert_stage('invitation')

    def test_repeated_old_button_events_do_not_skip_stages(self):
        self.page.locator('[data-stage="invitation"] [data-action="next"]').evaluate('(button) => { button.click(); button.click(); }')
        self.assert_stage('dinner')
        self.next()
        self.next()
        self.page.locator('[data-stage="scheduler"] [data-action="preview"]').evaluate('(button) => { button.click(); button.click(); }')
        self.assert_stage('ending')

    def test_responsive_layout_all_stages_and_reduced_motion(self):
        self.page.emulate_media(reduced_motion='reduce')
        for width in (320, 390, 768, 1440):
            self.page.set_viewport_size({'width': width, 'height': 900})
            self.page.goto(BASE)
            for stage in ('invitation', 'dinner', 'activity', 'scheduler', 'ending'):
                self.assert_stage(stage)
                self.assertTrue(self.page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (width, stage))
                self.assertEqual(self.page.locator(f'[data-stage="{stage}"]').evaluate('(el) => getComputedStyle(el).animationName'), 'none')
                if stage == 'scheduler':
                    self.page.get_by_role('button', name='Preview the ending').click()
                elif stage != 'ending':
                    self.next()
        self.page.set_viewport_size({'width': 768, 'height': 1000})
        self.page.goto(BASE)
        self.page.evaluate('document.body.style.zoom = "2"')
        self.assertTrue(self.page.evaluate('document.documentElement.scrollWidth <= innerWidth'))

    def test_config_can_omit_dinner_in_browser(self):
        def override(route):
            response = route.fetch()
            source = response.text().replace('enabled: true, required:', 'enabled: false, required:')
            route.fulfill(response=response, body=source)
        self.page.route('**/config.js', override)
        self.page.reload()
        self.assertEqual(self.page.locator('#journey-steps button').count(), 4)
        self.next()
        self.assert_stage('activity')

    def test_javascript_disabled_has_an_explicit_fallback(self):
        context = self.browser.new_context(java_script_enabled=False)
        try:
            page = context.new_page()
            page.goto(BASE)
            expect(page.get_by_text('This interactive preview needs JavaScript.', exact=False)).to_be_visible()
        finally:
            context.close()

    def test_offline_single_file_preview_has_no_network_dependencies(self):
        context = self.browser.new_context()
        requests = []
        errors = []
        try:
            page = context.new_page()
            page.on('request', lambda request: requests.append(request.url)
                    if request.url.startswith(('http:', 'https:')) and request.url != BASE + 'review.html' else None)
            page.on('pageerror', lambda error: errors.append(str(error)))
            # This managed browser prohibits file:// navigation. Serve the exact
            # standalone artifact as one document, then disconnect the network.
            page.goto(BASE + 'review.html', wait_until='networkidle')
            context.set_offline(True)
            page.get_by_role('button', name='Let’s take a look').click()
            page.get_by_label('Sample preference').select_option('sample-b')
            page.get_by_role('button', name='Keep exploring').click()
            page.get_by_role('button', name='A little more').click()
            page.get_by_role('button', name='Preview the ending').click()
            expect(page.locator('[data-stage="ending"]')).to_be_visible()
            expect(page.locator('[data-preview-choice]')).to_have_text('A sweet little stop')
            self.assertEqual(requests, [])
            self.assertEqual(errors, [])
        finally:
            context.close()

    def test_actual_screenshots(self):
        output = ROOT / 'docs' / 'previews'
        output.mkdir(parents=True, exist_ok=True)
        self.page.wait_for_timeout(350)
        self.page.screenshot(path=str(output / 'desktop.png'), full_page=True)
        context = self.browser.new_context(viewport={'width': 390, 'height': 844},
                                           is_mobile=True, has_touch=True, device_scale_factor=1)
        try:
            page = context.new_page()
            self.observe_page(page)
            page.goto(BASE, wait_until='networkidle')
            page.wait_for_timeout(350)
            page.screenshot(path=str(output / 'mobile.png'), full_page=True)
            page.get_by_role('button', name='Let’s take a look').tap()
            page.get_by_label('Sample preference').select_option('sample-a')
            page.wait_for_timeout(350)
            page.screenshot(path=str(output / 'mobile-sample.png'), full_page=True)
        finally:
            context.close()


class PreviewServerTests(unittest.TestCase):
    def test_private_repository_files_are_not_served(self):
        env = {**os.environ, 'PREVIEW_PORT': '4175', 'PREVIEW_HOST': '127.0.0.1'}
        server = subprocess.Popen(['node', 'scripts/preview.mjs'], cwd=ROOT, env=env,
                                  stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        try:
            for _ in range(50):
                try:
                    with urlopen('http://127.0.0.1:4175/Date-invitation/', timeout=1):
                        break
                except OSError:
                    time.sleep(.1)
            else:
                self.fail('Preview server did not start')
            for path in ('.git/config', 'README.md', 'package.json', 'node_modules/tailwindcss/package.json'):
                with self.assertRaises(HTTPError) as result:
                    urlopen('http://127.0.0.1:4175/Date-invitation/' + path)
                self.assertEqual(result.exception.code, 404)
            with urlopen('http://127.0.0.1:4175/Date-invitation/') as response:
                self.assertIn("connect-src 'none'", response.headers['Content-Security-Policy'])
        finally:
            server.terminate()
            server.wait(timeout=5)


if __name__ == '__main__':
    unittest.main(verbosity=2)
