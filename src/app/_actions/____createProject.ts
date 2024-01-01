'use server'

import { Stage } from '@/models/Project/types'
import { createProjectServer } from '@/services/trpc/server'
import { revalidatePath } from 'next/cache'

export interface ProjectParams {
    name: string
    stage: Stage
    github_url: string | null
    description: string | null
}

export default async function createProjectAction(formData: FormData) {
    const projectParams: ProjectParams = {
        name: formData.get('name') as string,
        stage: formData.get('stage') as Stage,
        github_url: formData.get('githb_url') as string,
        description: formData.get('description') as string,
    }

    try {
        await createProjectServer({
            ...projectParams,
            image: null,
        })
        revalidatePath('/')
    } catch (error) {}
}