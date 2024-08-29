import 'server-only'

import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './db/schema'
import * as betterSqlite from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as testSchema from './db/schema/test'
import { migrate } from './db/test_migration'

/* eslint-disable */

let db: PostgresJsDatabase<typeof schema>
let testDb:
    | betterSqlite.BetterSQLite3Database<typeof testSchema>
    | undefined

const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.ENVIRONMENT === 'production'
const isTest =
    process.env.ENVIRONMENT === 'test' ||
    process.env.NODE_ENV === 'test'

if (isProduction) {
    db = drizzle(postgres(process.env.DB_URL || ''), { schema })
} else if (isTest) {
    const sqlite = new Database('test.db')
    migrate(sqlite)

    testDb = betterSqlite.drizzle(sqlite, { schema: testSchema })
    db = drizzle(postgres(process.env.DB_URL || ''), { schema })
} else {
    db = drizzle(postgres(process.env.DB_URL || ''), { schema })
}

export default { db, testDb }
