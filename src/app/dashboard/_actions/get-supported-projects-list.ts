'use server'

import { ProjectType } from '@/models/Project/types'
import { getSupportedProjects } from '@/services/trpc/server'

// Refactor

type UserSupportsReturnType = {
    data: ProjectType[] // Only fields that are required -> refactor
    nextCursor?: string
    error?: unknown
}

const getSupportedList = async (
    prev: UserSupportsReturnType,
    formData: FormData
) => {
    const cursor = formData.get('nextCursor') as string

    try {
        const data = await getSupportedProjects(cursor)

        prev.nextCursor = data.nextCursor
            ? data.nextCursor
            : undefined

        if (data.nextCursor) {
            prev.data = [...prev.data, ...data.data]
        }

        return prev as UserSupportsReturnType
    } catch (error) {
        return { data: [], error } // For now
    }
}

export default getSupportedList
