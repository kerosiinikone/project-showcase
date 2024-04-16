'use server'

import { getRepos } from '@/services/trpc/server'
import { TRPCError } from '@trpc/server'

const fetchUserRepos = async (_: any, __: FormData) => {
    try {
        const repos = await getRepos()
        return { data: repos, message: '' }
    } catch (error) {
        let err = error as any

        if (err instanceof TRPCError) {
            err = JSON.parse(err.message)[0].message
        } else {
            err = JSON.stringify(err)
        }
        // Format first -> Next Error, tRPC Error, Zod Error ...

        return { data: [], message: err as string } // Global Format
    }
}

export default fetchUserRepos
