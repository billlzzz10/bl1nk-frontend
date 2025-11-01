import { test as base } from '@playwright/test'

type MockApiFixtures = {
  mockApi: void
}

export const MOCK_USER = {
  id: 'user-1',
  email: 'agent@example.com',
  name: 'Agent Example',
  created_at: new Date().toISOString(),
}

export const MOCK_WORKSPACES = [
  {
    id: 'workspace-1',
    name: 'Operations Control',
    description: 'Mission control for critical tasks',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'workspace-2',
    name: 'Product Launch',
    description: 'Coordinate go-to-market activities',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const MOCK_STATS = {
  system: {
    cpu_percent: 42.5,
    memory_percent: 61.3,
    memory_used_gb: 12.6,
    memory_total_gb: 32,
    disk_percent: 55.1,
    disk_used_gb: 410,
    disk_total_gb: 750,
    uptime_hours: 128.4,
  },
  application: {
    requests_count: 4821,
    errors_count: 7,
    active_connections: 42,
    error_rate: 0.0015,
  },
  timestamp: new Date().toISOString(),
}

const jsonResponse = (status: number, data: unknown) => ({
  status,
  contentType: 'application/json',
  body: JSON.stringify(data),
})

export const test = base.extend<MockApiFixtures>({
  mockApi: [
    async ({ page }, use) => {
      const plans: Array<{
        id: string
        title: string
        description: string
        status: 'pending' | 'approved' | 'executing' | 'completed'
        steps: Array<{
          id: string
          title: string
          description: string
          status: 'pending' | 'executing' | 'completed'
        }>
        created_at: string
        updated_at: string
      }> = []

      const routes: Array<{
        url: string | RegExp
        handler: Parameters<typeof page.route>[1]
      }> = []

      const toPattern = (path: string) => {
        const escaped = path
          .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
          .replace(/\\\*/g, '[^\\/]+')
        return new RegExp(`https?:\\/\\/[^\\/]+\\/(?:api\\/)?${escaped}(?:\\?.*)?$`)
      }

      const registerRoute = (
        url: string | RegExp,
        handler: Parameters<typeof page.route>[1],
      ) => {
        routes.push({ url, handler })
        return page.route(url, handler)
      }

      registerRoute(toPattern('auth/login'), async (route) => {
        const request = route.request()
        if (request.method() !== 'POST') {
          await route.continue()
          return
        }
        const body = request.postDataJSON?.() as { email?: string; password?: string } | undefined

        if (!body?.email || !body?.password) {
          await route.fulfill(jsonResponse(400, { message: 'Missing credentials' }))
          return
        }

        await route.fulfill(
          jsonResponse(200, {
            user: { ...MOCK_USER, email: body.email },
            token: 'mock-access-token',
          }),
        )
      })

      registerRoute(toPattern('auth/me'), async (route) => {
        if (route.request().method() !== 'GET') {
          await route.continue()
          return
        }
        await route.fulfill(jsonResponse(200, MOCK_USER))
      })

      registerRoute(toPattern('auth/logout'), async (route) => {
        if (route.request().method() !== 'POST') {
          await route.continue()
          return
        }
        await route.fulfill(jsonResponse(200, { success: true }))
      })

      const workspacesHandler: Parameters<typeof page.route>[1] = async (route) => {
        const request = route.request()
        const method = request.method()
        const url = request.url()
        const workspaceIdMatch = url.match(/\/workspaces\/([^/?]+)/)

        if (method === 'GET' && workspaceIdMatch) {
          const workspace = MOCK_WORKSPACES.find(({ id }) => id === workspaceIdMatch[1])
          if (!workspace) {
            await route.fulfill(jsonResponse(404, { message: 'Workspace not found' }))
            return
          }
          await route.fulfill(jsonResponse(200, workspace))
          return
        }

        if (method === 'GET') {
          await route.fulfill(jsonResponse(200, MOCK_WORKSPACES))
          return
        }

        await route.continue()
      }

      registerRoute(toPattern('workspaces'), workspacesHandler)
      registerRoute(toPattern('workspaces/*'), workspacesHandler)

      registerRoute(toPattern('plans'), async (route) => {
        const { method, postDataJSON } = route.request()

        if (method() === 'GET') {
          await route.fulfill(jsonResponse(200, plans))
          return
        }

        if (method() === 'POST') {
          const body = postDataJSON?.() as { title?: string; description?: string } | undefined
          const now = new Date().toISOString()
          const plan = {
            id: `plan-${Date.now()}`,
            title: body?.title || 'Untitled Plan',
            description: body?.description || 'Generated plan description',
            status: 'pending' as const,
            created_at: now,
            updated_at: now,
            steps: [],
          }
          plans.push(plan)
          await route.fulfill(jsonResponse(201, plan))
          return
        }

        await route.continue()
      })

      registerRoute(toPattern('plans/*/approve'), async (route) => {
        const id = route.request().url().split('/plans/')[1]?.split('/')[0]
        const plan = plans.find((entry) => entry.id === id)
        if (!plan) {
          await route.fulfill(jsonResponse(404, { message: 'Plan not found' }))
          return
        }
        plan.status = 'approved'
        plan.updated_at = new Date().toISOString()
        await route.fulfill(jsonResponse(200, plan))
      })

      registerRoute(toPattern('plans/*/execute'), async (route) => {
        const id = route.request().url().split('/plans/')[1]?.split('/')[0]
        const plan = plans.find((entry) => entry.id === id)
        if (!plan) {
          await route.fulfill(jsonResponse(404, { message: 'Plan not found' }))
          return
        }
        plan.status = 'executing'
        plan.updated_at = new Date().toISOString()
        await route.fulfill(jsonResponse(200, plan))
      })

      registerRoute(toPattern('chat/command'), async (route) => {
        if (route.request().method() !== 'POST') {
          await route.continue()
          return
        }
        const body = route.request().postDataJSON?.() as { command?: string } | undefined
        const now = new Date().toISOString()
        const planTitle = body?.command
          ? `Auto plan for "${body.command}"`
          : 'AI generated plan'

        const plan = {
          id: `plan-${Date.now()}`,
          title: planTitle,
          description: 'Generated by mock AI command center',
          status: 'pending' as const,
          created_at: now,
          updated_at: now,
          steps: [
            {
              id: `step-${Date.now()}-1`,
              title: 'Outline objectives',
              description: 'Draft the main goals based on user input',
              status: 'pending' as const,
            },
          ],
        }

        plans.push(plan)
        await route.fulfill(jsonResponse(200, { plan }))
      })

      registerRoute(toPattern('admin/dashboard/stats'), async (route) => {
        if (route.request().method() !== 'GET') {
          await route.continue()
          return
        }
        await route.fulfill(jsonResponse(200, MOCK_STATS))
      })

      registerRoute(toPattern('admin/dashboard/*'), async (route) => {
        if (route.request().method() !== 'GET') {
          await route.continue()
          return
        }
        await route.fulfill(jsonResponse(200, { success: true }))
      })

      await use()

      for (const { url, handler } of routes) {
        await page.unroute(url, handler)
      }
    },
    { auto: true },
  ],
})

export const expect = test.expect
