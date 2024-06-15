'use server'

import { followProject } from '@/services/trpc/server'
import { TRPCError } from '@trpc/server'

export default async function supportProjectAction(
    pid: number,
    _: FormData
) {
    try {
        await followProject(pid)
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
