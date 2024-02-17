'use server'

import { followProject } from '@/services/trpc/server'

export default async function supportProjectAction(
    pid: number,
    _: FormData
) {
    try {
        await followProject(pid)
    } catch (error) {
        throw new Error("Can't support")
    }
}
