import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './db/schema'

// For the sake of Next 14

declare global {
    var db: PostgresJsDatabase<typeof schema> | undefined
}

let db: PostgresJsDatabase<typeof schema>

if (process.env.NODE_ENV === 'production') {
    db = drizzle(postgres(process.env.DB_URL!), { schema })
} else {
    if (!global.db) {
        global.db = drizzle(postgres(process.env.DB_URL!), { schema })
    }
    db = global.db
}

export default db
