import { test, expect, type Page } from '@playwright/test';

const DEMO_BACKEND = process.env.DEMO_BACKEND ?? 'http://localhost:8100';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? 'demo-pass-1234';
const DEMO_NAME = process.env.DEMO_NAME ?? '데모 사용자';
const STEP_PAUSE = Number(process.env.DEMO_STEP_PAUSE_MS ?? 1200);
const NARRATION_PAUSE = Number(process.env.DEMO_NARRATION_PAUSE_MS ?? 2000);

const stamp = Date.now();
const DEMO_EMAIL = process.env.DEMO_EMAIL ?? `demo+${stamp}@kt.com`;

const beat = async (page: Page, ms: number = STEP_PAUSE) => {
  await page.waitForTimeout(ms);
};

const narrate = async (page: Page, message: string) => {
  console.log(`▶︎ ${message}`);
  await beat(page, NARRATION_PAUSE);
};

test.beforeAll(async ({ request }) => {
  const res = await request.get(DEMO_BACKEND).catch((err) => {
    throw new Error(
      `Backend not reachable at ${DEMO_BACKEND}. Start it first (Swagger UI: ${DEMO_BACKEND}/webjars/swagger-ui/index.html). Cause: ${err.message}`,
    );
  });
  if (res.status() >= 500) {
    throw new Error(`Backend at ${DEMO_BACKEND} returned ${res.status()}`);
  }
});

test('full UX demo — every use case, paced for screen capture', async ({ page }) => {
  test.setTimeout(5 * 60 * 1000);

  // 1) Landing (unauthenticated) ─────────────────────────────────────────────
  await narrate(page, 'Step 1 — Landing page, unauthenticated.');
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /KT Cloud/i })).toBeVisible();
  await expect(page.getByText('확장 가능한 마이크로서비스')).toBeVisible();
  await beat(page);

  await page.mouse.move(720, 360);
  await page.mouse.wheel(0, 420);
  await beat(page);
  await page.mouse.wheel(0, -420);
  await beat(page);

  // 2) Click 시작하기 → sign-in ───────────────────────────────────────────────
  await narrate(page, 'Step 2 — Click 시작하기 → land on sign-in.');
  await page.getByRole('link', { name: '시작하기' }).click();
  await expect(page).toHaveURL(/\/sign-in/);
  await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible();
  await beat(page);

  // 3) Navigate to sign-up via the link ──────────────────────────────────────
  await narrate(page, 'Step 3 — Navigate to sign-up via 회원가입 link.');
  await page.getByRole('link', { name: '회원가입' }).click();
  await expect(page).toHaveURL(/\/sign-up/);
  await expect(page.getByRole('heading', { name: '계정 생성' })).toBeVisible();
  await beat(page);

  // 4) Sign-up form, with typing ─────────────────────────────────────────────
  await narrate(page, `Step 4 — Sign up as ${DEMO_EMAIL}.`);
  await page.getByLabel('이름').fill('');
  await page.getByLabel('이름').pressSequentially(DEMO_NAME, { delay: 80 });
  await beat(page, 500);
  await page.getByLabel('이메일 주소').pressSequentially(DEMO_EMAIL, { delay: 50 });
  await beat(page, 500);
  await page.getByLabel('비밀번호').pressSequentially(DEMO_PASSWORD, { delay: 50 });
  await beat(page);

  const signUpButton = page.getByRole('button', { name: /회원가입 하기/ });
  await expect(signUpButton).toBeEnabled();
  await signUpButton.click();

  // Should redirect to sign-in with a snackbar
  await expect(page).toHaveURL(/\/sign-in/, { timeout: 15_000 });
  await expect(page.getByText('회원가입이 완료되었습니다')).toBeVisible({ timeout: 10_000 });
  await beat(page);

  // 5) Sign in with the new credentials ──────────────────────────────────────
  await narrate(page, 'Step 5 — Sign in with the new account.');
  await page.getByLabel('이메일 주소').pressSequentially(DEMO_EMAIL, { delay: 50 });
  await beat(page, 500);
  await page.getByLabel('비밀번호').pressSequentially(DEMO_PASSWORD, { delay: 50 });
  await beat(page);
  await page.getByRole('button', { name: /^로그인/ }).click();

  // Lands on /products
  await expect(page).toHaveURL(/\/products/, { timeout: 15_000 });
  await beat(page);

  // 6) Products list ─────────────────────────────────────────────────────────
  await narrate(page, 'Step 6 — Browse the products list.');
  await expect(page.getByRole('heading', { name: '상품 리스트' })).toBeVisible();
  await page.mouse.wheel(0, 300);
  await beat(page);
  await page.mouse.wheel(0, -300);
  await beat(page);

  // 7) Inventory page via sidebar ────────────────────────────────────────────
  await narrate(page, 'Step 7 — Open the inventory dashboard from the sidebar.');
  await page.getByRole('link', { name: '재고 관리' }).click();
  await expect(page).toHaveURL(/\/inventories/);
  await expect(page.getByRole('heading', { name: '재고 현황 확인' })).toBeVisible();
  await beat(page);
  await page.mouse.wheel(0, 240);
  await beat(page);
  await page.mouse.wheel(0, -240);
  await beat(page);

  // 8) Orders list (likely empty for a fresh user) ───────────────────────────
  await narrate(page, 'Step 8 — Open the orders list (empty for a fresh user).');
  await page.getByRole('link', { name: '주문 내역' }).click();
  await expect(page).toHaveURL(/\/orders/);
  await expect(page.getByRole('heading', { name: '주문 및 구독 내역' })).toBeVisible();
  await beat(page);

  // 9) Create an order ───────────────────────────────────────────────────────
  await narrate(page, 'Step 9 — Create a new order.');
  await page.getByRole('link', { name: '새 주문 생성' }).click();
  await expect(page).toHaveURL(/\/order-create/);
  await expect(page.getByRole('heading', { name: '주문 생성' })).toBeVisible();
  await beat(page);

  // Add up to 2 different SKUs that have stock; bump the first one's quantity.
  const addButtons = page.getByRole('button', { name: '추가' });
  const addCount = await addButtons.count();
  if (addCount === 0) {
    throw new Error(
      '주문 가능한 재고가 없습니다. 백엔드에 상품/재고 시드 데이터가 있어야 합니다.',
    );
  }

  await narrate(page, 'Step 9a — Add the first available SKU to the cart.');
  await addButtons.first().scrollIntoViewIfNeeded();
  await addButtons.first().click();
  await beat(page);

  await narrate(page, 'Step 9b — Bump the quantity twice.');
  const incButton = page.getByRole('button', { name: '수량 증가' }).first();
  await incButton.click();
  await beat(page, 600);
  await incButton.click();
  await beat(page);

  if (addCount > 1) {
    await narrate(page, 'Step 9c — Add a second SKU.');
    const remainingAdds = page.getByRole('button', { name: '추가' });
    if ((await remainingAdds.count()) > 0) {
      await remainingAdds.first().scrollIntoViewIfNeeded();
      await remainingAdds.first().click();
      await beat(page);
    }
  }

  await narrate(page, 'Step 9d — Submit the order.');
  const submit = page.getByRole('button', { name: /주문 완료/ });
  await submit.scrollIntoViewIfNeeded();
  await expect(submit).toBeEnabled();

  // Capture the POST result so we can branch the demo if the backend rejects it.
  const createOrderResponse = page
    .waitForResponse(
      (res) => res.url().includes('/api/v1/orders') && res.request().method() === 'POST',
      { timeout: 15_000 },
    )
    .catch(() => null);
  await submit.click();
  const orderResp = await createOrderResponse;
  const createSucceeded = Boolean(orderResp && orderResp.ok());
  if (!createSucceeded) {
    console.warn(
      `⚠︎ POST /api/v1/orders did not succeed (status=${orderResp?.status() ?? 'no-response'}). ` +
        `Continuing the demo without the order-detail leg.`,
    );
  }
  await beat(page);

  if (createSucceeded) {
    // 10a) Lands on /order-detail?id=…
    await expect(page).toHaveURL(/\/order-detail\?id=\d+/, { timeout: 20_000 });
    await expect(page.getByRole('heading', { name: '주문 상세' })).toBeVisible();
    await beat(page);

    await narrate(page, 'Step 10 — Return to the orders list — the new order is there.');
    await page.getByRole('link', { name: '목록으로' }).click();
    await expect(page).toHaveURL(/\/orders/);
    await expect(page.getByText(/주문 번호:/).first()).toBeVisible();
    await beat(page);

    await narrate(page, 'Step 11 — Re-open the order detail via 상세보기.');
    await page.getByRole('link', { name: '상세보기' }).first().click();
    await expect(page).toHaveURL(/\/order-detail/);
    await beat(page);
  } else {
    // 10b) Backend rejected create — fall back to a sidebar tour for the video.
    await narrate(page, 'Step 10 (fallback) — Backend rejected create; returning to the orders list via sidebar.');
    await page.getByRole('link', { name: '주문 내역' }).click();
    await expect(page).toHaveURL(/\/orders/);
    await beat(page);

    await narrate(page, 'Step 11 (fallback) — Revisit the products catalog.');
    await page.getByRole('link', { name: '상품 목록' }).click();
    await expect(page).toHaveURL(/\/products/);
    await expect(page.getByRole('heading', { name: '상품 리스트' })).toBeVisible();
    await beat(page);
  }

  // 12) Sign out from the sidebar (must happen before leaving the auth layout)
  await narrate(page, 'Step 12 — Sign out from the sidebar.');
  await page.getByRole('button', { name: '로그아웃' }).click();
  await expect(page).toHaveURL(/\/sign-in/, { timeout: 10_000 });
  await expect(page.getByText('로그아웃 되었습니다')).toBeVisible({ timeout: 5_000 });
  await beat(page, NARRATION_PAUSE);

  // 13) Final scene: public landing now shows "시작하기" again
  await narrate(page, 'Step 13 — Return to the public landing page.');
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /KT Cloud/i })).toBeVisible();
  await expect(page.getByRole('link', { name: '시작하기' })).toBeVisible();
  await beat(page, NARRATION_PAUSE);

  await narrate(page, 'Demo complete.');
});
