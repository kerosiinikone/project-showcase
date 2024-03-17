'use server'

import { ProjectTypeWithId } from '@/models/Project/types'
import { getProjectsByIdServer } from '@/services/trpc/server'

// Refactor

// Maybe change to serial cursor based pagination later

type FetchFnReturnType = {
    data: ProjectTypeWithId[]
    nextCursor: string | null
    error?: unknown
}

const getProjectsById = async (
    prevProjects: FetchFnReturnType,
    formData: FormData
) => {
    const cursor = formData.get('nextCursor') as string

    try {
        const data = await getProjectsByIdServer(
            cursor ? cursor : undefined
        )

        prevProjects.nextCursor = data.nextCursor

        if (data.nextCursor) {
            prevProjects.data = [...prevProjects.data, ...data.data]
        }

        return prevProjects as FetchFnReturnType
    } catch (error) {
        return { data: [], nextCursor: null, error } // For now
    }
}

export default getProjectsById
