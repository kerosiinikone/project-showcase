import 'server-only'

import { UserType } from '@/models/User/types'
import {
    projects,
    users,
    usersToProjects,
} from '@/services/db/schema'
import { count, eq, sql } from 'drizzle-orm'
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
        .then((res) => res[0] ?? null)
}

export async function getExistingUserById(id: string) {
    return await db.query.users.findFirst({
        where: eq(users.id, id),
        with: {
            supported_projects: true,
            own_projects: true,
        },
    })
}

export async function getAggregatedSupportUser(id: string) {
    return await db
        .select({ value: count() })
        .from(projects)
        .where(eq(projects.author_id, id))
        .rightJoin(
            usersToProjects,
            eq(projects.id, usersToProjects.project_id)
        )
        .then((res) => res[0] ?? null)
}
