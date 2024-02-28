'use client'

import searchProjects from '@/app/_actions/search-projects-action'
import { ProjectType } from '@/models/Project/types'
import { MutableRefObject } from 'react'
import { useFormState } from 'react-dom'

export const usePagination = (
    initialProjects: ProjectType[],
    initialNextCursor: string | null,
    formRef: MutableRefObject<HTMLFormElement | null>
) => {
    const [projectsRaw, dispatch] = useFormState(searchProjects, {
        data: initialProjects,
        stage: [],
        lastQuery: null,
        nextCursor: initialNextCursor,
    })

    const search = () => {
        formRef.current?.requestSubmit()
    }

    const onBottom = (e: any) => {
        if (
            e.target.scrollHeight - e.target.scrollTop ===
                e.target.clientHeight &&
            projectsRaw.nextCursor
        )
            search()
    }

    return { projectsRaw, dispatch, onBottom, search }
}
