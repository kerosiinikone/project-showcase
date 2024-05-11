'use client'

import ProjectGrid from '@/components/ProjectGrid'
import TagLabel from '@/components/TagItem'
import { usePagination } from '@/hooks/useSearchPagination'
import { ProjectTypeWithId } from '@/models/Project/types'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import Filters from './Filters'
import SearchBarComponent from './SearchBar'

interface ProjectContainerProps {
    initialProjects: ProjectTypeWithId[]
    tagsFromParam: string[] | null
    initialNextCursor: string | null
    initialError: boolean
}

export default function ProjectContainer({
    initialProjects,
    initialNextCursor,
    tagsFromParam,
    initialError,
}: ProjectContainerProps) {
    const formRef = useRef<HTMLFormElement | null>(null)
    const [tags, setTags] = useState<string[]>(tagsFromParam || [])
    const { projectsRaw, dispatch, onBottom, search, pending } =
        usePagination(initialProjects, initialNextCursor, formRef)

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

    // Initial Error Message

    useEffect(() => {
        if (initialError) {
            toast('Error', {
                position: 'bottom-center',
                autoClose: 5000,
                type: 'error',
                hideProgressBar: true,
                closeOnClick: true,
                progress: undefined,
                theme: 'colored',
            })
        }
    }, [initialError])

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
            <ProjectGrid
                pending={pending}
                cols={4}
                onBottom={onBottom}
                projects={projectsMemo}
            />
        </>
    )
}
