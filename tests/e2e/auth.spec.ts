import { test, expect } from '@playwright/test'

require('dotenv').config({ path: './.env.local' })

test('Basic auth', async ({ page }) => {
    if (!process.env.TEST_PASSWORD)
        throw new TypeError('Missing TEST_PASSWORD')

    await test.step('should login', async () => {
        await page.goto(
            (process.env.CLIENT_URL as string) + '/auth/signin'
        )
        await page.getByText('Sign In').click()
        await page
            .getByLabel('Password')
            .fill(process.env.TEST_PASSWORD as string)
        await page.getByRole('button', { name: 'Sign In' }).click()
        await page.waitForURL(
            (process.env.CLIENT_URL as string) + '/'
        )
        const session = await page
            .locator('pre.session')
            .textContent()
        expect(JSON.parse(session ?? '{}')).toEqual({
            user: {
                id: '1',
                email: 'test@gmail.com',
                name: 'Test Test',
            },
            expires: expect.any(String),
        })
    })

    await test.step('should logout', async () => {
        await page.goto(
            (process.env.CLIENT_URL as string) + '/auth/signin'
        )
        await page.getByText('Sign Out').click()
        await page
            .getByRole('heading', { name: 'Community Projects' })
            .waitFor()

        expect(await page.locator('pre.session').textContent()).toBe(
            'null'
        )
    })
})
