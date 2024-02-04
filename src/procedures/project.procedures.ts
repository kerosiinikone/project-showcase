import { Project, ProjectSchema } from '@/models/Project/model'
import { ProjectType, ProjectWithUser } from '@/models/Project/types'
import {
    createNewProject,
    deleteExistingProjectById,
    getExistingProjectById,
    getExistingProjectsByQuery,
    getExistingProjectsByUid,
    hasProjectUserSupport,
} from '@/operations/project.operations'
import { TRPCError } from '@trpc/server'
import { addProjectToUser } from '@/operations/user.operations'
import { procedure } from '@/services/trpc'
import { protectedProcedure } from '@/services/trpc/middleware'
import db from '../services/db.server'
import { z } from 'zod'
import { v4 } from 'uuid'

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
    getProjectsById: procedure
        .input(
            z.object({
                cursor: z.string().optional(),
                id: z.string().length(36).optional(),
            })
        )
        .query(async ({ input }) => {
            const projects = (await getExistingProjectsByUid(
                input.id,
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
