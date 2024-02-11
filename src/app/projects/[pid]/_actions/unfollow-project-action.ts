'use server'

import { unfollowProject } from '@/services/trpc/server'

export default async function unsupportProjectAction(
    _: any,
    formData: FormData
) {
    try {
        return await unfollowProject({
            pid: formData.get('pid') as string,
            uid: formData.get('uid') as string,
        })
    } catch (error) {
        return false // For now
    }
}
