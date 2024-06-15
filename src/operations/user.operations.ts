import 'server-only'

import { UserType } from '@/models/User/types'
import {
    accounts,
    projects,
    users,
    usersToProjects,
} from '@/services/db/schema'
import { and, count, eq, gt } from 'drizzle-orm'
import * as database from '../services/db.server'
import { ProjectTypeWithId } from '@/models/Project/types'
import { usersToProjectsCursor } from './cursor'

const db = database?.default.db

export const LIMIT = 9

export async function createNewUser(newUser: UserType) {
    return await db
        .insert(users)
        .values(newUser)
        .then((res) => res[0] ?? null)
}

export async function addProjectToUser(id: string, pid: number) {
    return await db.insert(usersToProjects).values({
        user_id: id,
        project_id: pid,
    })
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
    cur?: string
) {
    return await Promise.all(
        (
            await db
                .select()
                .from(usersToProjects)
                .orderBy(...usersToProjectsCursor.orderBy)
                .where(
                    and(
                        usersToProjectsCursor.where(
                            cur
                                ? usersToProjectsCursor.parse(cur)
                                : null
                        ),
                        uid
                            ? eq(usersToProjects.user_id, uid)
                            : undefined
                    )
                )
                .limit(LIMIT)
        ).map(async (project) => {
            return await db.query.projects.findFirst({
                where: eq(projects.id, project.project_id),
            })
        })
    )
}

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

export async function getGithubAccessToken(loggedUser: string) {
    const { token } = (
        await db
            .select({
                token: accounts.access_token,
            })
            .from(accounts)
            .where(eq(accounts.userId, loggedUser))
    )[0]
    return token as string
}
