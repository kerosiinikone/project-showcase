'use server'

import { getRepos } from '@/services/trpc/server'

const fetchUserRepos = async (_: any, __: FormData) => await getRepos()

export default fetchUserRepos
