'use server'

import { ProjectType } from '@/models/Project/types'
import {
    getProjects,
    getProjectsByIdServer,
} from '@/services/trpc/server'

// Refactor

type FetchFnReturnType = {
    data: ProjectType[]
    nextCursor: string | null
}

const getProjectsById = async (
    prevProjects: FetchFnReturnType,
    formData: FormData
) => {
    const cursor = formData.get('nextCursor') as string
    const id = formData.get('uid') as string

    const data = await getProjectsByIdServer({
        id,
        cursor: cursor ? cursor : undefined,
    })

    prevProjects.nextCursor = data.nextCursor

    if (data.nextCursor) {
        prevProjects.data = [...prevProjects.data, ...data.data]
    }

    return prevProjects as FetchFnReturnType
}

export default getProjectsById
