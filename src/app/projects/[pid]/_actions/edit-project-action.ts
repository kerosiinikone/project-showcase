'use server'

import { Stage } from '@/models/Project/types'
import { editProject } from '@/services/trpc/server'
import { TRPCError } from '@trpc/server'
import { revalidatePath } from 'next/cache'

export interface EditProjectParams {
    name?: string
    stage?: Stage
    github_url?: string
    description?: string
    tags?: string[]
    website?: string
}

let success = false

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
        name: (formData.get('name') as string) || undefined,
        stage: (formData.get('stage') as Stage) || undefined,
        tags: (JSON.parse(tags) as string[]) || undefined,
        website: (formData.get('website') as string) || undefined,
        description:
            (formData.get('description') as string) || undefined,
        github_url:
            (formData.get('github_url') as string) || undefined,
    }

    try {
        const done = await editProject({
            pid: props.pid,
            author_id: props.author_id,
            data: projectParams,
        })
        success = true

        return {
            pid: props.pid,
            author_id: props.author_id,
            done: !!done,
        }
    } catch (error) {
        let err = error as any
        success = false

        if (err instanceof TRPCError) {
            const msg = err.message

            if (Array.isArray(msg)) {
                err = msg.map((e) => e.message).join(', ')
            } else {
                err = msg
            }
        } else {
            err = JSON.stringify(err)
        }

        return {
            pid: props.pid,
            author_id: props.author_id,
            done: false,
            error: err,
        }
    } finally {
        if (success) {
            revalidatePath('/projects/[pid]', 'page')
        }
    }
}
