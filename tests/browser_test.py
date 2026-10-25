"""Phase 2A browser evidence. Local mock data only; no live services.

Uses a fixed 2026 clock so availability remains reproducible after the invitation
expires. Screenshots use desktop Chromium and touch/mobile emulation, not devices.
"""
from datetime import datetime, timezone
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
FIXTURE_NOW = datetime(2026, 10, 25, 12, tzinfo=timezone.utc)
CLOSING_NOTE = 'One thing is for sure, i like you so much my christine.'
EXACT_NOTE = ('See you cutie, wear whatever makes you feel comfortable, okay? '
              'You don’t have to dress up or try to impress me, because honestly, '
              'I already think you’re beautiful just the way you are.')


class RomanticBrowserTests(unittest.TestCase):
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
        print('Browser:', cls.browser.version)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.terminate()
        cls.server.wait(timeout=5)
        cls.server.stderr.close()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width': 1440, 'height': 1000},
                                                timezone_id='America/Los_Angeles')
        self.errors, self.external, self.failed_assets = [], [], []
        self.context.on('page', self.observe_page)
        self.page = self.context.new_page()
        self.page.clock.install(time=FIXTURE_NOW)
        self.page.goto(BASE, wait_until='networkidle')

    def observe_page(self, page):
        page.on('pageerror', lambda error: self.errors.append(str(error)))
        page.on('console', lambda message: self.errors.append(message.text) if message.type == 'error' else None)
        page.on('request', lambda request: self.external.append(request.url)
                if request.url.startswith(('http:', 'https:')) and not
                request.url.startswith('http://127.0.0.1:4174/') else None)
        page.on('response', lambda response: self.failed_assets.append(response.url)
                if response.status >= 400 else None)

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [], 'Browser runtime errors')
        self.assertEqual(self.external, [], 'Unexpected external requests')
        self.assertEqual(self.failed_assets, [], 'Missing local site resources')

    def assert_stage(self, name, page=None):
        page = page or self.page
        expect(page.locator(f'[data-stage="{name}"]')).to_be_visible()
        self.assertEqual(page.locator('[data-stage]:visible').count(), 1)
        page.wait_for_timeout(340)  # Allow the bounded navigation transition lock to settle.

    def next(self, page=None):
        page = page or self.page
        page.locator('[data-stage]:visible [data-action="next"]').click()
        page.wait_for_timeout(340)

    def open_letter(self, page=None):
        page = page or self.page
        if page.locator('[data-stage="letter"]').is_visible():
            page.get_by_role('button',name='Open the letter',exact=True).click()
            self.assert_stage('invitation',page)

    def accept(self, page=None):
        page = page or self.page
        self.open_letter(page)
        page.get_by_role('button', name='Yes', exact=True).click()
        self.assert_stage('celebration', page)
        page.get_by_role('button', name='Okay, okay!', exact=True).click()
        self.assert_stage('scheduler', page)

    def choose_schedule(self, page=None, day='2026-10-28', time_value='18:00'):
        page = page or self.page
        page.locator('#date-trigger').click()
        if day.startswith('2026-11'):
            page.locator('[data-month="1"]').click()
        page.locator(f'[data-date="{day}"]').click()
        self.choose_time(time_value,page)

    def choose_time(self, value='18:00', page=None):
        page = page or self.page
        h,m = map(int,value.split(':'))
        for key, selected in [('hour',h%12 or 12),('minute',m),('period','PM' if h>=12 else 'AM')]:
            page.locator(f'#{key}-wheel').focus()
            page.keyboard.press('Home')
            count = (selected-1 if key=='hour' else selected if key=='minute' else 1 if selected=='PM' else 0)
            for _ in range(count): page.keyboard.press('ArrowDown')
            page.wait_for_timeout(550)
        page.locator('#time-confirm').click()
        expect(page.locator('#time-status')).to_contain_text('A lovely choice.')

    def choose_food(self, page=None):
        page = page or self.page
        for value in ('pizza', 'ramen'):
            control = page.locator(f'input[name="food"][value="{value}"]')
            if not control.is_checked():
                control.locator('..').click()
            expect(control).to_be_checked()

    def choose_activity(self, page=None, value='city-lights'):
        page = page or self.page
        control = page.locator(f'input[name="activity"][value="{value}"]')
        if not control.is_checked():
            control.locator('..').click()
        expect(control).to_be_checked()

    def finish(self, page=None):
        page = page or self.page
        page.locator('[data-stage="activity"] [data-action="preview"]').click()
        self.assert_stage('ending', page)

    def full_journey(self, page=None):
        page = page or self.page
        self.accept(page)
        self.choose_schedule(page)
        self.next(page)
        self.choose_food(page)
        self.next(page)
        self.choose_activity(page)
        self.finish(page)

    def test_yes_no_controls_and_clean_opening(self):
        self.open_letter()
        expect(self.page.locator('#invitation-title')).to_have_text('Will you go out on a date with me?')
        self.assertEqual(self.page.locator('[data-stage="invitation"] button').count(),2)
        expect(self.page.get_by_role('button',name='Yes',exact=True)).to_be_visible()
        expect(self.page.get_by_role('button',name='No',exact=True)).to_be_visible()
        self.assertEqual(self.page.locator('[data-action="decline"], .brand, .site-header, .privacy-note').count(),0)
        self.assertNotIn('Just a preview. Your choices stay in this tab.',self.page.locator('body').inner_text())
        self.assertNotIn('a little invitation.',self.page.locator('body').inner_text())
        self.accept()
        expect(self.page.locator('#scheduler-title')).to_be_focused()

    def test_font_palette_and_heart_effect_lifecycle(self):
        self.open_letter()
        self.page.evaluate('document.fonts.ready')
        families = self.page.evaluate("""() => ({
            body:getComputedStyle(document.body).fontFamily,
            heading:getComputedStyle(document.querySelector('h1')).fontFamily,
            accent:getComputedStyle(document.querySelector('.handwritten')).fontFamily,
            loaded:[document.fonts.check('14px "DM Sans"'),document.fonts.check('30px Allura'),document.fonts.check('40px Invitation')]
        })""")
        self.assertIn('DM Sans',families['body'])
        self.assertIn('Invitation',families['heading'])
        self.assertIn('Allura',families['accent'])
        self.assertTrue(all(families['loaded']))
        self.assertEqual(self.page.locator('.ambient-heart').count(),240)
        self.assertNotEqual(self.page.locator('.ambient-heart').first.evaluate('(el)=>getComputedStyle(el).animationName'),'none')
        self.page.get_by_role('button',name='Yes',exact=True).click()
        self.assert_stage('celebration')
        self.assertEqual(self.page.locator('.heart-burst-piece').count(),64)
        self.assertEqual(self.page.locator('.ambient-heart').count(),240)
        self.page.wait_for_timeout(3300)
        self.assertEqual(self.page.locator('.heart-burst-piece').count(),0)
        self.page.get_by_role('button',name='Okay, okay!',exact=True).click()
        self.assert_stage('scheduler')
        self.choose_schedule()
        self.assertEqual(self.page.locator('.selection-heart').count(),10)
        self.page.wait_for_timeout(1200)
        self.assertEqual(self.page.locator('.selection-heart').count(),0)

    def test_full_motion_starts_automatically_under_device_reduction(self):
        self.page.emulate_media(reduced_motion='reduce')
        self.assertEqual(self.page.locator('#motion-mode,#motion-panel,.scene-controls').count(),0)
        self.assertNotEqual(self.page.locator('.ambient-heart').first.evaluate('(el)=>getComputedStyle(el).animationName'),'none')
        self.open_letter()
        self.page.get_by_role('button',name='Yes',exact=True).click()
        self.assert_stage('celebration')
        self.assertEqual(self.page.locator('.heart-burst-piece').count(),64)
        self.page.get_by_role('button',name='Okay, okay!',exact=True).click()
        self.assert_stage('scheduler')
        self.choose_schedule()
        self.assertEqual(self.page.locator('.selection-heart').count(),10)

    def test_full_journey_history_focus_retention_and_exact_note(self):
        self.accept()
        self.choose_schedule()
        self.next()
        self.assert_stage('dinner')
        expect(self.page.locator('#dinner-title')).to_be_focused()
        self.choose_food()
        self.next()
        self.choose_activity(value='arcade')
        self.page.locator('[data-stage]:visible [data-action="back"]').click()
        self.assert_stage('dinner')
        expect(self.page.locator('input[name="food"][value="pizza"]')).to_be_checked()
        expect(self.page.locator('input[name="food"][value="ramen"]')).to_be_checked()
        self.page.go_back()
        self.assert_stage('scheduler')
        expect(self.page.locator('#time-status')).to_contain_text('6:00 PM')
        self.page.go_forward()
        self.assert_stage('dinner')
        self.next()
        expect(self.page.locator('input[name="activity"][value="arcade"]')).to_be_checked()
        self.finish()
        ending = self.page.locator('[data-stage="ending"]')
        expect(ending).to_contain_text('October 28, 2026')
        expect(ending).to_contain_text('6:00 PM')
        expect(ending).to_contain_text('Pizza')
        expect(ending).to_contain_text('Ramen')
        expect(ending).to_contain_text('Arcade')
        expect(ending).to_contain_text(EXACT_NOTE)
        expect(ending).to_contain_text('Sending emails your chosen date')
        self.assertEqual(self.page.locator('#journey-steps [aria-current="step"]').count(), 1)
        self.assertEqual(self.page.evaluate('localStorage.length + sessionStorage.length'), 0)
        self.assertNotIn('pizza', self.page.url)

    def test_calendar_exact_allowlist_months_and_keyboard(self):
        self.accept()
        self.page.locator('#date-trigger').click()
        days = self.page.locator('[data-date]')
        self.assertEqual(days.count(), 31)
        enabled = self.page.locator('[data-date]:enabled').evaluate_all('(els) => els.map(el => el.dataset.date)')
        self.assertEqual(enabled, ['2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31'])
        for day in ('2026-10-30', '2026-10-31'):
            expect(self.page.locator(f'[data-date="{day}"]')).to_be_enabled()
        self.page.locator('[data-date="2026-10-28"]').focus()
        self.page.keyboard.press('ArrowRight')
        expect(self.page.locator('[data-date="2026-10-29"]')).to_be_focused()
        self.page.keyboard.press('Enter')
        expect(self.page.locator('#date-trigger')).to_be_focused()
        self.page.locator('#date-trigger').click()
        self.page.locator('[data-month="1"]').click()
        self.assertEqual(self.page.locator('[data-date]:enabled').count(), 30)
        expect(self.page.locator('[data-month="1"]')).to_be_disabled()
        self.page.keyboard.press('Escape')
        expect(self.page.locator('#date-trigger')).to_be_focused()

    def test_scheduler_guards_tampered_date_and_time(self):
        self.accept()
        continue_button = self.page.locator('[data-stage="scheduler"] [data-action="next"]')
        self.page.locator('#date-trigger').click()
        self.page.locator('[data-date="2026-10-27"]').evaluate('(el) => { el.disabled = false; el.click(); }')
        continue_button.evaluate('(el) => { el.disabled = false; el.click(); }')
        self.assert_stage('scheduler')
        if self.page.locator('#calendar-panel').is_visible():
            self.page.keyboard.press('Escape')
        self.page.locator('#date-trigger').click()
        self.page.locator('[data-date="2026-10-28"]').click()
        # A date alone never commits the suggested wheel time.
        continue_button.evaluate('(el) => { el.disabled = false; el.click(); }')
        self.assert_stage('scheduler')

    def test_past_dates_and_manila_day_ignore_device_timezone(self):
        self.page.clock.set_fixed_time(datetime(2026, 10, 28, 16, 5, tzinfo=timezone.utc))
        self.page.reload()
        self.accept()
        self.page.locator('#date-trigger').click()
        expect(self.page.locator('[data-date="2026-10-28"]')).to_be_disabled()
        expect(self.page.locator('[data-date="2026-10-29"]')).to_be_enabled()
        self.page.locator('[data-date="2026-10-29"]').click()
        self.choose_time('19:00')
        self.page.clock.set_fixed_time(datetime(2026, 11, 30, 16, 1, tzinfo=timezone.utc))
        self.page.locator('[data-stage="scheduler"] [data-action="next"]').evaluate('(el) => { el.disabled = false; el.click(); }')
        self.assert_stage('scheduler')

    def test_food_optional_and_stage_can_be_disabled(self):
        self.accept()
        self.choose_schedule()
        self.next()
        self.next()
        self.assert_stage('activity')
        self.choose_activity()
        self.finish()
        def override(route):
            response = route.fetch()
            route.fulfill(response=response, body=response.text().replace('enabled: true', 'enabled: false', 1))
        self.page.route('**/config.js', override)
        self.page.reload()
        self.assertEqual(self.page.locator('#journey-steps button').count(), 6)
        self.accept()
        self.choose_schedule()
        self.next()
        self.assert_stage('activity')
        self.choose_activity(value='movie-date')
        self.finish()
        self.assertEqual(self.page.locator('[data-stage="ending"] input[name="food"]').count(), 0)

    def test_all_activities_are_single_select_and_can_be_changed(self):
        self.accept()
        self.choose_schedule()
        self.next()
        self.next()
        for value in ('city-lights', 'around-city', 'movie-date', 'arcade'):
            self.choose_activity(value=value)
            self.assertEqual(self.page.locator('input[name="activity"]:checked').count(), 1)
            expect(self.page.locator(f'input[name="activity"][value="{value}"]')).to_be_checked()
        self.finish()
        expect(self.page.locator('[data-stage="ending"]')).to_contain_text('Arcade')

    def test_refresh_direct_hash_reset_and_repeated_old_events(self):
        self.page.goto(BASE + '#ending')
        self.assert_stage('letter')
        self.open_letter()
        self.page.get_by_role('button', name='Yes', exact=True).evaluate('(button) => { button.click(); button.click(); }')
        self.assert_stage('celebration')
        self.next()
        self.choose_schedule()
        self.page.reload()
        self.assert_stage('letter')
        self.accept()
        expect(self.page.locator('#time-status')).to_contain_text('Pick your day')
        self.choose_schedule()
        self.next()
        self.choose_food()
        self.next()
        self.choose_activity()
        self.page.locator('[data-stage="activity"] [data-action="preview"]').evaluate('(button) => { button.click(); button.click(); }')
        self.assert_stage('ending')
        self.assertEqual(self.page.locator('[data-action=restart]').count(),0)
        self.page.reload()
        self.assert_stage('letter')
        self.page.go_back()
        self.assert_stage('letter')

    def test_keyboard_skip_focus_hidden_controls_and_visible_focus(self):
        self.page.keyboard.press('Tab')
        expect(self.page.get_by_role('link',name='Skip to the invitation')).to_be_focused()
        self.page.keyboard.press('Enter')
        expect(self.page.locator('#letter-title')).to_be_focused()
        self.page.keyboard.press('Tab')
        expect(self.page.get_by_role('button',name='Open the letter',exact=True)).to_be_focused()
        self.page.keyboard.press('Enter')
        self.assert_stage('invitation')
        expect(self.page.locator('#invitation-title')).to_be_focused()
        self.page.keyboard.press('Tab')
        expect(self.page.get_by_role('button',name='Yes',exact=True)).to_be_focused()
        self.assertNotEqual(self.page.locator(':focus').evaluate('(el)=>getComputedStyle(el).outlineStyle'),'none')
        self.page.keyboard.press('Enter')
        self.assert_stage('celebration')
        self.page.keyboard.press('Tab')
        self.assertTrue(self.page.evaluate('!document.activeElement.closest("[hidden]")'))

    def test_responsive_all_stages_reduced_motion_zoom_and_targets(self):
        self.page.emulate_media(reduced_motion='reduce')
        for width in (320, 390, 430, 768, 1024, 1440):
            self.page.set_viewport_size({'width': width, 'height': 900})
            self.page.goto(BASE)
            for stage in ('letter', 'invitation', 'celebration', 'scheduler', 'dinner', 'activity', 'ending'):
                self.assert_stage(stage)
                self.assertTrue(self.page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (width, stage))
                self.assertNotEqual(self.page.locator(f'[data-stage="{stage}"]').evaluate('(el) => getComputedStyle(el).animationName'), 'none')
                if stage == 'letter':
                    self.open_letter()
                elif stage == 'invitation':
                    self.page.get_by_role('button', name='Yes', exact=True).click()
                elif stage == 'scheduler':
                    self.choose_schedule()
                    self.assertTrue(self.page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (width, 'calendar'))
                    self.next()
                elif stage == 'dinner':
                    self.choose_food()
                    self.next()
                elif stage == 'activity':
                    self.choose_activity()
                    self.finish()
                elif stage != 'ending':
                    self.next()
        self.page.set_viewport_size({'width': 768, 'height': 1000})
        self.page.goto(BASE)
        self.page.evaluate('document.body.style.zoom = "2"')
        self.full_journey()
        self.assertTrue(self.page.evaluate('document.documentElement.scrollWidth <= innerWidth'))

    def test_send_is_explicit_and_uses_selected_values(self):
        requests = []
        def accept(route):
            requests.append(route.request.post_data_json)
            route.fulfill(status=200,content_type='application/json',body='{"accepted":true}')
        self.page.route('**/api/invitations',accept)
        self.full_journey()
        self.assertEqual(requests,[])
        self.assertEqual(self.page.locator('[data-action="copy"], [data-action="restart"]').count(),0)
        self.page.locator('#send-plan').evaluate('(button)=>{button.click();button.click()}')
        expect(self.page.locator('#send-status')).to_contain_text('accepted by the email service')
        expect(self.page.locator('#send-plan')).to_be_disabled()
        self.assertEqual(len(requests),1)
        self.assertEqual(requests[0],{'invitationAnswer':'yes','date':'2026-10-28','time':'18:00','foodIds':['pizza','ramen'],'activityId':'city-lights'})

    def test_send_failure_preserves_choices_and_can_retry(self):
        self.page.route('**/api/invitations',lambda route: route.fulfill(status=200,content_type='application/json',body='{"accepted":false}'))
        self.full_journey()
        self.page.locator('#send-plan').click()
        expect(self.page.locator('#send-status')).to_contain_text('couldn’t confirm')
        expect(self.page.locator('#summary-date')).to_contain_text('October 28')
        expect(self.page.locator('#summary-food')).to_contain_text('Pizza')
        expect(self.page.locator('#send-plan')).to_be_enabled()
        self.page.unroute('**/api/invitations')
        self.page.route('**/api/invitations',lambda route: route.fulfill(status=200,content_type='application/json',body='{"accepted":true}'))
        self.page.locator('#send-plan').click()
        expect(self.page.locator('#send-status')).to_contain_text('accepted by the email service')

    def test_expired_ending_is_guarded_on_focus_and_send(self):
        requests=[]
        self.page.route('**/api/invitations',lambda route: requests.append(route.request))
        self.full_journey()
        self.page.clock.set_fixed_time(datetime(2026,12,1,12,tzinfo=timezone.utc))
        self.page.locator('#send-plan').click()
        self.assert_stage('scheduler')
        self.assertEqual(requests,[])
        expect(self.page.locator('#schedule-continue')).to_be_disabled()

    def test_time_wheels_scroll_and_cover_midnight_noon_and_any_minute(self):
        self.accept()
        self.page.locator('#date-trigger').click()
        self.page.locator('[data-date="2026-10-30"]').click()
        for value,label in [('00:01','12:01 AM'),('12:37','12:37 PM'),('23:59','11:59 PM')]:
            self.choose_time(value)
            expect(self.page.locator('#time-status')).to_contain_text(label)
        self.page.locator('#minute-wheel').evaluate('(el)=>el.scrollTo({top:22*44,behavior:"instant"})')
        self.page.wait_for_timeout(400)
        expect(self.page.locator('#minute-option-22')).to_have_attribute('aria-selected','true')
        expect(self.page.locator('#time-confirm')).to_contain_text('11:22 PM')
        self.assertNotIn('Preview-only sample times',self.page.locator('body').inner_text())
        self.assertEqual(self.page.locator('#date-help,#time-help').count(),0)

    def test_single_food_mode_skip_clears_choice(self):
        def override(route):
            response = route.fetch()
            route.fulfill(response=response, body=response.text().replace('multiple: true', 'multiple: false', 1))
        self.page.route('**/config.js', override)
        self.page.reload()
        self.accept()
        self.choose_schedule()
        self.next()
        for value in ('pizza', 'ramen'):
            control = self.page.locator(f'input[name="food"][value="{value}"]')
            control.locator('..').click()
            expect(control).to_be_checked()
            self.assertEqual(self.page.locator('input[name="food"]:checked').count(), 1)
        self.page.locator('[data-action="skip-food"]').click()
        self.assert_stage('activity')
        self.page.locator('[data-stage="activity"] [data-action="back"]').click()
        self.assert_stage('dinner')
        self.assertEqual(self.page.locator('input[name="food"]:checked').count(), 0)

    def test_card_hover_and_touch_tap_feedback(self):
        self.accept()
        self.choose_schedule()
        self.next()
        card = self.page.locator('label.choice-card').filter(has=self.page.locator('input[value="pizza"]'))
        card.hover()
        self.page.wait_for_timeout(250)
        self.assertNotEqual(card.evaluate('(el) => getComputedStyle(el).transform'), 'none')
        context = self.browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
        try:
            page = context.new_page()
            self.observe_page(page)
            page.clock.install(time=FIXTURE_NOW)
            page.goto(BASE)
            self.accept(page)
            self.choose_schedule(page)
            self.next(page)
            control = page.locator('input[name="food"][value="sushi"]')
            control.locator('..').tap()
            expect(control).to_be_checked()
            control.locator('..').tap()
            expect(control).not_to_be_checked()
        finally:
            context.close()

    def test_javascript_disabled_fallback(self):
        context = self.browser.new_context(java_script_enabled=False)
        try:
            page = context.new_page()
            page.goto(BASE)
            expect(page.get_by_text('This interactive preview needs JavaScript.', exact=False)).to_be_visible()
        finally:
            context.close()

    def test_offline_single_file_preview_complete_journey(self):
        context = self.browser.new_context(reduced_motion='reduce')
        requests, errors = [], []
        try:
            page = context.new_page()
            page.clock.install(time=FIXTURE_NOW)
            page.on('request', lambda request: requests.append(request.url)
                    if request.url.startswith(('http:', 'https:')) and request.url != BASE + 'review.html' else None)
            page.on('pageerror', lambda error: errors.append(str(error)))
            # Exercise the exact standalone document, then cut all connectivity.
            page.goto(BASE + 'review.html', wait_until='networkidle')
            self.assertEqual(page.locator('#motion-mode').count(),0)
            self.assertNotEqual(page.locator('.sealed-letter-svg').evaluate('(el)=>getComputedStyle(el).animationName'),'none')
            context.set_offline(True)
            self.full_journey(page)
            expect(page.locator('[data-stage="ending"]')).to_contain_text(EXACT_NOTE)
            self.assertEqual(requests, [])
            self.assertEqual(errors, [])
        finally:
            context.close()

    def test_sealed_letter_caption_opening_and_refresh(self):
        expect(self.page.locator('#letter-title')).to_have_text('Hey, I want you to open this for me.')
        self.assert_stage('letter')
        self.assertEqual(self.page.locator('.letter-insert').evaluate('(el)=>getComputedStyle(el).opacity'),'0')
        self.assertNotEqual(self.page.locator('.sealed-letter-svg').evaluate('(el)=>getComputedStyle(el).animationName'),'none')
        expect(self.page.locator('.progress-nav')).not_to_be_visible()
        trigger=self.page.get_by_role('button',name='Open the letter',exact=True)
        trigger.click()
        expect(trigger).to_be_disabled()
        self.assert_stage('invitation')
        self.page.reload()
        self.assert_stage('letter')
        self.page.emulate_media(reduced_motion='reduce')
        self.open_letter()
        self.assert_stage('invitation')

    def test_no_dodges_mouse_keyboard_touch_without_accepting(self):
        self.open_letter()
        no=self.page.get_by_role('button',name='No',exact=True)
        previous=no.bounding_box()
        for _ in range(4):
            no.click()
            self.page.wait_for_timeout(280)
            current=no.bounding_box()
            distance=((current['x']-previous['x'])**2+(current['y']-previous['y'])**2)**.5
            self.assertGreater(distance,8)
            self.assertLessEqual(distance,42)
            slot=no.locator('..').bounding_box()
            home={'x':slot['x']+(slot['width']-current['width'])/2,'y':slot['y']+(slot['height']-current['height'])/2}
            self.assertLessEqual(((current['x']-home['x'])**2+(current['y']-home['y'])**2)**.5,34)
            self.assertGreaterEqual(current['x'],0)
            self.assertGreaterEqual(current['y'],0)
            self.assertLessEqual(current['x']+current['width'],1440)
            self.assertLessEqual(current['y']+current['height'],1000)
            self.assert_stage('invitation')
            yes=self.page.get_by_role('button',name='Yes',exact=True).bounding_box()
            self.assertFalse(current['x']<yes['x']+yes['width'] and current['x']+current['width']>yes['x'] and current['y']<yes['y']+yes['height'] and current['y']+current['height']>yes['y'])
            previous=current
        no.focus()
        self.page.keyboard.press('Enter')
        self.page.wait_for_timeout(280)
        expect(no).to_be_focused()
        self.assert_stage('invitation')
        self.page.keyboard.press('Escape')
        self.assertFalse(no.evaluate('(el)=>el.classList.contains("is-dodging")'))
        expect(no).to_be_focused()
        context=self.browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
        try:
            page=context.new_page()
            self.observe_page(page)
            page.clock.install(time=FIXTURE_NOW)
            page.goto(BASE)
            self.open_letter(page)
            for _ in range(3):
                page.get_by_role('button',name='No',exact=True).tap()
                page.wait_for_timeout(300)
                bounds=page.locator('#no-button').bounding_box()
                self.assertGreaterEqual(bounds['x'],0)
                self.assertLessEqual(bounds['x']+bounds['width'],390)
                self.assertGreaterEqual(bounds['y'],0)
                self.assertLessEqual(bounds['y']+bounds['height'],844)
                self.assert_stage('invitation',page)
            self.accept(page)
            self.assert_stage('scheduler',page)
        finally:
            context.close()

    def test_no_reduced_motion_bounds_and_zoom(self):
        self.page.emulate_media(reduced_motion='reduce')
        for width in (320,390,430,768,1024,1440):
            self.page.set_viewport_size({'width':width,'height':900})
            self.page.goto(BASE)
            self.open_letter()
            no=self.page.get_by_role('button',name='No',exact=True)
            for key in ('Enter','Space'):
                no.focus()
                self.page.keyboard.press(key)
                self.page.wait_for_timeout(240)
                bounds=no.bounding_box()
                self.assertGreaterEqual(bounds['x'],0)
                self.assertLessEqual(bounds['x']+bounds['width'],width)
                self.assertGreaterEqual(bounds['y'],0)
                self.assertLessEqual(bounds['y']+bounds['height'],900)
                self.assertNotEqual(no.evaluate('(el)=>getComputedStyle(el).transitionDuration'),'0s')
                self.assert_stage('invitation')
        self.page.set_viewport_size({'width':768,'height':1000})
        self.page.goto(BASE)
        self.page.evaluate('document.body.style.zoom="2"')
        self.open_letter()
        no=self.page.get_by_role('button',name='No',exact=True)
        no.focus()
        self.page.keyboard.press('Enter')
        bounds=no.bounding_box()
        self.assertGreaterEqual(bounds['x'],0)
        self.assertLessEqual(bounds['x']+bounds['width'],768)
        self.assertGreaterEqual(bounds['y'],0)
        self.assertLessEqual(bounds['y']+bounds['height'],1000)
        self.page.get_by_role('button',name='Yes',exact=True).click()
        self.assert_stage('celebration')

    def test_idle_choices_float_then_stop_on_interaction_and_pause(self):
        self.open_letter()
        self.page.mouse.move(1,1)
        self.page.wait_for_timeout(4700)
        self.assertTrue(self.page.locator('body').evaluate('(el)=>el.classList.contains("is-idle")'))
        yes=self.page.get_by_role('button',name='Yes',exact=True)
        self.assertEqual(yes.evaluate('(el)=>getComputedStyle(el).animationName'),'idle-option-float')
        self.page.mouse.move(22,22)
        self.assertFalse(self.page.locator('body').evaluate('(el)=>el.classList.contains("is-idle")'))
        self.page.evaluate("Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))")
        self.assertFalse(self.page.locator('body').evaluate('(el)=>el.classList.contains("is-idle")'))
        self.assertEqual(self.page.locator('.ambient-heart').first.evaluate('(el)=>getComputedStyle(el).animationPlayState'),'paused')
        self.page.evaluate("delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))")
        self.accept()
        self.choose_schedule()
        self.next()
        self.choose_food()
        self.page.mouse.move(1,1)
        self.page.wait_for_timeout(4700)
        self.assertEqual(self.page.locator('.food-grid .choice-card').first.evaluate('(el)=>getComputedStyle(el).animationName'),'idle-option-float')
        expect(self.page.locator('input[value="pizza"]')).to_be_checked()
        self.page.mouse.move(22,22)
        self.assertFalse(self.page.locator('body').evaluate('(el)=>el.classList.contains("is-idle")'))

    def test_calendar_stickers_new_dates_and_bottom_message(self):
        self.accept()
        self.assertEqual(self.page.locator('.calendar-sticker').count(),3)
        self.assertNotIn('A little day for us · highlighted dates only',self.page.locator('body').inner_text())
        for day in ['2026-10-30','2026-10-31']:
            self.page.locator('#date-trigger').click()
            self.page.locator(f'[data-date="{day}"]').click()
            expect(self.page.locator('#date-display')).to_contain_text('October '+day[-2:])
        self.choose_time('19:00')
        self.next()
        self.next()
        self.choose_activity(value='arcade')
        self.finish()
        expect(self.page.locator('#summary-date')).to_contain_text('October 31, 2026')
        expect(self.page.locator('#closing-message')).to_have_text(CLOSING_NOTE)
        self.assertTrue(self.page.locator('.closing-love-note').evaluate('(el)=>el===el.parentElement.lastElementChild'))
        expect(self.page.locator('.site-footer')).not_to_be_visible()
        expect(self.page.locator('#final-message')).to_have_text(EXACT_NOTE)

    def test_background_is_dense_bright_and_continuously_flowing(self):
        self.assertEqual(self.page.locator('.ambient-heart').count(),240)
        self.assertEqual(self.page.locator('.heart-field').count(),160)
        self.assertEqual(self.page.locator('.heart-flow').count(),80)
        field=self.page.locator('.heart-field').first
        self.assertGreaterEqual(float(field.evaluate('(el)=>getComputedStyle(el).opacity')),.3)
        self.assertEqual(field.evaluate('(el)=>getComputedStyle(el).animationName'),'visible-heart-drift')
        self.assertIn('drop-shadow',field.locator('svg').evaluate('(el)=>getComputedStyle(el).filter'))
        self.assertEqual(field.locator('svg').evaluate('(el)=>getComputedStyle(el).animationName'),'visible-heart-glow')
        flow=self.page.locator('.heart-flow').first
        self.assertEqual(flow.evaluate('(el)=>getComputedStyle(el).animationName'),'upward-heart-flow')
        before=flow.evaluate('(el)=>el.getBoundingClientRect().top')
        self.page.wait_for_timeout(750)
        after=flow.evaluate('(el)=>el.getBoundingClientRect().top')
        self.assertLess(after,before-8)
        self.assertEqual(self.page.locator('.ambient-heart').count(),240)
        self.assertTrue(self.page.evaluate('document.documentElement.scrollWidth<=innerWidth'))

        self.full_journey()
        self.page.locator('#closing-message').scroll_into_view_if_needed()
        self.assertEqual(self.page.locator('#ambient-hearts').evaluate('(el)=>getComputedStyle(el).position'),'fixed')
        self.assertAlmostEqual(self.page.locator('#ambient-hearts').bounding_box()['y'],0,delta=1)
        visible=self.page.locator('.ambient-heart').evaluate_all('(els)=>els.filter(e=>{const r=e.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth}).length')
        self.assertGreater(visible,160)

    def test_no_animation_options_and_full_motion_after_refresh(self):
        for preference in ('reduce','no-preference','reduce'):
            self.page.emulate_media(reduced_motion=preference)
            self.page.wait_for_timeout(60)
            self.assertEqual(self.page.locator('#motion-mode,#motion-panel,#motion-note,.scene-controls').count(),0)
            self.assertNotEqual(self.page.locator('.sealed-letter-svg').evaluate('(el)=>getComputedStyle(el).animationName'),'none')
            self.assertNotEqual(self.page.locator('.ambient-heart').first.evaluate('(el)=>getComputedStyle(el).animationName'),'none')
        self.page.reload()
        self.assertEqual(self.page.locator('#motion-mode').count(),0)
        self.assertEqual(self.page.locator('.ambient-heart').count(),240)
        self.assertNotEqual(self.page.locator('.letter-seal').evaluate('(el)=>getComputedStyle(el).animationName'),'none')
        self.assertEqual(self.page.evaluate('localStorage.length+sessionStorage.length'),0)

    def test_actual_screenshots_desktop_and_mobile(self):
        output = ROOT / 'docs' / 'previews' / 'live-delivery'
        output.mkdir(parents=True, exist_ok=True)
        for name, options in (
            ('desktop', {'viewport': {'width': 1440, 'height': 1000}}),
            ('mobile', {'viewport': {'width': 390, 'height': 844}, 'is_mobile': True, 'has_touch': True, 'device_scale_factor': 1}),
        ):
            context = self.browser.new_context(**options,reduced_motion='reduce')
            try:
                page = context.new_page()
                self.observe_page(page)
                page.clock.install(time=FIXTURE_NOW)
                page.goto(BASE, wait_until='networkidle')
                def capture(stage):
                    page.wait_for_timeout(1250 if stage == 'celebration' else 700)
                    page.screenshot(path=str(output / f'{name}-{stage}.png'), full_page=True)
                capture('letter')
                self.open_letter(page)
                capture('invitation')
                page.get_by_role('button',name='No',exact=True).tap() if name == 'mobile' else page.get_by_role('button',name='No',exact=True).click()
                capture('no-dodge')
                page.get_by_role('button', name='Yes', exact=True).tap() if name == 'mobile' else page.get_by_role('button', name='Yes', exact=True).click()
                self.assert_stage('celebration', page)
                capture('celebration')
                self.next(page)
                page.locator('#date-trigger').click()
                capture('calendar')
                page.locator('[data-date="2026-10-31"]').click()
                self.choose_time('18:00',page)
                capture('time')
                self.next(page)
                self.choose_food(page)
                capture('food')
                self.next(page)
                self.choose_activity(page)
                capture('activity')
                self.finish(page)
                capture('ending')
                page.locator('#closing-message').scroll_into_view_if_needed()
                page.wait_for_timeout(700)
                page.screenshot(path=str(output / f'{name}-ending-bottom.png'),full_page=False)
            finally:
                context.close()


class PreviewServerTests(unittest.TestCase):
    def test_private_repository_files_are_not_served(self):
        server = subprocess.Popen(['node', 'scripts/preview.mjs'], cwd=ROOT,
            env={**os.environ, 'PREVIEW_PORT': '4175', 'PREVIEW_HOST': '127.0.0.1'},
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
                self.assertIn("connect-src 'self'", response.headers['Content-Security-Policy'])
        finally:
            server.terminate()
            server.wait(timeout=5)


if __name__ == '__main__':
    unittest.main(verbosity=2)
