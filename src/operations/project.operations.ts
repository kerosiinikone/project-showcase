import 'server-only'

import { ProjectType } from '@/models/Project/types'
import { projects, users } from '@/services/db/schema'
import db from '../services/db.server'
import { eq } from 'drizzle-orm'

export async function createNewProject(newProject: ProjectType) {
    return await db.insert(projects).values(newProject).returning()
}

export async function getExistingProjects() {
    return await db.select().from(projects)
}

export async function getExistingProjectById({
    id,
    joinUsers,
}: {
    id: string
    joinUsers: boolean
}) {
    const queryWithoutJoin = db
        .select()
        .from(projects)
        .where(eq(projects.id, id))
    if (joinUsers) {
        return await queryWithoutJoin.leftJoin(
            users,
            eq(users.id, projects.author_id)
        )
    }
    return await queryWithoutJoin
}

export async function deleteExistingProjectById(pid: string) {
    return await db
        .delete(projects)
        .where(eq(projects.id, pid))
        .returning({ id: projects.id })
}
