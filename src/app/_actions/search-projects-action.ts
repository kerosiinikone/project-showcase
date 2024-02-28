'use server'

import { ProjectType, Stage } from '@/models/Project/types'
import { getProjects } from '@/services/trpc/server'

// Refactor

type SearchFnReturnType = {
    data: ProjectType[]
    nextCursor: string | null
    stage: Stage[]
    lastQuery: string | null
    error?: any // For now
}

const DEFAULT_RETURN = {
    data: [],
    nextCursor: null,
    stage: [],
    lastQuery: null,
}

const searchProjects = async (
    prevProjects: SearchFnReturnType,
    formData: FormData
) => {
    const cursor = formData.get('nextCursor') as string
    const stageFilter = formData.get('stageFilter') as string
    const query = formData.get('query') as string
    const lastQuery = formData.get('lastQuery') as string

    try {
        const stageComparison =
            prevProjects.stage == (JSON.parse(stageFilter) as Stage[])

        const data = await getProjects({
            stage: JSON.parse(stageFilter) as Stage[],
            query: query ? query : null,
            cursor: cursor && stageComparison ? cursor : undefined,
            lastQuery: lastQuery ? lastQuery : null,
        })

        data.lastQuery = data.lastQuery || ''
        prevProjects.nextCursor = data.nextCursor

        // New Search
        if (query != lastQuery || !stageComparison) {
            prevProjects.stage = data.stage
            return data as SearchFnReturnType
        }

        // Scroll down
        if (data.nextCursor) {
            prevProjects.data = [...prevProjects.data, ...data.data]
            prevProjects.stage = data.stage
            prevProjects.lastQuery = data.lastQuery!
        }
        return prevProjects
    } catch (error) {
        return {
            ...DEFAULT_RETURN,
            error,
        } // For now
    }
}

export default searchProjects
