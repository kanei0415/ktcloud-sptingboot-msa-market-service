import os

import pytest


@pytest.fixture(scope="session")
def base_url() -> str:
    return os.environ.get("E2E_BASE_URL", "http://localhost:5173")


@pytest.fixture
def browser_context_args(browser_context_args: dict, base_url: str) -> dict:
    return {**browser_context_args, "base_url": base_url}
