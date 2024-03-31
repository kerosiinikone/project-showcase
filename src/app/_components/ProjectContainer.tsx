'use client'

import {
    ProjectType,
    ProjectTypeWithId,
} from '@/models/Project/types'
import SearchBarComponent from './SearchBar'
import { Suspense, useMemo, useRef, useState } from 'react'
import ProjectGrid from '@/components/ProjectGrid'
import { usePagination } from '@/hooks/useSearchPagination'
import Filters from './Filters'
import TagLabel from '@/components/TagItem'

interface ProjectContainerProps {
    initialProjects: ProjectTypeWithId[]
    tagsFromParam: string[] | null
    initialNextCursor: string | null
}

export default function ProjectContainer({
    initialProjects,
    initialNextCursor,
    tagsFromParam,
}: ProjectContainerProps) {
    const formRef = useRef<HTMLFormElement | null>(null)
    const [tags, setTags] = useState<string[]>(tagsFromParam || [])
    const { projectsRaw, dispatch, onBottom, search } = usePagination(
        initialProjects,
        initialNextCursor,
        formRef
    )

    const addTag = (tag: string) => {
        setTags((state) => {
            if (tags.indexOf(tag) === -1) {
                return [...state, tag]
            }
            return state
        })
    }

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
                    <input
                        hidden
                        readOnly
                        value={`[${tags.map((t) => {
                            return `"${t}"`
                        })}]`}
                        name="tags"
                    />
                    <div className="flex w-full flex-row items-center">
                        <SearchBarComponent
                            addTag={addTag}
                            handleSearch={search}
                        />
                    </div>
                    <div className="flex w-full flex-row justify-start items-center">
                        {tags.map((t) => {
                            return (
                                <div className="mt-2">
                                    <TagLabel
                                        name={t}
                                        remove={() => {
                                            setTags((state) => {
                                                return state.filter(
                                                    (tag) => tag !== t
                                                )
                                            })
                                            setTimeout(() => {
                                                search()
                                            }, 100)
                                        }}
                                    />
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex w-full flex-row justify-start items-center">
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
