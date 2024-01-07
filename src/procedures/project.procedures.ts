import { Project, ProjectSchema } from '@/models/Project/model'
import { ProjectType, ProjectWithUser } from '@/models/Project/types'
import {
    createNewProject,
    deleteExistingProjectById,
    getExistingProjectById,
    getExistingProjects,
} from '@/operations/project.operations'
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
                return (await createNewProject(project))[0] as ProjectType
            } catch (error) {
                throw error // for now
            }
        }),
    getProjects: procedure
        .input(z.string().length(36).optional())
        .query(async ({ input }) => {
            return (await getExistingProjects(input)) as ProjectType[] // Database Abstraction
        }),
    getProjectById: procedure
        .input(
            z.object({
                id: z.string().length(36),
                joinUsers: z.boolean(),
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
