'use server'

import { getRepos } from '@/services/trpc/server'

const fetchUserRepos = async (_: any, __: FormData) => {
    try {
        const repos = await getRepos()
        return repos
    } catch (error) {
        return null // For now
    }
}

export default fetchUserRepos
