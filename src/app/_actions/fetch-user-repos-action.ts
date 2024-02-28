'use server'

import { getRepos } from '@/services/trpc/server'

const fetchUserRepos = async (_: any, __: FormData) => {
    try {
        return await getRepos()
    } catch (error) {
        return null // For now
    }
}

export default fetchUserRepos
