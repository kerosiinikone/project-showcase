'use server'

import { ProjectType } from '@/models/Project/types'
import { getProjects } from '@/services/trpc/server'

// Refactor

type SearchFnReturnType = {
    data: ProjectType[]
    nextCursor: string | null
    lastQuery: string | null
    error?: unknown // For now
}

const searchProjects = async (
    prevProjects: SearchFnReturnType,
    formData: FormData
) => {
    const cursor = formData.get('nextCursor') as string
    const query = formData.get('query') as string
    const lastQuery = formData.get('lastQuery') as string

    try {
        const data = await getProjects({
            query: query ? query : null,
            cursor: cursor ? cursor : undefined,
            lastQuery: lastQuery ? lastQuery : null,
        })

        data.lastQuery = data.lastQuery ? data.lastQuery : ''
        prevProjects.nextCursor = data.nextCursor

        // New Search
        if (query != lastQuery) {
            return data as SearchFnReturnType
        }

        // Scroll down
        if (data.nextCursor && data.lastQuery == query) {
            prevProjects.data = [...prevProjects.data, ...data.data]
            prevProjects.lastQuery = data.lastQuery!
        }
        return prevProjects as SearchFnReturnType
    } catch (error) {
        return {
            data: [],
            nextCursor: null,
            lastQuery: null,
            error,
        } // For now
    }
}

export default searchProjects
