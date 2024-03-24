import { Project, ProjectSchema } from '@/models/Project/model'
import {
    ProjectType,
    ProjectTypeWithId,
    ProjectWithUser,
    Stage,
} from '@/models/Project/types'
import { cursor } from '@/operations/cursor'
import {
    addTagsToProject,
    createNewProject,
    deleteExistingProjectById,
    editExistingProject,
    getExistingProjectById,
    getExistingProjectsByQuery,
    getExistingProjectsByUid,
    hasProjectUserSupport,
} from '@/operations/project.operations'
import {
    addProjectToUser,
    deleteProjectToUser,
} from '@/operations/user.operations'
import { GithubAccountDBAdapter } from '@/services/auth'
import { ReadmeResponse } from '@/services/github'
import { procedure } from '@/services/trpc'
import { protectedProcedure } from '@/services/trpc/middleware'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

// Project Data Transfer Object

// throw new TRPCError({
//     code: 'INTERNAL_SERVER_ERROR',
//     message: 'An unexpected error occurred, please try again later.',
//     // optional: pass the original error to retain stack trace
//     cause: theError,
// })

const BASE_HEADERS = {
    'X-GitHub-Api-Version': '2022-11-28',
    Accept: 'application/vnd.github+json',
}

export default {
    createProject: protectedProcedure
        .input(ProjectSchema)
        .mutation(async ({ input, ctx: { session } }) => {
            // Can be typecasted as "ProjectType" since "ProjectParams" works here

            try {
                const project = new Project({
                    ...(input as ProjectType),
                    author_id: session?.user?.id!,
                })
                const newProject = await createNewProject(project)

                if (input.tags && input.tags.length) {
                    await addTagsToProject(input.tags, newProject.id)
                }

                return newProject
            } catch (error) {
                throw error // for now
            }
        }),
    editProject: protectedProcedure
        .input(
            z.object({
                pid: z.number(),
                author_id: z.string().length(36),
                data: ProjectSchema,
            })
        )
        .mutation(
            async ({
                input: { pid, author_id, data },
                ctx: { session },
            }) => {
                if (author_id != session?.user?.id) {
                    throw new Error('Not authorized!') // for now
                }
                try {
                    return await editExistingProject(
                        pid,
                        data as ProjectType
                    )
                } catch (error) {
                    throw error // for now
                }
            }
        ),
    getProjectsById: protectedProcedure
        .input(z.string().optional())
        .query(async ({ input, ctx: { session } }) => {
            const projects = (await getExistingProjectsByUid(
                session?.user?.id!,
                input
            )) as ProjectTypeWithId[] // Database Abstraction

            const lastToken = cursor.serialize(projects.at(-1))

            return {
                data: projects,
                nextCursor: lastToken,
            }
        }),
    getProjectsByQuery: procedure
        .input(
            z
                .object({
                    cursor: z.string().optional(),
                    query: z.string().nullable().optional(),
                    lastQuery: z.string().nullable().optional(),
                    stage: z.array(z.nativeEnum(Stage)),
                    tags: z.array(z.string()), // Validation
                })
                .optional()
        )
        .query(async ({ input }) => {
            const [projects, lastQuery, stage] =
                await getExistingProjectsByQuery(
                    input?.cursor,
                    input?.query,
                    input?.lastQuery,
                    input?.stage,
                    input?.tags
                )

            const lastToken = cursor.serialize(projects.at(-1))

            return {
                data: projects,
                stage,
                tags: input?.tags,
                nextCursor: lastToken,
                lastQuery,
            }
        }),
    getProjectById: procedure
        .input(
            z.object({
                id: z.number(),
                joinUser: z.boolean(),
            })
        )
        .query(async ({ input }) => {
            return (await getExistingProjectById(input)) as
                | ProjectType
                | ProjectWithUser // Database Abstraction
        }),
    deleteProjectById: protectedProcedure
        .input(
            z.object({
                pid: z.number(),
                author_id: z.string().length(36),
            })
        )
        .mutation(
            async ({
                input: { pid, author_id },
                ctx: { session },
            }) => {
                if (session?.user?.id !== author_id) {
                    throw new TRPCError({
                        message: 'No auth',
                        code: 'UNAUTHORIZED',
                    })
                }
                return !!(await deleteExistingProjectById(pid))
            }
        ),
    followProject: protectedProcedure
        .input(z.number())
        .mutation(async ({ input: pid, ctx: { session } }) => {
            const foundRelation = await hasProjectUserSupport(
                pid,
                session?.user?.id!
            )
            if (!foundRelation)
                return !!(await addProjectToUser(
                    session?.user?.id!,
                    pid
                ))

            return true // User not found or already follows
        }),
    unfollowProject: protectedProcedure
        .input(z.number())
        .mutation(async ({ input: pid, ctx: { session } }) => {
            return !!(await deleteProjectToUser(
                pid,
                session?.user?.id!
            ))
        }),
    isFollowProject: protectedProcedure
        .input(z.number())
        .query(async ({ input: pid, ctx: { session } }) => {
            if (!session?.user) {
                return false
            }
            return await hasProjectUserSupport(pid, session.user.id!)
        }),
    getReadmeFile: protectedProcedure
        .input(z.object({ repo: z.string(), user: z.string() }))
        .query(
            async ({ input: { repo, user }, ctx: { session } }) => {
                try {
                    const access_token =
                        await GithubAccountDBAdapter.getGithubAccessToken(
                            session?.user?.id!
                        )
                    const data = await fetch(
                        `https://api.github.com/repos/${user}/${repo}/readme`,
                        {
                            headers: {
                                ...BASE_HEADERS,
                                Authorization: `Bearer ${access_token}`,
                            },
                        }
                    )

                    const { content } = await data.json()

                    return content as string
                } catch (error) {
                    return ''
                }
            }
        ),
}
