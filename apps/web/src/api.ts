import { z } from 'zod'

export const sessionSchema = z.object({
  csrfToken: z.string().min(1),
  csrfHeader: z.string().min(1),
})
export const workspaceSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  role: z.string(),
})
export type Workspace = z.infer<typeof workspaceSchema>

export class ApiError extends Error {
  constructor(readonly status: number) {
    super(`Request failed with status ${status}`)
  }
}

export async function api<T>(path: string, schema: z.ZodType<T>, options?: RequestInit) {
  const response = await fetch(path, { ...options, cache: 'no-store' })
  if (!response.ok) throw new ApiError(response.status)
  return schema.parse(response.status === 204 ? undefined : await response.json())
}
