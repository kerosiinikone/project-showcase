'use server'

import { Stage } from '@/models/Project/types'
import { createProjectServer } from '@/services/trpc/server'
import { TRPCError } from '@trpc/server'
import { revalidatePath } from 'next/cache'

export interface ProjectParams {
    name: string
    stage: Stage
    github_url: string | null
    website?: string | null
    description: string | null
    tags: string
}

let success = false

export default async function createProjectAction(
    _: any,
    formData: FormData
) {
    const projectParams: ProjectParams = {
        name: formData.get('name') as string,
        stage: formData.get('stage') as Stage,
        website: formData.get('website')
            ? (formData.get('website') as string)
            : undefined,
        github_url: formData.get('github_url') as string,
        description: formData.get('description') as string,
        tags: formData.get('tags') as string,
    }

    try {
        await createProjectServer({
            ...projectParams,
            github_url: !projectParams.github_url
                ? null
                : projectParams.github_url,
            tags: JSON.parse(projectParams.tags) as string[],
        })
        success = true
    } catch (error) {
        let err = error as any
        success = false

        if (err instanceof TRPCError) {
            const msgs = JSON.parse(err.message)

            if (Array.isArray(msgs)) {
                err = msgs.map((e) => e.message).join(', ')
            } else {
                err = msgs
            }
        } else {
            err = JSON.stringify(err)
        }

        return { error: err, success }
    } finally {
        if (success) {
            revalidatePath('')
            return { success }
        }
    }
}
