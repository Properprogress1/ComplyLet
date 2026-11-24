import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { api, ApiError, sessionSchema } from './api'

const sessionsKey = ['browser-sessions']
const devices = z.array(z.object({
  id: z.uuid(),
  browser: z.string(),
  signedInAt: z.iso.datetime({ offset: true }),
  current: z.boolean(),
}))
const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' })

export function BrowserSessions({ csrfHeader, csrfToken }: z.infer<typeof sessionSchema>) {
  const cache = useQueryClient()
  const sessions = useQuery({
    queryKey: sessionsKey,
    queryFn: () => api('/api/v1/sessions', devices),
    retry: false,
  })
  const revoke = useMutation({
    mutationFn: (id: string) => api(`/api/v1/sessions/${id}`, z.undefined(), {
      method: 'DELETE',
      headers: { [csrfHeader]: csrfToken },
    }),
    onSuccess: () => cache.invalidateQueries({ queryKey: sessionsKey }),
    onError(error) {
      if (error instanceof ApiError && error.status === 404) {
        void cache.invalidateQueries({ queryKey: sessionsKey })
      }
      if (error instanceof ApiError && [401, 403].includes(error.status)) {
        void cache.invalidateQueries({ queryKey: ['session'] })
      }
    },
  })
  const loadStatus = sessions.error instanceof ApiError ? sessions.error.status : undefined
  const revokeStatus = revoke.error instanceof ApiError ? revoke.error.status : undefined

  return (
    <div className="stack">
      {sessions.isPending && (
        <div><p role="status">Loading browser sessions…</p><div className="skeleton" aria-hidden="true" /></div>
      )}
      {sessions.isError && (
        <>
          <p className="feedback feedback-error" role="alert">
            {loadStatus === 401 ? 'Your session has expired.'
              : loadStatus === 403 ? 'You do not have permission to view browser sessions.'
                : 'Browser sessions could not be loaded.'}
          </p>
          {loadStatus === 401 ? (
            <a className="button" href="/oauth2/authorization/complylet">Sign in again</a>
          ) : (
            <button className="button" type="button" onClick={() => void sessions.refetch()}>Retry browser sessions</button>
          )}
        </>
      )}
      {sessions.isSuccess && sessions.data.length === 0 && <p>No active browser sessions.</p>}
      {sessions.isSuccess && sessions.data.length > 0 && (
        <ul className="session-list" aria-label="Active browser sessions">
          {sessions.data.map(session => {
            const signedIn = dateFormat.format(new Date(session.signedInAt))
            return (
              <li key={session.id} className="session-row">
                <div>
                  <strong>{session.browser}</strong>
                  <time className="session-date" dateTime={session.signedInAt}>{signedIn}</time>
                </div>
                {session.current ? <span className="session-current">Current session</span> : (
                  <button className="button" type="button" disabled={revoke.isPending} onClick={() => {
                    if (window.confirm('Revoke this browser session? It will lose access to ComplyLet.')) {
                      revoke.mutate(session.id)
                    }
                  }}
                    aria-label={`Revoke ${session.browser} session started ${signedIn}`}>
                    {revoke.isPending && revoke.variables === session.id ? 'Revoking…' : 'Revoke'}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}
      {revoke.isSuccess && <p role="status">Browser session revoked.</p>}
      {revoke.isError && (
        <p className="feedback feedback-error" role="alert">
          {revokeStatus === 404 ? 'This browser session is no longer available.'
            : 'The browser session could not be revoked. Try again.'}
        </p>
      )}
    </div>
  )
}
