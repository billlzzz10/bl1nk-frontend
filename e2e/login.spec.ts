import { test, expect, MOCK_USER, MOCK_WORKSPACES } from './fixtures/mockApi'

test.describe('Authenticated workspace experience', () => {
  test('allows login and command-driven plan creation', async ({ page }) => {
    await page.goto('/auth/login', { waitUntil: 'networkidle' })
    await expect(page).toHaveURL(/\/auth\/login/)
    await expect(
      page.getByRole('heading', { name: 'Welcome to bl1nk Note' }),
    ).toBeVisible({ timeout: 15_000 })

    await page.getByLabel('Email').fill(MOCK_USER.email)
    await page.getByLabel('Password').fill('supersecret')
    const loginResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/auth/login') && response.request().method() === 'POST',
    )
    await page.getByRole('button', { name: 'Sign In' }).click()
    await loginResponsePromise

    await page.goto('/workspace', { timeout: 60_000 })

    await expect(page).toHaveURL(/\/workspace/)
    await expect(page.getByText('Project Explorer')).toBeVisible()
    await expect(page.getByText('System Monitor')).toBeVisible()
    await expect(page.getByText(MOCK_USER.name)).toBeVisible()

    const command = 'Prepare marketing launch kit'
    const commandInput = page.getByPlaceholder(/Type your command here/)
    await expect(commandInput).toBeEnabled()
    await commandInput.fill(command)
    await page.keyboard.press('Enter')

    await expect(
      page.locator('.chat-pane').getByText(`Created plan: Auto plan for "${command}"`),
    ).toBeVisible()
    await expect(
      page.locator('.workspace-sidebar').getByText(`Auto plan for "${command}"`),
    ).toBeVisible()

    await page.getByRole('button', { name: /Select Workspace|Operations Control/ }).click()
    await expect(page.getByRole('button', { name: MOCK_WORKSPACES[0].name })).toBeVisible()
  })
})
