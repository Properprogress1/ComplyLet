import { afterEach, expect, test, vi } from 'vitest'
import { act, cleanup, configure, fireEvent, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App } from './App'

configure({ asyncUtilTimeout: 5_000 })

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

async function renderApp() {
  const client = new QueryClient()
  await act(async () => {
    render(<QueryClientProvider client={client}><App /></QueryClientProvider>)
  })
}

test('offers OIDC sign-in after an unauthenticated response', async () => {
  const response = new Response(null, { status: 401 })
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))
  await renderApp()
  const link = await screen.findByRole('link', { name: 'Sign in' })
  expect(link.getAttribute('href')).toBe('/oauth2/authorization/complylet')
})

test('requires verified email before requesting workspace data', async () => {
  const fetchMock = vi.fn(async () => new Response(null, { status: 403 }))
  vi.stubGlobal('fetch', fetchMock)
  await renderApp()
  expect((await screen.findByRole('alert')).textContent).toMatch(/Verify your email/)
  expect(fetchMock).toHaveBeenCalledTimes(1)
})

test('sends the session CSRF token when selecting a workspace', async () => {
  const workspace = { id: 'f0e3e83f-ad62-4367-b174-228f2ad64971', name: 'Local agency', role: 'ORGANISATION_OWNER' }
  const fetchMock = vi.fn(async (path: string) => {
    if (path.endsWith('/session')) return Response.json({ csrfToken: 'csrf', csrfHeader: 'X-CSRF-TOKEN' })
    if (path.endsWith('/workspaces')) return Response.json([workspace])
    return Response.json(workspace)
  })
  vi.stubGlobal('fetch', fetchMock)
  await renderApp()
  fireEvent.click(await screen.findByRole('button', { name: /^Local agency.*Organisation owner$/ }))
  expect((await screen.findByText('Selected workspace: Local agency')).textContent).toBeTruthy()
  expect(fetchMock).toHaveBeenCalledWith(`/api/v1/workspaces/${workspace.id}/selection`, expect.objectContaining({
    method: 'POST',
    headers: { 'X-CSRF-TOKEN': 'csrf' },
  }))
})

test('shows guidance when the verified account has no organisations', async () => {
  vi.stubGlobal('fetch', vi.fn(async (path: string) => path.endsWith('/session')
    ? Response.json({ csrfToken: 'csrf', csrfHeader: 'X-CSRF-TOKEN' })
    : Response.json([])))
  await renderApp()
  expect((await screen.findByRole('heading', { name: 'No organisations yet' })).textContent).toBeTruthy()
  expect(screen.getByText(/Ask your organisation administrator/)).toBeTruthy()
})

test('retries a failed organisation request without reloading the account', async () => {
  let attempts = 0
  const fetchMock = vi.fn(async (path: string) => {
    if (path.endsWith('/session')) return Response.json({ csrfToken: 'csrf', csrfHeader: 'X-CSRF-TOKEN' })
    return attempts++ === 0 ? new Response(null, { status: 500 }) : Response.json([])
  })
  vi.stubGlobal('fetch', fetchMock)
  await renderApp()
  expect((await screen.findByRole('alert')).textContent).toMatch(/Organisations could not be loaded/)
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
  expect(await screen.findByRole('heading', { name: 'No organisations yet' })).toBeTruthy()
  expect(fetchMock.mock.calls.filter(([path]) => path.endsWith('/session'))).toHaveLength(1)
})

test('loads browser sessions only when the disclosure is opened', async () => {
  const fetchMock = vi.fn(async (path: string) => path.endsWith('/session')
    ? Response.json({ csrfToken: 'csrf', csrfHeader: 'X-CSRF-TOKEN' })
    : Response.json([]))
  vi.stubGlobal('fetch', fetchMock)
  await renderApp()
  const disclosure = await screen.findByText('Browser sessions', { exact: true })
  expect(fetchMock.mock.calls.some(([path]) => path.endsWith('/sessions'))).toBe(false)
  fireEvent.click(disclosure)
  expect(await screen.findByText('No active browser sessions.')).toBeTruthy()
  expect(fetchMock.mock.calls.some(([path]) => path.endsWith('/sessions'))).toBe(true)
})
