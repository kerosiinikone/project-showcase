import { ProjectSchema } from '@/models/Project/model'
import { ProjectType } from '@/models/Project/types'
import { createNewProject } from '@/operations/project.operations'
import { protectedProcedure } from '@/services/trpc'

export default {
    createProjectAction: protectedProcedure
        .input(ProjectSchema)
        .mutation(async ({ input, ctx: { session } }) => {
            // Can be typecasted as "ProjectType" since "ProjectParams" works here
            return await createNewProject({
                ...(input as ProjectType),
                author_id: session?.user?.id!,
            })
        }),
}
