'use server'

import {
    ProjectType,
    ProjectTypeWithId,
    Stage,
} from '@/models/Project/types'
import { getProjects } from '@/services/trpc/server'

// TODO: Refactor the logic

type SearchFnReturnType = {
    data: ProjectTypeWithId[]
    nextCursor: string | null
    stage: Stage[]
    lastQuery: string | null
    hasGithub: boolean | null
    tags: string[]
    error?: any // For now
}

const DEFAULT_RETURN = {
    data: [],
    nextCursor: null,
    stage: [],
    hasGithub: null,
    tags: [],
    lastQuery: null,
}

const searchProjects = async (
    prevProjects: SearchFnReturnType,
    formData: FormData
) => {
    const cursor = formData.get('nextCursor') as string
    const stageFilter = formData.get('stageFilter') as string
    const query = formData.get('query') as string
    const hasGithub = formData.get('hasGithub') as string
    const lastQuery = formData.get('lastQuery') as string
    const tags = formData.get('tags') as string

    try {
        const stageComparison =
            JSON.stringify(prevProjects.stage) == stageFilter
        const tagsComparison =
            JSON.stringify(prevProjects.tags) == tags
        const hasGithubComparison =
            (hasGithub == '' ? 'null' : hasGithub) ==
            JSON.stringify(prevProjects.hasGithub)

        const data = await getProjects({
            stage: JSON.parse(stageFilter) as Stage[],
            query: query ? query : null,
            cursor:
                cursor &&
                stageComparison &&
                tagsComparison &&
                hasGithubComparison
                    ? cursor
                    : undefined,
            lastQuery: lastQuery ? lastQuery : null,
            tags: JSON.parse(tags) as string[],
            hasGithub: hasGithub === '' ? null : hasGithub === 'true',
        })

        data.lastQuery = data.lastQuery || ''
        prevProjects.nextCursor = data.nextCursor

        // New Search
        if (
            query != lastQuery ||
            !stageComparison ||
            !tagsComparison ||
            !hasGithubComparison
        ) {
            return data as SearchFnReturnType
        }

        // Scroll down
        if (data.nextCursor) {
            prevProjects.data = [...prevProjects.data, ...data.data]
            prevProjects.stage = data.stage
            prevProjects.tags = data.tags!
            prevProjects.hasGithub = data.hasGithub!
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
