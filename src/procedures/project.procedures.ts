import { Project, ProjectSchema } from '@/models/Project/model'
import { ProjectType, ProjectWithUser } from '@/models/Project/types'
import {
    createNewProject,
    deleteExistingProjectById,
    getExistingProjectById,
    getExistingProjectsByQuery,
    getExistingProjectsByUid,
} from '@/operations/project.operations'
import { addProjectToUser } from '@/operations/user.operations'
import { users } from '@/services/db/schema'
import { procedure } from '@/services/trpc'
import { protectedProcedure } from '@/services/trpc/middleware'
import { eq } from 'drizzle-orm'
import { v4 } from 'uuid'
import db from '../services/db.server'
import { z } from 'zod'

// Project Data Transfer Object

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
                return (await createNewProject(project))[0]
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
            return (await deleteExistingProjectById(pid))[0]
        }),
    followProject: protectedProcedure
        .input(
            z.object({
                pid: z.string().length(36),
                uid: z.string().length(36),
            })
        )
        .mutation(async ({ input: { pid, uid } }) => {
            // Abstract elsewhere !!!
            const user = await db?.query.users.findFirst({
                where: eq(users.id, uid),
                with: {
                    supported_projects: {
                        with: {
                            project: true,
                        },
                    },
                },
            })
            if (
                !user ||
                !user.supported_projects.some(
                    ({ project }) => project.id == pid
                )
            )
                return !!(await addProjectToUser(uid, pid))

            return true // User not found or already follows
        }),
}
