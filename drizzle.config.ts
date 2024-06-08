import { Config, defineConfig } from 'drizzle-kit'
import 'drizzle-orm'

export default defineConfig({
    schema: './src/services/db/schema/index.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url:
            process.env.DB_URL ||
            'postgresql://postgres:admin@localhost:5435/postgres',
    },
    verbose: true,
    strict: false,
}) satisfies Config
