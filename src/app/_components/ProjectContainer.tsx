'use client'

import { ProjectType } from '@/models/Project/types'
import SearchBarComponent from './SearchBar'
import { Suspense, useMemo, useRef } from 'react'
import ProjectGrid from '@/components/ProjectGrid'
import { usePagination } from '@/hooks/useSearchPagination'
import Filters from './Filters'

interface ProjectContainerProps {
    initialProjects: ProjectType[]
    initialNextCursor: string | null
}

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
                    className="flex flex-col items-center"
                >
                    <div className="flex w-full flex-row items-center">
                        <SearchBarComponent handleSearch={search} />
                    </div>
                    <div className="flex w-full flex-row items-center">
                        <Filters
                            initSearch={search}
                            stage={projectsRaw.stage}
                        />
                    </div>

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
