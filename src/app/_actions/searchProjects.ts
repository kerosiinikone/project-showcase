'use server'

import { ProjectType } from '@/models/Project/types'
import { getProjects } from '@/services/trpc/server'

// Refactor

type SearchFnReturnType = {
    data: ProjectType[]
    nextCursor: string | null
    lastQuery: string | null
}

const searchProjects = async (
    prevProjects: SearchFnReturnType,
    formData: FormData
) => {
    const query = formData.get('query') as string
    const lastQuery = formData.get('lastQuery') as string
    const cursor = formData.get('nextCursor') as string

    // Make simpler if possible
    const data = await getProjects({
        query: query != '' ? query : null,
        cursor: cursor != '' ? cursor : undefined,
        lastQuery: lastQuery != '' ? lastQuery : null,
    })

    if (data.nextCursor) {
        prevProjects.data = [...prevProjects.data, ...data.data]
        prevProjects.lastQuery = data.lastQuery!
        prevProjects.nextCursor = data.nextCursor
    }
    // Not a good approach -> a lot of overhead
    return prevProjects as SearchFnReturnType
}

export default searchProjects
