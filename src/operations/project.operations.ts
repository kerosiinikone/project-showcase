import 'server-only'

import { ProjectType, Stage } from '@/models/Project/types'
import {
    projects,
    projectsToTags,
    tags,
    usersToProjects,
} from '@/services/db/schema'
import { and, eq, ilike, exists, or, inArray } from 'drizzle-orm'
import { withCursorPagination } from 'drizzle-pagination'
import db from '../services/db.server'
import { serialize } from 'drizzle-cursor'
import { cursor } from './cursor'

type SingleProjecParams = {
    id: number
    joinUser: boolean
}

export const LIMIT = 9 // Limit search results

// Separate data access logic

export async function hasProjectUserSupport(
    pid: number,
    uid: string
) {
    return !!(await db?.query.usersToProjects.findFirst({
        where: and(
            eq(usersToProjects.user_id, uid),
            eq(usersToProjects.project_id, pid)
        ),
    }))
}

export async function createNewProject(newProject: ProjectType) {
    return await db
        .insert(projects)
        .values(newProject)
        .returning()
        .then((res) => res[0] ?? null)
}

// Make a separate type later for edit input
export async function editExistingProject(
    pid: number,
    data: ProjectType
) {
    return await db
        .update(projects)
        .set(data)
        .where(eq(projects.id, pid))
        .then((res) => res[0] ?? null)
}

// Get user repos from user operations with join on "own_projects"

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
    cur?: string | null,
    query?: string | null,
    lastQuery?: string | null,
    stage: Stage[] = [],
    tagList: string[] = []
) {
    // const data = await db.query.projects.findMany(
    //     withCursorPagination({
    //         where: and(
    //             query
    //                 ? ilike(projects.name, `%${query}%`)
    //                 : undefined,
    //             stage.length
    //                 ? or(
    //                       ...stage.map((s) => {
    //                           return eq(projects.stage, s)
    //                       })
    //                   )
    //                 : undefined
    //         ),
    //         limit: LIMIT,
    //         cursors: [
    //             [
    //                 projects.created_at,
    //                 'desc',
    //                 cursor && query == lastQuery
    //                     ? new Date(cursor)
    //                     : undefined,
    //             ],
    //         ],
    //     })
    // )

    const data = (
        await db
            .selectDistinctOn([projects.id])
            .from(projects)
            .leftJoin(
                projectsToTags,
                eq(projectsToTags.project_id, projects.id)
            )
            .leftJoin(tags, eq(tags.id, projectsToTags.tag_id))
            .orderBy(...cursor.orderBy)
            .where(
                and(
                    cursor.where(
                        query == lastQuery ? cursor.parse(cur!) : null
                    ),
                    query
                        ? or(
                              ilike(projects.name, `%${query}%`),
                              ilike(tags.name, `%${query}%`)
                          )
                        : undefined,
                    stage.length
                        ? or(
                              ...stage.map((s) => {
                                  return eq(projects.stage, s)
                              })
                          )
                        : undefined,
                    tagList.length
                        ? inArray(tags.name, tagList)
                        : undefined
                )
            )
            .limit(LIMIT)
    ).map((i) => i.project)

    return [data, query, stage] as const
}

export async function addTagsToProject(tag: string[], pid: number) {
    for (let t of tag) {
        const existingTag = await db
            .select()
            .from(tags)
            .where(eq(tags.name, t))
            .then((res) => res[0] ?? null)

        if (existingTag) {
            await db.insert(projectsToTags).values({
                project_id: pid,
                tag_id: existingTag.id,
            })
        } else {
            const newTag = await db
                .insert(tags)
                .values({
                    name: t,
                })
                .returning()
                .then((res) => res[0] ?? null)
            await db.insert(projectsToTags).values({
                project_id: pid,
                tag_id: newTag.id,
            })
        }
    }
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

export async function deleteExistingProjectById(pid: number) {
    return await db
        .delete(projects)
        .where(eq(projects.id, pid))
        .returning({ id: projects.id })
        .then((res) => res[0] ?? null)
}
