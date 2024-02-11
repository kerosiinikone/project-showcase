'use server'

import { Stage } from '@/models/Project/types'
import { editProject } from '@/services/trpc/server'

export interface EditProjectParams {
    name: string
    stage: Stage
    github_url: string | null
    description: string | null
    image: string | null
}

export default async function editProjectAction(formData: FormData) {
    const pid = formData.get('pid') as string
    const author_id = formData.get('author_id') as string

    const projectParams: EditProjectParams = {
        name: formData.get('name') as string,
        stage: formData.get('stage') as Stage,
        description: formData.get('description') as string,
        github_url: null, // For now
        image: null, // For now
    }
    try {
        await editProject({
            pid,
            author_id,
            data: projectParams,
        })
    } catch (error) {
        return { error } // For now
    }
}
