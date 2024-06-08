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
    const [cursor, setCursor] = useState<string | null>(
        initialNextCursor
    )
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

    useEffect(() => {
        setCursor(projectsRaw.nextCursor)
    }, [projectsRaw.nextCursor])

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
                                            // Reset cursor
                                            setCursor(null)
                                            setTags((state) => {
                                                return state.filter(
                                                    (tag) => tag !== t
                                                )
                                            })
                                        }}
                                    />
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex w-full flex-row justify-start items-center">
                        <Filters
                            resetCursor={() => {
                                setCursor(null)
                            }}
                            initSearch={search}
                            stage={projectsRaw.stage}
                        />
                    </div>
                    <input
                        hidden
                        readOnly
                        name="nextCursor"
                        value={cursor ?? undefined}
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
