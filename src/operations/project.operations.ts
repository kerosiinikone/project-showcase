import 'server-only'

import { ProjectType } from '@/models/Project/types'
import { projects, users } from '@/services/db/schema'
import db from '../services/db.server'
import { eq, like } from 'drizzle-orm'
import { withCursorPagination } from 'drizzle-pagination'

type SingleProjecParams = {
    id: string
    joinUser: boolean
}

const LIMIT = 5

// Separate data access logic

export async function createNewProject(newProject: ProjectType) {
    return await db.insert(projects).values(newProject).returning()
}

// Get user repos from user operations with join on "own_projects"

// Refactor -> change all to db.findMany or .findOne

export async function getExistingProjectsByUid(uid?: string) {
    return await db
        .select()
        .from(projects)
        .where(uid ? eq(projects.author_id, uid) : undefined)
}

export async function getExistingProjectsByQuery(
    cursor?: string | null,
    query?: string | null,
    lastQuery?: string | null
) {
    const data = await db.query.projects.findMany(
        withCursorPagination({
            where: query ? like(projects.name, `%${query}%`) : undefined,
            limit: LIMIT,
            cursors: [
                [
                    projects.createdAt,
                    'desc',
                    cursor && query == lastQuery ? new Date(cursor) : undefined,
                ],
            ],
        })
    )
    return [data, query] as const
}

export async function getExistingProjectById({
    id,
    joinUser,
}: SingleProjecParams) {
    const query = db.select().from(projects).where(eq(projects.id, id))

    if (joinUser) {
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
