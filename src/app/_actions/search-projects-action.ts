'use server'

import { ProjectTypeWithId, Stage } from '@/models/Project/types'
import { getProjects } from '@/services/trpc/server'
import { TRPCError } from '@trpc/server'

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

    const parsedStage = JSON.parse(stageFilter) as Stage[]
    const parsedTags = JSON.parse(tags) as string[]

    // Just removed a filter or changed something in the query
    const isNewQuery =
        query != lastQuery ||
        !(JSON.stringify(prevProjects.stage) == stageFilter) ||
        !(JSON.stringify(prevProjects.tags) == tags) ||
        !(
            (hasGithub == '' ? 'null' : hasGithub) ==
            JSON.stringify(prevProjects.hasGithub)
        )

    const cursorToUse = isNewQuery ? undefined : cursor

    try {
        const data = await getProjects({
            stage: parsedStage,
            query: query ? query : null,
            cursor: cursorToUse,
            lastQuery: lastQuery ? lastQuery : null,
            tags: parsedTags,
            hasGithub: hasGithub === '' ? null : hasGithub === 'true',
        })

        if (isNewQuery) {
            prevProjects.data = data.data
        }

        if (cursorToUse) {
            prevProjects.data.push(...data.data)
        }

        prevProjects.nextCursor = data.nextCursor ?? null
        prevProjects.stage = parsedStage
        prevProjects.tags = parsedTags
        prevProjects.hasGithub =
            hasGithub === '' ? null : hasGithub === 'true'
        prevProjects.lastQuery = query

        return prevProjects
    } catch (error) {
        let err = error as any

        // TODO: Make this error logic run globally on all requests

        if (err instanceof TRPCError) {
            const msgs = JSON.parse(err.message)

            if (Array.isArray(msgs)) {
                err = msgs.map((e) => e.message).join(', ')
            } else {
                err = msgs
            }
        } else {
            err = JSON.stringify(err)
        }

        return {
            ...DEFAULT_RETURN,
            error: err,
        }
    }
}

export default searchProjects
