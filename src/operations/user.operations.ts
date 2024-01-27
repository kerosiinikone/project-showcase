import 'server-only'

import { UserType } from '@/models/User/types'
import { users } from '@/services/db/schema'
import { eq, sql } from 'drizzle-orm'
import db from '../services/db.server'

export async function createNewUser(newUser: UserType) {
    return await db.insert(users).values(newUser).returning()
}

// Move elsewhere -> maybe a better way to achieve?
// Change uuid to text on schema id fields or cast id's as uuid
export async function addProjectToUser(id: string, pid: string) {
    const updateSql = sql`UPDATE ${users} SET ${users.own_projects} = ${users.own_projects} || `
    updateSql.append(sql`ARRAY[${pid}] WHERE ${users.id} = ${id};`)
    await db.execute(updateSql)
}

export async function getExistingUserById(id: string) {
    return await db.select().from(users).where(eq(users.id, id))
}
