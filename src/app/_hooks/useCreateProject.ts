import { Stage } from '@/models/Project/types'
import { trpc } from '../_util/trpc'

export interface ProjectParams {
    name: string
    stage: Stage
    github_url?: string
    description?: string
}

export default function useCreateProject(opts: any) {
    const { data, mutate, isLoading, error } =
        trpc.projectActionsRouter.createProjectAction.useMutation(opts)

    const createProject = (projectOptions: ProjectParams) => {
        mutate(projectOptions)
    }

    return [createProject, { data, isLoading, error }] as const
}
