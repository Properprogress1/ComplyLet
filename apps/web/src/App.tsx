import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { api, ApiError, sessionSchema, workspaceSchema, type Workspace } from './api'

const sessionKey = ['session']
const workspaceKey = ['workspaces']

export function App() {
  const queryClient = useQueryClient()
  const loginFailed = new URLSearchParams(window.location.search).get('login') === 'failed'
  const [cursor, setCursor] = useState<string>()
  const [selected, setSelected] = useState<Workspace>()
  const session = useQuery({
    queryKey: sessionKey,
    queryFn: () => api('/api/v1/session', sessionSchema),
    retry: false,
  })
  const workspaces = useQuery({
    queryKey: [...workspaceKey, cursor],
    queryFn: () => api(
      cursor ? `/api/v1/workspaces?after=${encodeURIComponent(cursor)}` : '/api/v1/workspaces',
      z.array(workspaceSchema),
    ),
    enabled: session.isSuccess,
    retry: false,
  })
  const selection = useMutation({
    mutationFn(workspace: Workspace) {
      if (!session.data) throw new Error('Session unavailable')
      const { csrfHeader, csrfToken } = session.data
      return api(`/api/v1/workspaces/${workspace.id}/selection`, workspaceSchema, {
        method: 'POST',
        headers: { [csrfHeader]: csrfToken },
      })
    },
    onSuccess: setSelected,
    onError() {
      setSelected(undefined)
      void queryClient.invalidateQueries({ queryKey: workspaceKey })
    },
  })

  return (
    <>
      <header><a href="/">ComplyLet</a></header>
      <main>
        <h1>Workspace access</h1>
        {session.isPending && <p role="status">Checking your session…</p>}
        {session.error instanceof ApiError && session.error.status === 401 && (
          <>
            {loginFailed && <p role="alert">Sign-in could not be completed. Please try again.</p>}
            <a className="action" href="/oauth2/authorization/complylet">Sign in</a>
          </>
        )}
        {session.error instanceof ApiError && session.error.status === 403 && (
          <p role="alert">Verify your email address before accessing a workspace.</p>
        )}
        {session.isError && !(session.error instanceof ApiError && [401, 403].includes(session.error.status)) && (
          <p role="alert">Your session could not be checked. Refresh to try again.</p>
        )}
        {session.isSuccess && (
          <>
            <form method="post" action="/logout">
              <input type="hidden" name="_csrf" value={session.data.csrfToken} />
              <button type="submit">Sign out</button>
            </form>
            <h2>Organisations</h2>
            {workspaces.isPending && <p role="status">Loading organisations…</p>}
            {workspaces.isError && <p role="alert">Organisations could not be loaded. Refresh to try again.</p>}
            {workspaces.data?.length === 0 && <p>{cursor ? 'No more organisations.' : 'You have no agency workspace memberships.'}</p>}
            {!!workspaces.data?.length && (
              <ul aria-label="Organisations">
                {workspaces.data.map(workspace => (
                  <li key={workspace.id}>
                    <button type="button" disabled={selection.isPending} onClick={() => selection.mutate(workspace)}>
                      {workspace.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {cursor && <button type="button" onClick={() => setCursor(undefined)}>First page</button>}
            {workspaces.data?.length === 100 && (
              <button type="button" onClick={() => setCursor(workspaces.data?.at(-1)?.id)}>Next page</button>
            )}
            {selection.isError && <p role="alert">This workspace could not be opened.</p>}
            {selected && <p role="status">Selected workspace: {selected.name}</p>}
          </>
        )}
      </main>
    </>
  )
}
