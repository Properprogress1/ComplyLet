import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const firstWorkspace = 'f0e3e83f-ad62-4367-b174-228f2ad64971'
type SessionView = { id: string; current: boolean }

const secondWorkspace = 'acb150d1-b524-4a44-a926-5ce88c774b82'

async function login(page: Page, username: string, password: string) {
  await page.goto('/')
  await page.getByRole('link', { name: 'Sign in' }).click()
  await page.locator('#username').fill(username)
  await page.locator('#password').fill(password)
  await page.locator('#kc-login').click()
}

async function expectAccessible(page: Page) {
  const audit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(audit.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(node => node.target) }))).toEqual([])
}

test('OIDC login, accessible workspace selection and logout', async ({ page }) => {
  test.setTimeout(120_000)
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Sign in', exact: true })).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
  await expectAccessible(page)
  await login(page, 'workspace-owner', 'local-owner-only')
  await page.getByRole('button', { name: /^Local agency.*Organisation owner$/ }).click()
  await expect(page.getByRole('status')).toHaveText('Selected workspace: Local agency')

  await expect(page.getByRole('button', { name: /^Local agency.*Organisation owner$/, pressed: true })).toBeVisible()
  await expect.poll(() => page.locator('html').evaluate(element => element.scrollWidth)).toBe(320)
  await expectAccessible(page)

  await page.setViewportSize({ width: 1280, height: 900 })
  await page.emulateMedia({ colorScheme: 'dark' })
  const sessions = page.getByText('Browser sessions', { exact: true })
  await sessions.focus()
  await page.keyboard.press('Space')
  await expect(page.getByText('Current session', { exact: true })).toBeVisible()
  await expectAccessible(page)

  const cookie = (await page.context().cookies()).find(cookie => cookie.name === 'COMPLYLET_SESSION')
  expect(cookie).toMatchObject({ httpOnly: true, sameSite: 'Lax' })

  await page.getByRole('button', { name: 'Sign out' }).click()
  await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()
  expect((await page.request.get('/api/v1/session')).status()).toBe(401)
})

test('a real session cannot open another organisation', async ({ page }) => {
  await login(page, 'second-owner', 'local-second-only')
  await expect(page.getByRole('button', { name: 'Second local agency' })).toBeVisible()
  await expect(page.getByRole('button', { name: /^Local agency.*Organisation owner$/ })).toHaveCount(0)
  const session = await page.request.get('/api/v1/session')
  expect(session.ok()).toBe(true)
  const { csrfToken, csrfHeader } = await session.json()
  const headers = { [csrfHeader]: csrfToken }
  expect((await page.request.post(`/api/v1/workspaces/${firstWorkspace}/selection`, { headers })).status()).toBe(404)
  expect((await page.request.post(`/api/v1/workspaces/${secondWorkspace}/selection`)).status()).toBe(403)
  expect((await page.request.post(`/api/v1/workspaces/${secondWorkspace}/selection`, { headers })).status()).toBe(200)
  await page.getByRole('button', { name: 'Sign out' }).click()
  await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()
})

test('browser sessions can only be revoked by their verified owner', async ({ page, browser }) => {
  test.setTimeout(150_000)
  const otherContext = await browser.newContext()
  const foreignContext = await browser.newContext()
  try {
    const other = await otherContext.newPage()
    const foreign = await foreignContext.newPage()
    await login(page, 'workspace-owner', 'local-owner-only')
    await login(other, 'workspace-owner', 'local-owner-only')
    await login(foreign, 'second-owner', 'local-second-only')
    await expect(page.getByRole('button', { name: /^Local agency.*Organisation owner$/ })).toBeVisible()
    await expect(other.getByRole('button', { name: /^Local agency.*Organisation owner$/ })).toBeVisible()
    await expect(foreign.getByRole('button', { name: 'Second local agency' })).toBeVisible()

    const ownSessions: SessionView[] = await (await page.request.get('/api/v1/sessions')).json()
    const otherSessions: SessionView[] = await (await other.request.get('/api/v1/sessions')).json()
    const foreignSessions: SessionView[] = await (await foreign.request.get('/api/v1/sessions')).json()
    const target = otherSessions.find(session => session.current)
    const current = ownSessions.find(session => session.current)
    if (!current || !target) throw new Error('Expected both test sessions to be registered')
    expect(current.id).not.toBe(target.id)
    const revokable = ownSessions.filter(session => !session.current)
    const targetIndex = revokable.findIndex(session => session.id === target.id)
    expect(targetIndex).toBeGreaterThanOrEqual(0)
    expect(foreignSessions.filter(session => session.current)).toHaveLength(1)
    expect(foreignSessions.every(session => !ownSessions.some(own => own.id === session.id))).toBe(true)

    const { csrfHeader, csrfToken } = await (await foreign.request.get('/api/v1/session')).json()
    const targetPath = `/api/v1/sessions/${target.id}`
    const headers = { [csrfHeader]: csrfToken }
    const foreignDelete = await foreign.request.delete(targetPath, { headers })
    const unknownDelete = await foreign.request.delete('/api/v1/sessions/774186a8-d7b7-41b4-9ad3-3d7d781a8a48', { headers })
    expect(foreignDelete.status()).toBe(404)
    expect(unknownDelete.status()).toBe(404)
    expect((await foreignDelete.json()).detail).toBe((await unknownDelete.json()).detail)
    expect((await page.request.delete(targetPath)).status()).toBe(403)

    const ownCsrf = await (await page.request.get('/api/v1/session')).json()
    expect((await page.request.delete(`/api/v1/sessions/${current.id}`, {
      headers: { [ownCsrf.csrfHeader]: ownCsrf.csrfToken },
    })).status()).toBe(404)

    await page.getByText('Browser sessions', { exact: true }).click()
    await expect(page.getByText('Current session', { exact: true })).toBeVisible()
    page.once('dialog', dialog => dialog.dismiss())
    const revokeButtons = page.getByRole('button', { name: /^Revoke Chrome session/ })
    await expect(revokeButtons).toHaveCount(revokable.length)
    const revoke = revokeButtons.nth(targetIndex)
    await revoke.click()
    await expect(revoke).toBeEnabled()
    expect((await other.request.get('/api/v1/session')).status()).toBe(200)
    page.once('dialog', dialog => dialog.accept())
    await revoke.click()
    await expect(page.getByText('Browser session revoked.')).toBeVisible()
    await expect(revokeButtons).toHaveCount(revokable.length - 1)
    const repeated = await page.request.delete(targetPath, {
      headers: { [ownCsrf.csrfHeader]: ownCsrf.csrfToken },
    })
    expect(repeated.status()).toBe(404)
    expect((await other.request.get('/api/v1/workspaces')).status()).toBe(401)
    expect((await page.request.get('/api/v1/session')).status()).toBe(200)
    expect((await foreign.request.get('/api/v1/session')).status()).toBe(200)
    for (const activePage of [page, foreign]) {
      await activePage.getByRole('button', { name: 'Sign out' }).click()
      await expect(activePage.getByRole('link', { name: 'Sign in' })).toBeVisible()
    }
  } finally {
    await otherContext.close()
    await foreignContext.close()
  }
})
