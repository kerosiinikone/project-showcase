import { defineConfig } from 'drizzle-kit'
import 'drizzle-orm'

export default defineConfig({
    schema: './src/services/db/schema/test.ts',
    dialect: 'sqlite',
    dbCredentials: {
        url: ':memory:',
    },
})
