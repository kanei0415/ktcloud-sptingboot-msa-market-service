"""End-to-end smoke tests for the unauthenticated landing + sign-in flow.

Run against a live dev server:

    cd market-msa-app
    npm run dev          # in one shell
    pytest tests/e2e     # in another

Requires:
    pip install pytest-playwright
    playwright install chromium
"""

from __future__ import annotations

import re

from playwright.sync_api import Page, expect


def test_landing_renders_hero(page: Page) -> None:
    page.goto("/")

    heading = page.get_by_role("heading", level=2)
    expect(heading).to_contain_text("KT Cloud")
    expect(heading).to_contain_text("Market")
    expect(heading).to_contain_text("MSA")

    expect(page.get_by_text("확장 가능한 마이크로서비스 아키텍처를 경험하세요.")).to_be_visible()


def test_landing_feature_cards_present(page: Page) -> None:
    page.goto("/")

    for title in ("고성능 배포", "보안 안정성", "유연한 확장"):
        expect(page.get_by_role("heading", name=title)).to_be_visible()


def test_get_started_routes_unauthed_user_to_sign_in(page: Page) -> None:
    page.goto("/")

    page.get_by_role("link", name="시작하기").click()

    expect(page).to_have_url(re.compile(r"/sign-in$"))
    expect(page.get_by_role("heading", name="로그인")).to_be_visible()


def test_sign_in_form_validates_empty_submit(page: Page) -> None:
    page.goto("/sign-in")

    submit = page.get_by_role("button", name="로그인")
    expect(submit).to_be_disabled()


def test_sign_in_form_enables_submit_with_valid_input(page: Page) -> None:
    page.goto("/sign-in")

    page.get_by_label("이메일 주소").fill("test@example.com")
    page.get_by_label("비밀번호").fill("password123")

    submit = page.get_by_role("button", name="로그인")
    expect(submit).to_be_enabled()


def test_sign_in_link_to_sign_up(page: Page) -> None:
    page.goto("/sign-in")

    page.get_by_role("link", name="회원가입").click()
    expect(page).to_have_url(re.compile(r"/sign-up$"))
