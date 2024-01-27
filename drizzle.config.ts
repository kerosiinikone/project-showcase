import { Config, defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: './src/services/db/schema/index.ts',
    out: './drizzle/migrations',
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.DB_URL,
    },
}) satisfies Config
