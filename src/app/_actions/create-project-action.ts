'use server'

import { Stage } from '@/models/Project/types'
import { createProjectServer } from '@/services/trpc/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface ProjectParams {
    name: string
    stage: Stage
    github_url: string | null
    description: string | null
    tags: string
}

export default async function createProjectAction(
    _: any,
    formData: FormData
) {
    // Validation ??

    const projectParams: ProjectParams = {
        name: formData.get('name') as string,
        stage: formData.get('stage') as Stage,
        github_url: formData.get('github_url') as string,
        description: formData.get('description') as string,
        tags: formData.get('tags') as string,
    }
    try {
        await createProjectServer({
            ...projectParams,
            tags: JSON.parse(projectParams.tags) as string[],
            image: null, // For now
        })
    } catch (error) {
        return { error } // For now
    }

    // Find some way to revalidate and referesh the main page
    // revalidatePath('/')
    // redirect('/')
}
