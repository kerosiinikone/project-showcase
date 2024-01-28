import { Stage } from '@/models/Project/types'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { api } from '../_util/trpc'

// Might not need

export interface ProjectParams {
    name: string
    stage: Stage
    github_url: string | null
    description: string | null
}

export default function useCreateProject(
    opts: any,
    router: AppRouterInstance,
    handleClose: () => void
) {
    //const utils = trpc.useUtils()
    const { data, mutate, isLoading, error } =
        api.project.createProject.useMutation({
            ...opts,
            onSuccess: async () => {
                handleClose()
                // revalidatePath('/')
                // revalidatePath('/dashboard')
                router.push('/')
            },
        })

    const createProject = (projectParams: ProjectParams) => {
        // Image "null" for now
        mutate({ ...projectParams, image: null })
    }

    return [createProject, { data, isLoading, error }] as const
}
