'use server'

import { followProject } from '@/services/trpc/server'

export default async function supportProject(
    _: any,
    formData: FormData
) {
    try {
        return await followProject({
            pid: formData.get('pid') as string,
            uid: formData.get('uid') as string,
        })
    } catch (error) {
        return false // For now
    }
}
