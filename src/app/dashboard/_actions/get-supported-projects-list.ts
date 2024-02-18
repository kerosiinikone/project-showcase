'use server'

import { ProjectTypeWithId } from '@/models/Project/types'
import { getSupportedProjects } from '@/services/trpc/server'

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
        return { data: [], error } // For now
    }
}

export default getSupportedList
