import { Project, ProjectSchema } from '@/models/Project/model'
import { ProjectType, ProjectWithUser } from '@/models/Project/types'
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
    getExistingUserById,
} from '@/operations/user.operations'
import { users } from '@/services/db/schema'
import { procedure } from '@/services/trpc'
import { protectedProcedure } from '@/services/trpc/middleware'
import { eq } from 'drizzle-orm'
import { v4 } from 'uuid'
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
                    id: v4(),
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
                pid: z.string().length(36),
                author_id: z.string().length(36),
                data: ProjectSchema,
            })
        )
        .mutation(async ({ input, ctx: { session } }) => {
            if (input.author_id != session?.user?.id) {
                throw new Error('Not authorized!') // for now
            }
            try {
                return await editExistingProject(
                    input.pid,
                    input.data as ProjectType
                )
            } catch (error) {
                throw error // for now
            }
        }),
    getProjectsById: protectedProcedure
        .input(
            z.object({
                cursor: z.string().optional(),
                id: z.string().length(36).optional(),
            })
        )
        .query(async ({ input, ctx: { session } }) => {
            const projects = (await getExistingProjectsByUid(
                session?.user?.id!,
                input.cursor
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
            z.object({
                cursor: z.string().optional(),
                query: z.string().nullable().optional(),
                lastQuery: z.string().nullable().optional(),
            })
        )
        .query(async ({ input }) => {
            const { cursor, query, lastQuery: lq } = input
            const [projects, lastQuery] =
                await getExistingProjectsByQuery(cursor, query, lq)
            return {
                data: projects,
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
                id: z.string().length(36),
                joinUser: z.boolean(),
            })
        )
        .query(async ({ input }) => {
            return (await getExistingProjectById(input)) as
                | ProjectType
                | ProjectWithUser // Database Abstraction
        }),
    deleteProjectById: protectedProcedure
        .input(z.string().length(36))
        .mutation(async ({ input: pid }) => {
            return await deleteExistingProjectById(pid)
        }),
    followProject: protectedProcedure
        .input(
            z.object({
                pid: z.string().length(36),
                uid: z.string().length(36),
            })
        )
        .mutation(async ({ input: { pid, uid } }) => {
            const foundRelation = await hasProjectUserSupport(
                pid,
                uid
            )
            if (!foundRelation)
                return !!(await addProjectToUser(uid, pid))

            return true // User not found or already follows
        }),
    unfollowProject: protectedProcedure
        .input(
            z.object({
                pid: z.string().length(36),
                uid: z.string().length(36),
            })
        )
        .mutation(async ({ input: { pid, uid } }) => {
            return !!(await deleteProjectToUser(pid, uid))
        }),
    isFollowProject: protectedProcedure
        .input(
            z.object({
                pid: z.string().length(36),
                uid: z.string().length(36),
            })
        )
        .query(async ({ input: { pid, uid } }) => {
            return await hasProjectUserSupport(pid, uid)
        }),
}
