import 'server-only'

import { UserType } from '@/models/User/types'
import db from '../services/db.server'
import { users } from '@/services/db/schema'
import { eq } from 'drizzle-orm'

export async function createNewUser(newUser: UserType) {
    return await db.insert(users).values(newUser).returning()
}

export async function getExistingUserById(id: string) {
    return await db.select().from(users).where(eq(users.id, id))
}
