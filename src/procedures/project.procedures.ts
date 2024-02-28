import { Project, ProjectSchema } from '@/models/Project/model'
import {
    ProjectType,
    ProjectWithUser,
    Stage,
} from '@/models/Project/types'
import {
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
                return await createNewProject(project)
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
            )) as ProjectType[] // Database Abstraction

            return {
                data: projects,
                nextCursor: projects.length
                    ? projects[
                          projects.length - 1
                      ].created_at!.toISOString()
                    : null,
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
                })
                .optional()
        )
        .query(async ({ input }) => {
            input
            const [projects, lastQuery, stage] =
                await getExistingProjectsByQuery(
                    input?.cursor,
                    input?.query,
                    input?.lastQuery,
                    input?.stage
                )
            return {
                data: projects,
                stage,
                nextCursor: projects.length
                    ? projects[
                          projects.length - 1
                      ].created_at!.toISOString()
                    : null,
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
}
