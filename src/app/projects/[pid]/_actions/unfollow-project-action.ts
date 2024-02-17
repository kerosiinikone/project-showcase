'use server'

import { unfollowProject } from '@/services/trpc/server'

export default async function unsupportProjectAction(
    pid: number,
    _: FormData
) {
    try {
        await unfollowProject(pid)
    } catch (error) {
        throw new Error("Can't unsupport")
    }
}
