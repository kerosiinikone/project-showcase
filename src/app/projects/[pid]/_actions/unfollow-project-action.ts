'use server'

import { unfollowProject } from '@/services/trpc/server'
import { TRPCError } from '@trpc/server'

export default async function unsupportProjectAction(
    pid: number,
    _: FormData
) {
    try {
        await unfollowProject(pid)
    } catch (error) {
        let err = error as any

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
            error: err,
        }
    }
}
