import 'server-only'

import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './db/schema'
import * as betterSqlite from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as testSchema from './db/schema/test'
import { migrate } from './db/test_migration'

// For the sake of Next 14 -> refactor env logic

declare global {
    var db: PostgresJsDatabase<typeof schema> | undefined
    var testDb:
        | betterSqlite.BetterSQLite3Database<typeof testSchema>
        | undefined
}

let db: PostgresJsDatabase<typeof schema>
let testDb:
    | betterSqlite.BetterSQLite3Database<typeof testSchema>
    | undefined

if (
    process.env.NODE_ENV === 'production' ||
    process.env.ENVIRONMENT === 'production'
) {
    db = drizzle(postgres(process.env.DB_URL!), { schema })
    global.testDb = undefined
    testDb = global.testDb
}
if (
    process.env.ENVIRONMENT === 'test' ||
    process.env.NODE_ENV === 'test'
) {
    const sqlite = new Database(':memory:')
    migrate(sqlite)

    const liteDb = betterSqlite.drizzle(sqlite, {
        schema: testSchema,
    })
    if (!global.db) {
        global.db = drizzle(postgres(process.env.DB_URL!), { schema })
    }
    db = global.db

    if (!global.testDb) {
        global.testDb = liteDb
    }
    testDb = global.testDb
}
if (process.env.ENVIRONMENT === 'staging') {
    db = drizzle(postgres(process.env.DB_URL!), { schema })

    if (!global.db) {
        global.db = drizzle(postgres(process.env.DB_URL!), { schema })
    }
    db = global.db
} else {
    if (!global.db) {
        global.db = drizzle(postgres(process.env.DB_URL!), { schema })
    }
    db = global.db
    global.testDb = undefined
    testDb = global.testDb
}

export default { db, testDb }
