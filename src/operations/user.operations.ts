import 'server-only'

import { UserType } from '@/models/User/types'
import {
    projects,
    users,
    usersToProjects,
} from '@/services/db/schema'
import { and, count, eq } from 'drizzle-orm'
import db from '../services/db.server'
import { withCursorPagination } from 'drizzle-pagination'
import { ProjectType } from '@/models/Project/types'

export const LIMIT = 9

export async function createNewUser(newUser: UserType) {
    return await db.insert(users).values(newUser).returning()
}

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

export async function deleteProjectToUser(id: string, pid: string) {
    return await db
        .delete(usersToProjects)
        .where(
            and(
                eq(usersToProjects.project_id, pid),
                eq(usersToProjects.user_id, id)
            )
        )
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

export async function getSupportedProjectsById(
    uid?: string,
    cursor?: string
) {
    return await Promise.all(
        (
            await db.query.usersToProjects.findMany(
                withCursorPagination({
                    where: uid
                        ? eq(usersToProjects.user_id, uid)
                        : undefined,
                    limit: LIMIT,
                    cursors: [
                        [
                            usersToProjects.project_id, // Fix this
                            'desc',
                            cursor ? cursor : undefined,
                        ],
                    ],
                })
            )
        ).map(async (project) => {
            return (await db.query.projects.findFirst({
                where: eq(projects.id, project.project_id),
            })) as ProjectType
        })
    )
}

export async function getAggregatedSupportCount(id: string) {
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
