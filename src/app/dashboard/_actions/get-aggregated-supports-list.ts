'use server'

import { ProjectTypeWithId } from '@/models/Project/types'
import { getAggregatedSupports } from '@/services/trpc/server'
import { TRPCError } from '@trpc/server'

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
            data: [],
            nextCursor: 0,
            error: err,
        }
    }
}

export default getAggreagtedSupportsList
