'use server'

import { DEFAULT_DESCRIPTION } from '@/models/Project/model'
import { Stage } from '@/models/Project/types'
import { editProject } from '@/services/trpc/server'

export interface EditProjectParams {
    name: string
    stage: Stage
    github_url: string | null
    description: string | null
    tags: string[]
}

export default async function editProjectAction(
    props: {
        pid: number
        author_id: string
        error?: string
        done?: boolean
    },
    formData: FormData
) {
    const tags = formData.get('tags') as string
    const projectParams: EditProjectParams = {
        name: formData.get('name') as string,
        stage: formData.get('stage') as Stage,
        tags: JSON.parse(tags) as string[],
        description: formData.get('description') as string,
        github_url: formData.get('github_url') as string, // For now
    }

    try {
        const done = !!(await editProject({
            pid: props.pid,
            author_id: props.author_id,
            data: {
                ...projectParams,
                github_url:
                    projectParams.github_url === ''
                        ? null
                        : projectParams.github_url,
                description:
                    projectParams.description || DEFAULT_DESCRIPTION,
            },
        }))

        return {
            pid: props.pid,
            author_id: props.author_id,
            done,
        }
    } catch (error) {
        return {
            pid: props.pid,
            author_id: props.author_id,
            done: true,
            error: 'Something went wrong!',
        } // For now
    }
}
