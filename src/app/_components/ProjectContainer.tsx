'use client'

import { ProjectType } from '@/models/Project/types'
import { useFormState } from 'react-dom'
import SearchBarComponent from './SearchBar'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { useIntersection } from '@mantine/hooks'
import ProjectGrid from '@/components/ProjectGrid'
import searchProjects from '../_actions/searchProjects'

// Refactor -> better loading

interface ProjectContainerProps {
    initialProjects: ProjectType[]
    initialNextCursor: string | null
}

export default function ProjectContainer({
    initialProjects,
    initialNextCursor,
}: ProjectContainerProps) {
    const [projectsRaw, dispatch] = useFormState(searchProjects, {
        data: initialProjects,
        lastQuery: null,
        nextCursor: initialNextCursor,
    })
    const formRef = useRef<HTMLFormElement | null>(null)

    const search = () => {
        formRef.current?.requestSubmit()
    }

    // const viewportRef = useRef<HTMLDivElement>(null)
    // const { entry, ref: scrollRef } = useIntersection({
    //     // Forward ref to ProjectGrid <div>
    //     root: viewportRef.current,
    //     threshold: 1,
    // })

    // useEffect(() => {
    //     if (
    //         entry?.isIntersecting &&
    //         projectsRaw?.data.length &&
    //         projectsRaw.nextCursor
    //     )
    //         console.log('Visible')
    // }, [entry])

    // Memoize the new posts and append to a "page" -> necessary?
    const projectsMemo = useMemo(() => projectsRaw.data, [projectsRaw])

    return (
        <>
            <div className="h-fit">
                <form
                    ref={formRef}
                    action={dispatch}
                    className="flex items-center"
                >
                    <SearchBarComponent
                        handleSearch={search}
                        nextCursor={
                            projectsRaw?.nextCursor ??
                            initialNextCursor ??
                            undefined
                        }
                        lastQuery={projectsRaw?.lastQuery ?? undefined}
                    />
                </form>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <ProjectGrid projects={projectsMemo} />
            </Suspense>
        </>
    )
}
