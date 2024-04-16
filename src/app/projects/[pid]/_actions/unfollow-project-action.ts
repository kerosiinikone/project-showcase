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
            error: err,
        }
    }
}
