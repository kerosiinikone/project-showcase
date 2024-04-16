'use server'

import { deleteProjectServer } from '@/services/trpc/server'
import { TRPCError } from '@trpc/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export default async function deleteProjectAction(
    props: {
        pid: number
        author_id: string
        error?: any
        done?: boolean
    },
    _: FormData
) {
    try {
        const success = await deleteProjectServer({
            pid: props.pid,
            author_id: props.author_id,
        })

        return {
            pid: props.pid,
            author_id: props.author_id,
            done: success,
        }
    } catch (error) {
        let err = error as any

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
        revalidatePath('/dashboard')
        redirect('/dashboard')
    }
}
