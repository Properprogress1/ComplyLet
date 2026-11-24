import { expect, test, type Page } from '@playwright/test'

const firstWorkspace = 'f0e3e83f-ad62-4367-b174-228f2ad64971'
const secondWorkspace = 'acb150d1-b524-4a44-a926-5ce88c774b82'

async function login(page: Page, username: string, password: string) {
  await page.goto('/')
  await page.getByRole('link', { name: 'Sign in' }).click()
  await page.locator('#username').fill(username)
  await page.locator('#password').fill(password)
  await page.locator('#kc-login').click()
}

test('OIDC login, workspace selection and logout', async ({ page }) => {
  await login(page, 'workspace-owner', 'local-owner-only')
  await page.getByRole('button', { name: 'Local agency', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('Selected workspace: Local agency')

  const cookie = (await page.context().cookies()).find(cookie => cookie.name === 'COMPLYLET_SESSION')
  expect(cookie).toMatchObject({ httpOnly: true, sameSite: 'Lax' })

  await page.getByRole('button', { name: 'Sign out' }).click()
  await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()
  expect((await page.request.get('/api/v1/session')).status()).toBe(401)
})

test('a real session cannot open another organisation', async ({ page }) => {
  await login(page, 'second-owner', 'local-second-only')
  await expect(page.getByRole('button', { name: 'Second local agency' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Local agency', exact: true })).toHaveCount(0)
  const session = await page.request.get('/api/v1/session')
  expect(session.ok()).toBe(true)
  const { csrfToken, csrfHeader } = await session.json()
  const headers = { [csrfHeader]: csrfToken }
  expect((await page.request.post(`/api/v1/workspaces/${firstWorkspace}/selection`, { headers })).status()).toBe(404)
  expect((await page.request.post(`/api/v1/workspaces/${secondWorkspace}/selection`)).status()).toBe(403)
  expect((await page.request.post(`/api/v1/workspaces/${secondWorkspace}/selection`, { headers })).status()).toBe(200)
})
