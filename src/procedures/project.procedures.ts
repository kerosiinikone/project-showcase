import {
    ProjectType,
    ProjectTypeWithId,
    SingleProjectType,
    Stage,
} from '@/models/Project/types'
import { ProjectSchema } from '@/models/Project/validation'
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
    getGithubAccessToken,
} from '@/operations/user.operations'
import { procedure } from '@/services/trpc'
import { protectedProcedure } from '@/services/trpc/middleware'
import { TRPCError } from '@trpc/server'
import { v4 } from 'uuid'
import * as winston from 'winston'
import { z } from 'zod'

// Project Data Transfer Object

const BASE_HEADERS = {
    'X-GitHub-Api-Version': '2022-11-28',
    Accept: 'application/vnd.github+json',
}

const DEFAULT_DESCRIPTION = 'A Project'

const GITHUB_PREFIX = 'https://github.com/'

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.cli(),
    transports: [new winston.transports.Console()],
})

export default {
    createProject: protectedProcedure
        .input(ProjectSchema) // ZOD
        .mutation(async ({ input, ctx: { session } }) => {
            if (
                input.github_url &&
                !input.github_url.startsWith(GITHUB_PREFIX)
            ) {
                logger.error('Validation error in createProject', {
                    input,
                })
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Bad Github URL',
                })
            }

            try {
                const newProject = await createNewProject({
                    ...input,
                    author_id: session?.user?.id!,
                    created_at: new Date(),
                    updated_at: new Date(),
                    description:
                        input.description || DEFAULT_DESCRIPTION,
                    image: null,
                    alt_id: v4(),
                })

                if (input.tags && input.tags.length) {
                    await addTagsToProject(input.tags, newProject.id)
                }

                return newProject as ProjectTypeWithId
            } catch (error) {
                logger.error('Database error in createProject', {
                    error,
                    input,
                })
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Database: Error saving project.',
                })
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
                const { tags, ...restData } = data

                if (author_id != session?.user?.id) {
                    logger.error('Auth error in editProject', {
                        session,
                        input: { pid, author_id, data },
                    })
                    throw new TRPCError({
                        message: 'Not authorized!',
                        code: 'UNAUTHORIZED',
                    })
                }

                try {
                    const result = (
                        await Promise.all([
                            addTagsToProject(tags ?? [], pid),
                            editExistingProject(
                                pid,
                                restData as ProjectType
                            ),
                        ])
                    )[1]

                    return !!result
                } catch (error) {
                    logger.error('Database error in editProject', {
                        error,
                        input: { pid, author_id, data },
                    })
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Database: Error editing project.',
                    })
                }
            }
        ),
    getProjectsById: protectedProcedure
        .input(z.string().optional())
        .query(async ({ input, ctx: { session } }) => {
            try {
                const projects = (await getExistingProjectsByUid(
                    session?.user?.id!,
                    input
                )) as ProjectTypeWithId[] // Database Abstraction

                const lastToken = cursor.serialize(projects.at(-1))

                return {
                    data: projects,
                    nextCursor: lastToken,
                }
            } catch (error) {
                logger.error('Database error in getProjectsById', {
                    error,
                    input,
                })
                if (input) {
                    // Existing data
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Database: Error fetching project.',
                    })
                }

                return {
                    data: [], // Initial data load non-populated
                    initialError: true,
                }
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
                    hasGithub: z.boolean().nullable().optional(),
                })
                .optional()
        )
        .query(async ({ input }) => {
            try {
                const [projects, lastQuery, stage] =
                    await getExistingProjectsByQuery(
                        input?.cursor,
                        input?.query,
                        input?.lastQuery,
                        input?.stage,
                        input?.tags,
                        input?.hasGithub
                    )

                const lastToken = cursor.serialize(projects.at(-1))

                return {
                    data: projects as ProjectTypeWithId[],
                    stage,
                    hasGithub: input?.hasGithub,
                    tags: input?.tags,
                    nextCursor: lastToken,
                    lastQuery,
                }
            } catch (error) {
                logger.error('Database error in getProjectsByQuery', {
                    error,
                    input,
                })

                if (input?.cursor) {
                    // Existing data
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Database: Error fetching project.',
                    })
                }

                return {
                    data: [], // Initial data load non-populated
                    initialError: true,
                }
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
            try {
                return (await getExistingProjectById(
                    input
                )) as SingleProjectType
            } catch (error) {
                logger.error('Database error in getProjectById', {
                    error,
                    input,
                })
                return []
                // throw new TRPCError({
                //     code: 'INTERNAL_SERVER_ERROR',
                //     message: 'Database: Error fetching project.',
                // })
            }
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
                try {
                    return !!(await deleteExistingProjectById(pid))
                } catch (error) {
                    logger.error(
                        'Database error in deleteProjectById',
                        {
                            error,
                            input: { pid, author_id },
                        }
                    )
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Database: Error deleting project.',
                    })
                }
            }
        ),
    followProject: protectedProcedure
        .input(z.number())
        .mutation(async ({ input: pid, ctx: { session } }) => {
            try {
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
            } catch (error) {
                logger.error('Database error in followProject', {
                    error,
                    input: { pid },
                })
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Database: Error following project.',
                })
            }
        }),
    unfollowProject: protectedProcedure
        .input(z.number())
        .mutation(async ({ input: pid, ctx: { session } }) => {
            try {
                return !!(await deleteProjectToUser(
                    pid,
                    session?.user?.id!
                ))
            } catch (error) {
                logger.error('Database error in unfollowProject', {
                    error,
                    input: { pid },
                })
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Database: Error unfollowing project.',
                })
            }
        }),
    isFollowProject: protectedProcedure
        .input(z.number())
        .query(async ({ input: pid, ctx: { session } }) => {
            if (!session?.user) {
                return false
            }
            try {
                return await hasProjectUserSupport(
                    pid,
                    session.user.id!
                )
            } catch (error) {
                logger.error('Database error in isFollowProject', {
                    error,
                    input: { pid },
                })

                return false // To not block the execution

                // throw new TRPCError({
                //     code: 'INTERNAL_SERVER_ERROR',
                //     message: 'Database: Error.',
                // })
            }
        }),
    getReadmeFile: protectedProcedure
        .input(z.object({ repo: z.string(), user: z.string() }))
        .query(
            async ({ input: { repo, user }, ctx: { session } }) => {
                try {
                    const data = await fetch(
                        `https://api.github.com/repos/${user}/${repo}/readme`,
                        {
                            headers: {
                                ...BASE_HEADERS,
                                Authorization: `Bearer ${session?.user.gh_access_token}`,
                            },
                        }
                    )

                    const { content } = await data.json()

                    return content as string
                } catch (error) {
                    logger.error('Database error in getReadmeFile', {
                        error,
                        input: { repo, user },
                    })
                    return ''
                }
            }
        ),
}
