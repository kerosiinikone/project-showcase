import 'server-only'

import { UserType } from '@/models/User/types'
import {
    projects,
    users,
    usersToProjects,
} from '@/services/db/schema'
import { and, count, eq, gt } from 'drizzle-orm'
import db from '../services/db.server'
import { withCursorPagination } from 'drizzle-pagination'
import {
    ProjectType,
    ProjectTypeWithId,
} from '@/models/Project/types'

export const LIMIT = 9

export async function createNewUser(newUser: UserType) {
    return await db.insert(users).values(newUser).returning()
}

export async function addProjectToUser(id: string, pid: number) {
    return await db
        .insert(usersToProjects)
        .values({
            user_id: id,
            project_id: pid,
        })
        .returning()
        .then((res) => res[0] ?? null)
}

export async function deleteProjectToUser(pid: number, id: string) {
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
    cursor?: number
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
            return await db.query.projects.findFirst({
                where: eq(projects.id, project.project_id),
            })
        })
    )
}

/*
    SELECT p.project_name, COUNT(*) as support_count
    FROM Projects p
    JOIN UserToProjects utp ON p.project_id = utp.project_id
    JOIN Users u ON utp.user_id = u.user_id
    WHERE u.author_id = x -- Replace 'x' with the actual author_id
    GROUP BY p.project_name;
*/

export async function getAggregatedSupports(
    id: string,
    lastCursor: number
) {
    return await Promise.all(
        (
            await db
                .select({
                    id: projects.id,
                    count: count(),
                })
                .from(projects)
                .rightJoin(
                    usersToProjects,
                    eq(projects.id, usersToProjects.project_id)
                )
                .rightJoin(
                    users,
                    eq(usersToProjects.user_id, users.id)
                )
                .where(
                    and(
                        eq(projects.author_id, id),
                        gt(projects.id, lastCursor)
                    )
                )
                .limit(LIMIT)
                .groupBy(projects.id)
        ).map(async (project) => {
            const single = await db.query.projects.findFirst({
                where: eq(projects.id, project.id!),
            })
            return {
                count: project.count,
                project: single as ProjectTypeWithId,
            }
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
