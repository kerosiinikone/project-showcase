import 'server-only'

import { ProjectType } from '@/models/Project/types'
import { projects, users } from '@/services/db/schema'
import db from '../services/db.server'
import { eq } from 'drizzle-orm'

// Separate business logic

export async function createNewProject(newProject: ProjectType) {
    return await db.insert(projects).values(newProject).returning()
}

export async function getExistingProjects(uid?: string) {
    const query = db.select().from(projects)
    if (uid) {
        return await query.where(eq(projects.author_id, uid))
    }
    return await query
}

export async function getExistingProjectById({
    id,
    joinUsers,
}: {
    id: string
    joinUsers: boolean
}) {
    const query = db.select().from(projects).where(eq(projects.id, id))
    if (joinUsers) {
        return await query.leftJoin(users, eq(users.id, projects.author_id))
    }
    return await query
}

export async function deleteExistingProjectById(pid: string) {
    return await db
        .delete(projects)
        .where(eq(projects.id, pid))
        .returning({ id: projects.id })
}
