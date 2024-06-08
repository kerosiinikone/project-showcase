import { test, expect } from '@playwright/test'

require('dotenv').config({ path: './.env.local' })

test.beforeEach(async ({ page }) => {
    if (!process.env.TEST_PASSWORD)
        throw new TypeError('Missing TEST_PASSWORD')

    await page.goto(
        (process.env.CLIENT_URL as string) + '/auth/signin'
    )
    await page.getByText('Sign In').click()
    await page
        .getByLabel('Password')
        .fill(process.env.TEST_PASSWORD as string)
    await page.getByRole('button', { name: 'Sign In' }).click()
    await page.waitForURL((process.env.CLIENT_URL as string) + '/')

    const session = await page.locator('pre.session').textContent()

    expect(JSON.parse(session ?? '{}')).toEqual({
        user: {
            id: '1',
            email: 'test@gmail.com',
            name: 'Test Test',
        },
        expires: expect.any(String),
    })
})

test('create a project succesfully with auth', async ({ page }) => {
    await page.goto((process.env.CLIENT_URL as string) + '/')

    // Create with Modal
    await test.step('Create a project', async () => {
        await page.getByText('Create Project').click()

        expect(page.getByText('A new project')).toBeVisible()

        const projectName = `Test Project ${Date.now()}`
        await page.getByTestId('name-input').fill(projectName)

        await page
            .getByTestId('description-input')
            .fill('This is a test project description.')

        const selectOpen = await page.waitForSelector(
            "button[name='stage']"
        )
        await selectOpen.click({ force: true })
        const selectStage = await page.waitForSelector(
            'div.space-y-2 > select'
        )

        await selectStage.selectOption(
            ['Idea', 'In development', 'Finished'],
            { force: true }
        )

        await page.waitForTimeout(1000)

        await selectOpen.click({ force: true })

        await page.waitForTimeout(1000)

        await page
            .getByTestId('submit-project-button')
            .click({ force: true })

        await page.waitForTimeout(2000)

        // Modal Closed
        expect(page.getByText('A new project')).toBeHidden()

        // Check for errors:
        const error = await page.locator('pre.error').textContent()
        expect(error).toBe('')

        await page.reload()

        const headingForProject = page.getByText(projectName)
        expect(headingForProject).toHaveText(projectName)

        await headingForProject.click()

        const pageHeader = page.getByText(projectName)

        expect(pageHeader).toHaveText(projectName)
    })
})
