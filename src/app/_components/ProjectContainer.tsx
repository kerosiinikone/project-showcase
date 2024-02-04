'use client'

import { ProjectType } from '@/models/Project/types'
import SearchBarComponent from './SearchBar'
import { Suspense, useMemo, useRef } from 'react'
import ProjectGrid from '@/components/ProjectGrid'
import { usePagination } from '@/hooks/useSearchPagination'

interface ProjectContainerProps {
    initialProjects: ProjectType[]
    initialNextCursor: string | null
}

// Instead of making hidden inputs, it is also possible to
// keep the values in useState and append them to the FormData object

export default function ProjectContainer({
    initialProjects,
    initialNextCursor,
}: ProjectContainerProps) {
    const formRef = useRef<HTMLFormElement | null>(null)
    const { projectsRaw, dispatch, onBottom, search } = usePagination(
        initialProjects,
        initialNextCursor,
        formRef
    )
    const projectsMemo = useMemo(
        () => (!projectsRaw.error ? projectsRaw.data : []),
        [projectsRaw]
    )

    return (
        <>
            <div className="h-fit">
                <form
                    ref={formRef}
                    action={dispatch}
                    className="flex items-center"
                >
                    <SearchBarComponent handleSearch={search} />
                    <input
                        hidden
                        readOnly
                        name="nextCursor"
                        value={projectsRaw?.nextCursor ?? undefined}
                    />
                    <input
                        hidden
                        readOnly
                        name="lastQuery"
                        value={projectsRaw?.lastQuery ?? undefined}
                    />
                </form>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <ProjectGrid
                    onBottom={onBottom}
                    projects={projectsMemo}
                />
            </Suspense>
        </>
    )
}
