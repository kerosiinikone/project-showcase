'use server'

import { ProjectTypeWithId } from '@/models/Project/types'
import { getProjectsByIdServer } from '@/services/trpc/server'
import { TRPCError } from '@trpc/server'

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

        prevProjects.nextCursor = data.nextCursor ?? null

        if (data.nextCursor) {
            prevProjects.data = [...prevProjects.data, ...data.data]
        }

        return prevProjects as FetchFnReturnType
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
            nextCursor: null,
            error: err,
        }
    }
}

export default getProjectsById
