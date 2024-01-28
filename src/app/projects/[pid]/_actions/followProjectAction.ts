'use server'

import { followProject } from '@/services/trpc/server'

export default async function supportProject(
    _: boolean,
    formData: FormData
) {
    const pid = formData.get('pid') as string
    const uid = formData.get('uid') as string

    return await followProject({ pid, uid })
}
