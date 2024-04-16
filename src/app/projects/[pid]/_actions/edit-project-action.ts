'use server'

import { Stage } from '@/models/Project/types'
import { editProject } from '@/services/trpc/server'
import { TRPCError } from '@trpc/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const DEFAULT_DESCRIPTION = 'A Project'

export interface EditProjectParams {
    name: string
    stage: Stage
    github_url?: string
    description?: string
    tags: string[]
}

let success: boolean = false

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
        description: formData.get('description') as
            | string
            | undefined,
        github_url: formData.get('github_url') as string | undefined, // For now
    }

    try {
        const done = await editProject({
            pid: props.pid,
            author_id: props.author_id,
            data: {
                ...projectParams,
                github_url: !projectParams.github_url
                    ? null
                    : projectParams.github_url,
                description:
                    projectParams.description || DEFAULT_DESCRIPTION,
            },
        })
        success = true

        return {
            pid: props.pid,
            author_id: props.author_id,
            done: done,
        }
    } catch (error) {
        let err = error as any
        success = false

        // TODO: Make this error logic run globally on all requests

        if (err instanceof TRPCError) {
            if (Array.isArray(err)) {
                err = JSON.parse(err.message)[0].message
            } else {
                err = err.message
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
            redirect(`/projects/${props.pid}`)
        }
    }
}
