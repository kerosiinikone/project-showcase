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

        // TODO: Make this error logic run globally on all requests

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

        return {
            error: err,
        }
    }
}
