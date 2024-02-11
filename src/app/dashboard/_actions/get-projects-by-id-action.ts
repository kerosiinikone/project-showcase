'use server'

import { ProjectType } from '@/models/Project/types'
import { getProjectsByIdServer } from '@/services/trpc/server'

// Refactor

type FetchFnReturnType = {
    data: ProjectType[]
    nextCursor: string | null
    error?: unknown
}

const getProjectsById = async (
    prevProjects: FetchFnReturnType,
    formData: FormData
) => {
    const cursor = formData.get('nextCursor') as string

    try {
        const data = await getProjectsByIdServer({
            cursor: cursor ? cursor : undefined,
        })

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
