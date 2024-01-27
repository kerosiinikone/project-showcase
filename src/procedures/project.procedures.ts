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
import { procedure } from '@/services/trpc'
import { protectedProcedure } from '@/services/trpc/middleware'
import { v4 } from 'uuid'
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

                // Helper function ?
                //await addProjectToUser(session?.user?.id!, project.id)

                return (await createNewProject(project))[0] as ProjectType
            } catch (error) {
                throw error // for now
            }
        }),
    getProjectsById: procedure
        .input(z.string().length(36).optional())
        .query(async ({ input }) => {
            return (await getExistingProjectsByUid(input)) as ProjectType[] // Database Abstraction
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
            const { cursor, query, lastQuery: lQuery } = input

            // Refactor Pagination Logic -> a better way?

            const [projects, lastQuery] = await getExistingProjectsByQuery(
                cursor,
                query,
                lQuery
            )
            return {
                data: projects,
                nextCursor: projects.length
                    ? projects[projects.length - 1].createdAt!.toISOString()
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
            return (await getExistingProjectById(input))[0] as
                | ProjectType
                | ProjectWithUser // Database Abstraction
        }),
    deleteProjectById: protectedProcedure
        .input(z.string().length(36))
        .mutation(async ({ input: pid }) => {
            return (await deleteExistingProjectById(pid))[0]
        }),
}
