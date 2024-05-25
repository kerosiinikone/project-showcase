'use server'

import { ProjectTypeWithId } from '@/models/Project/types'
import { getSupportedProjects } from '@/services/trpc/server'
import { TRPCError } from '@trpc/server'

// Refactor

type UserSupportsReturnType = {
    data: ProjectTypeWithId[] // Only fields that are required -> refactor
    nextCursor?: number
    error?: unknown
}

const getSupportedList = async (
    prev: UserSupportsReturnType,
    formData: FormData
) => {
    const cursor = formData.get('nextCursor') as string

    try {
        let parsedCursor = cursor ? parseInt(cursor) : 0

        const data = await getSupportedProjects(parsedCursor)

        prev.nextCursor = data.nextCursor
            ? data.nextCursor
            : undefined

        if (data.nextCursor) {
            prev.data = [
                ...prev.data,
                ...(data.data as ProjectTypeWithId[]),
            ]
        }

        return prev as UserSupportsReturnType
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

export default getSupportedList
