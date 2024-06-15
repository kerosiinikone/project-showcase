'use server'

import { ProjectTypeWithId } from '@/models/Project/types'
import { getSupportedProjects } from '@/services/trpc/server'
import { TRPCError } from '@trpc/server'

// Refactor

type UserSupportsReturnType = {
    data: ProjectTypeWithId[] // Only fields that are required -> refactor
    nextCursor?: string | null
    error?: unknown
}

const getSupportedList = async (
    prev: UserSupportsReturnType,
    formData: FormData
) => {
    const cursor = formData.get('nextCursor') as string

    try {
        const data = await getSupportedProjects(
            cursor ? cursor : undefined
        )

        prev.nextCursor = data.nextCursor ?? null

        if (data.nextCursor) {
            prev.data = [
                ...prev.data,
                ...(data.data as ProjectTypeWithId[]),
            ]
        }

        return prev as UserSupportsReturnType
    } catch (error) {
        let err = error as any

        if (err instanceof TRPCError) {
            const msg = err.message

            if (Array.isArray(msg)) {
                err = msg.map((e) => e.message).join(', ')
            } else {
                err = msg
            }
        } else {
            err = JSON.stringify(err)
        }

        return {
            data: [],
            nextCursor: null,
            error: err,
        }
    }
}

export default getSupportedList
