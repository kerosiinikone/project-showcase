'use server'

import { deleteProjectServer } from '@/services/trpc/server'

export default async function deleteProjectAction(
    props: {
        pid: number
        author_id: string
        error?: string
        done?: boolean
    },
    _: FormData
) {
    try {
        const done = await deleteProjectServer({
            pid: props.pid,
            author_id: props.author_id,
        })

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
