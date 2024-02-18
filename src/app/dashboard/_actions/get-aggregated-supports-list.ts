'use server'

import { ProjectTypeWithId } from '@/models/Project/types'
import { getAggregatedSupports } from '@/services/trpc/server'

// Refactor

type ASupportsReturnType = {
    data: {
        project: ProjectTypeWithId | null
        count: number
    }[]
    nextCursor?: number
    error?: unknown
}

const getAggreagtedSupportsList = async (
    prev: ASupportsReturnType,
    formData: FormData
) => {
    const cursor = formData.get('nextCursor') as string

    try {
        let parsedCursor = cursor ? parseInt(cursor) : 0

        const data = await getAggregatedSupports(parsedCursor)

        prev.nextCursor = data.nextCursor
            ? data.nextCursor
            : undefined

        if (data.nextCursor) {
            prev.data = [...prev.data, ...data.data]
        }

        return prev as ASupportsReturnType
    } catch (error) {
        return { data: [], error } // For now
    }
}

export default getAggreagtedSupportsList
