import 'server-only'

import { UserType } from '@/models/User/types'
import { users, usersToProjects } from '@/services/db/schema'
import { eq } from 'drizzle-orm'
import db from '../services/db.server'

export async function createNewUser(newUser: UserType) {
    return await db.insert(users).values(newUser).returning()
}

// Move elsewhere -> maybe a better way to achieve?
// Change uuid to text on schema id fields or cast id's as uuid
// Add to Supported

export async function addProjectToUser(id: string, pid: string) {
    return await db
        .insert(usersToProjects)
        .values({
            user_id: id,
            project_id: pid,
        })
        .returning()
}

export async function getExistingUserById(id: string) {
    return await db.query.users.findFirst({
        where: eq(users.id, id),
        with: {
            supported_projects: {
                with: {
                    project: true,
                },
            },
            own_projects: true,
        },
    })
}
