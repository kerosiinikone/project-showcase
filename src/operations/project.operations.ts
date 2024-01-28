import 'server-only'

import { ProjectType } from '@/models/Project/types'
import { projects } from '@/services/db/schema'
import { eq, ilike } from 'drizzle-orm'
import { withCursorPagination } from 'drizzle-pagination'
import db from '../services/db.server'

type SingleProjecParams = {
    id: string
    joinUser: boolean
}

const LIMIT = 9 // Limit search results

// Separate data access logic

export async function createNewProject(newProject: ProjectType) {
    return await db.insert(projects).values(newProject).returning()
}

// Get user repos from user operations with join on "own_projects"

// Refactor -> change all to db.findMany or .findOne

export async function getExistingProjectsByUid(
    uid?: string,
    cursor?: string
) {
    return await db.query.projects.findMany(
        withCursorPagination({
            where: uid ? eq(projects.author_id, uid) : undefined,
            limit: LIMIT,
            cursors: [
                [
                    projects.created_at,
                    'desc',
                    cursor ? new Date(cursor) : undefined,
                ],
            ],
        })
    )
}

export async function getExistingProjectsByQuery(
    cursor?: string | null,
    query?: string | null,
    lastQuery?: string | null
) {
    const data = await db.query.projects.findMany(
        withCursorPagination({
            where: query
                ? ilike(projects.name, `%${query}%`)
                : undefined,
            limit: LIMIT,
            cursors: [
                [
                    projects.created_at,
                    'desc',
                    cursor && query == lastQuery
                        ? new Date(cursor)
                        : undefined,
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
    return await db.query.projects.findFirst({
        where: eq(projects.id, id),
        with: {
            author: joinUser ? true : undefined,
        },
    })
}

export async function deleteExistingProjectById(pid: string) {
    return await db
        .delete(projects)
        .where(eq(projects.id, pid))
        .returning({ id: projects.id })
}
