import { randomUUID } from 'node:crypto'
import { expect, test } from '@playwright/test'

const mailpit = 'http://127.0.0.1:8025'
const issuerOrigin = process.env.PLAYWRIGHT_KEYCLOAK_ORIGIN ?? 'http://localhost:8080'

test('registration sends branded email and verification grants no workspace membership', async ({ page, browser, request }) => {
  test.setTimeout(120_000)
  const username = `registration-${randomUUID()}`
  const email = `${username}@complylet.test`
  const password = `Local-test-${randomUUID()}!`

  await page.goto('/')
  await page.getByRole('link', { name: 'Sign in', exact: true }).click()
  await page.getByRole('link', { name: 'Register', exact: true }).click()
  await page.locator('#firstName').fill('Local')
  await page.locator('#lastName').fill('Registration')
  await page.locator('#email').fill(email)
  await page.locator('#username').fill(username)
  await page.getByRole('button', { name: 'Register', exact: true }).click()

  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible()
  await expect(page.getByText('r•••@complylet.test')).toBeVisible()
  expect((await page.request.get('/api/v1/session')).status()).toBe(401)

  async function messages(): Promise<{ ID: string; Subject: string }[]> {
    const response = await request.get(`${mailpit}/api/v1/search`, { params: { query: `to:${email}` } })
    expect(response.ok()).toBe(true)
    return (await response.json()).messages ?? []
  }

  await expect.poll(async () => (await messages()).length).toBe(1)
  await page.getByRole('link', { name: 'Resend verification email' }).click()
  await expect(page.getByText(/must wait .*seconds/i)).toBeVisible()
  const [message] = await messages()
  expect((await messages()).length).toBe(1)
  if (!message) throw new Error('Expected one verification email')
  expect(message.Subject).toBe('Verify your email address for ComplyLet')

  const response = await request.get(`${mailpit}/api/v1/message/${message.ID}`)
  expect(response.ok()).toBe(true)
  const { Text: plain, HTML: html } = await response.json() as { Text: string; HTML: string }
  expect(html.includes('Verify email address')).toBe(true)
  expect(plain.includes('30 minutes')).toBe(true)
  const link = plain.match(/^https?:\/\/[^\s]+/m)?.[0]
  if (!link || new URL(link).origin !== issuerOrigin) throw new Error('Expected a verification link on the test issuer')

  const tokenPayload = new URL(link).searchParams.get('key')?.split('.')[1]
  if (!tokenPayload) throw new Error('Expected an expiring Keycloak action token')
  const { exp, iat } = JSON.parse(Buffer.from(tokenPayload, 'base64url').toString()) as { exp: number; iat: number }
  expect(Math.abs((exp - iat) - 30 * 60)).toBeLessThanOrEqual(2)

  const scanner = await browser.newContext()
  try {
    const scannerPage = await scanner.newPage()
    await scannerPage.goto(link).catch(() => { throw new Error('Could not open verification link in a separate browser') })
    await expect(scannerPage.getByRole('heading', { name: /email address validation|confirm.*email/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible()
    expect((await page.request.get('/api/v1/workspaces')).status()).toBe(401)
  } finally {
    await scanner.close()
  }

  await page.goto(link).catch(() => { throw new Error('Could not open verification link in the registration browser') })
  await expect(page.locator('#password-new')).toBeVisible()
  await page.locator('#password-new').fill(password)
  await page.locator('#password-confirm').fill(password)
  await page.getByRole('button', { name: 'Submit', exact: true }).click()
  await expect.poll(async () => (await page.request.get('/api/v1/session')).status()).toBe(200)
  const workspaces = await page.request.get('/api/v1/workspaces')
  expect(workspaces.ok()).toBe(true)
  expect(await workspaces.json()).toEqual([])

  const replay = await browser.newContext()
  try {
    const replayPage = await replay.newPage()
    await replayPage.goto(link).catch(() => { throw new Error('Could not check verification link replay') })
    await expect(replayPage.getByText(/already verified|verified already|no longer valid|stale|invalid/i).first()).toBeVisible()
    expect((await replay.request.get('/api/v1/session')).status()).toBe(401)

    const invalidLink = new URL(link)
    invalidLink.searchParams.set('key', 'invalid')
    await replayPage.goto(invalidLink.toString())
    await expect(replayPage.getByText(/please login again through your application/i)).toBeVisible()
    expect((await replay.request.get('/api/v1/session')).status()).toBe(401)
  } finally {
    await replay.close()
  }
})
