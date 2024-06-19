'use client'

import searchProjects from '@/app/_actions/search-projects-action'
import { ProjectTypeWithId } from '@/models/Project/types'
import { MutableRefObject, useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'react-toastify'

export const usePagination = (
    initialProjects: ProjectTypeWithId[],
    initialNextCursor: string | null,
    formRef: MutableRefObject<HTMLFormElement | null>
) => {
    const [pending, setPending] = useState<boolean>(false)
    const [projectsRaw, dispatch] = useFormState(searchProjects, {
        data: initialProjects,
        stage: [],
        lastQuery: null,
        hasGithub: null,
        nextCursor: initialNextCursor,
        tags: [],
    })

    const search = () => {
        if (formRef) {
            setPending(true)
            formRef.current?.requestSubmit()
        }
    }

    const onBottom = (e: any) => {
        if (
            e.target.scrollHeight - e.target.scrollTop ===
                e.target.clientHeight &&
            projectsRaw?.nextCursor
        ) {
            search()
        }
    }

    useEffect(() => {
        setPending(false)
        if (projectsRaw && projectsRaw.error) {
            toast('Error: ' + projectsRaw.error, {
                position: 'bottom-center',
                autoClose: 5000,
                type: 'error',
                hideProgressBar: true,
                closeOnClick: true,
                progress: undefined,
                theme: 'colored',
            })
        }
    }, [projectsRaw])

    return { projectsRaw, dispatch, onBottom, search, pending }
}
