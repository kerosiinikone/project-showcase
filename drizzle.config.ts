import { Config, defineConfig } from 'drizzle-kit'

// export default defineConfig({
//     schema: './src/services/db/schema/index.ts',
//     out: './drizzle/migrations',
//     driver: "pg",

//     dbCredentials: {
//         connectionString:
//             process.env.DB_URL ||
//             'postgresql://postgres:admin@localhost:5435/postgres',
//     },
// }) satisfies Config

export default defineConfig({
    schema: './src/services/db/schema/index.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url:
            process.env.DB_URL ||
            'postgresql://postgres:admin@localhost:5435/postgres',
    },
    verbose: true,
    strict: true,
}) satisfies Config
