import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { BrowserSessions } from './BrowserSessions'
import { api, ApiError, sessionSchema, workspaceSchema, type Workspace } from './api'

const sessionKey = ['session']
const workspaceKey = ['workspaces']

export function App() {
  const queryClient = useQueryClient()
  const loginFailed = new URLSearchParams(window.location.search).get('login') === 'failed'
  const [showSessions, setShowSessions] = useState(false)
  const [pages, setPages] = useState<string[]>([])
  const cursor = pages.at(-1)
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
    onError(error) {
      setSelected(undefined)
      void queryClient.invalidateQueries({ queryKey: workspaceKey })
      if (error instanceof ApiError && [401, 403].includes(error.status)) {
        void queryClient.invalidateQueries({ queryKey: sessionKey })
      }
    },
  })

  const sessionStatus = session.error instanceof ApiError ? session.error.status : undefined
  const workspaceStatus = workspaces.error instanceof ApiError ? workspaces.error.status : undefined
  const selectionStatus = selection.error instanceof ApiError ? selection.error.status : undefined
  const lastWorkspace = workspaces.data?.at(-1)

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="masthead">
        <div className="masthead-inner">
          <a className="wordmark" href="/">Comply<span>Let</span></a>
          {session.isSuccess && (
            <form method="post" action="/logout">
              <input type="hidden" name="_csrf" value={session.data.csrfToken} />
              <button className="button button-header" type="submit">Sign out</button>
            </form>
          )}
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className={session.isSuccess ? 'shell' : 'access-shell'}>
        {session.isSuccess ? (
          <>
            <div className="page-heading">
              <h1>Workspace access</h1>
              <p>Choose an organisation to open its workspace.</p>
            </div>
            <div className="workspace-layout">
              <section className="panel" aria-labelledby="organisations-heading">
                <div className="panel-heading"><h2 id="organisations-heading">Organisations</h2></div>
                {workspaces.isPending && (
                  <div className="panel-body"><p role="status">Loading organisations…</p><div className="skeleton" aria-hidden="true" /></div>
                )}
                {workspaces.isError && (
                  <div className="panel-body stack">
                    <p className="feedback feedback-error" role="alert">
                      {workspaceStatus === 401 ? 'Your session has expired. Sign in to view your organisations.'
                        : workspaceStatus === 403 ? 'You do not have permission to view these organisations.'
                          : 'Organisations could not be loaded.'}
                    </p>
                    {workspaceStatus === 401 ? (
                      <a className="button button-primary" href="/oauth2/authorization/complylet">Sign in</a>
                    ) : (
                      <button className="button" type="button" onClick={() => void workspaces.refetch()}>Try again</button>
                    )}
                  </div>
                )}
                {workspaces.isSuccess && workspaces.data.length === 0 && (
                  <div className="panel-body stack">
                    <h3>{cursor ? 'No more organisations' : 'No organisations yet'}</h3>
                    {!cursor && <p>Ask your organisation administrator to grant you workspace access.</p>}
                  </div>
                )}
                {workspaces.isSuccess && workspaces.data.length > 0 && (
                  <ul className="workspace-list" aria-label="Organisations">
                    {workspaces.data.map(workspace => (
                      <li key={workspace.id}>
                        <button
                          className="workspace-button"
                          type="button"
                          aria-pressed={selected?.id === workspace.id}
                          aria-disabled={selection.isPending}
                          onClick={() => { if (!selection.isPending) selection.mutate(workspace) }}
                        >
                          <span className="workspace-initial" aria-hidden="true">{workspace.name.trim().slice(0, 1).toLocaleUpperCase('en-GB')}</span>
                          <span className="workspace-details">
                            <strong>{workspace.name}{' '}</strong>
                            <span>{formatRole(workspace.role)}</span>
                          </span>
                          <span className="workspace-action" aria-hidden="true">
                            {selection.isPending && selection.variables.id === workspace.id ? 'Opening…'
                              : selected?.id === workspace.id ? 'Selected' : 'Open →'}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {(cursor || (workspaces.isSuccess && workspaces.data.length === 100)) && (
                  <nav className="pagination" aria-label="Organisation pages">
                    <button className="button" type="button" disabled={!cursor || selection.isPending}
                      onClick={() => setPages(pages.slice(0, -1))}>Previous</button>
                    <span>Page {pages.length + 1}</span>
                    <button className="button" type="button"
                      disabled={!workspaces.isSuccess || workspaces.data.length !== 100 || !lastWorkspace || selection.isPending}
                      onClick={() => { if (lastWorkspace) setPages([...pages, lastWorkspace.id]) }}>Next</button>
                  </nav>
                )}
                {selection.isError && (
                  <div className="panel-body">
                    <p className="feedback feedback-error" role="alert">
                      {selectionStatus === 404 ? 'This workspace is no longer available to your account.'
                        : selectionStatus === 403 ? 'Workspace access could not be verified. Sign in again and retry.'
                          : selectionStatus === 401 ? 'Your session has expired. Sign in again to open a workspace.'
                            : 'This workspace could not be opened. Try again.'}
                    </p>
                    {(selectionStatus === 401 || selectionStatus === 403) && (
                      <a className="button" href="/oauth2/authorization/complylet">Sign in again</a>
                    )}
                  </div>
                )}
                <p className="sr-only" role="status">
                  {selection.isPending ? `Opening workspace: ${selection.variables.name}`
                    : selected ? `Selected workspace: ${selected.name}` : ''}
                </p>
              </section>
              <section className="panel account-panel" aria-labelledby="account-heading">
                <div className="panel-heading"><h2 id="account-heading">Account security</h2></div>
                <div className="panel-body">
                  <details onToggle={event => setShowSessions(event.currentTarget.open)}>
                    <summary>Browser sessions</summary>
                    {showSessions && <BrowserSessions {...session.data} />}
                  </details>
                </div>
              </section>
            </div>
          </>
        ) : (
          <section className="panel access-panel stack" aria-labelledby="access-heading">
            <h1 id="access-heading">{sessionStatus === 401 ? 'Sign in to ComplyLet' : 'Workspace access'}</h1>
            {session.isPending && (
              <><p role="status">Checking your session…</p><div className="skeleton" aria-hidden="true" /></>
            )}
            {sessionStatus === 401 && (
              <>
                <p>Use your account to access your organisation’s workspace.</p>
                {loginFailed && <p className="feedback feedback-error" role="alert">Sign-in could not be completed. Please try again.</p>}
                <a className="button button-primary" href="/oauth2/authorization/complylet">Sign in</a>
              </>
            )}
            {sessionStatus === 403 && (
              <>
                <p className="feedback feedback-error" role="alert">Verify your email address before accessing a workspace.</p>
                <a className="button button-primary" href="/oauth2/authorization/complylet">Sign in again</a>
              </>
            )}
            {session.isError && sessionStatus !== 401 && sessionStatus !== 403 && (
              <>
                <p className="feedback feedback-error" role="alert">Your session could not be checked.</p>
                <button className="button" type="button" onClick={() => void session.refetch()}>Try again</button>
              </>
            )}
          </section>
        )}
      </main>
    </>
  )
}

function formatRole(role: string) {
  const label = role.toLocaleLowerCase('en-GB').replaceAll('_', ' ').replace('read only', 'read-only')
  return label.charAt(0).toLocaleUpperCase('en-GB') + label.slice(1)
}
