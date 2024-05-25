'use client'

import ProjectGrid from '@/components/ProjectGrid'
import { ProjectTypeWithId } from '@/models/Project/types'
import { UserRepo } from '@/services/github'
import { Session } from 'next-auth'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'react-toastify'
import getProjectsById from '../_actions/get-projects-by-id-action'
import RepoContainer from './RepositoryContainer'

interface ProjectDashboardProps {
    repos: UserRepo[]
    projects: ProjectTypeWithId[]
    initialCursor: string | null
    session: Session
    initialError: boolean
}

export default function ProjectDashboard({
    repos,
    projects,
    initialError,
    initialCursor,
}: ProjectDashboardProps) {
    const formRef = useRef<HTMLFormElement | null>(null)
    const [pending, setPending] = useState<boolean>(false)
    const [projectsRaw, dispatch] = useFormState(getProjectsById, {
        data: projects,
        nextCursor: initialCursor,
    })

    const fetch = () => {
        if (formRef) {
            setPending(true)
            formRef.current?.requestSubmit()
        }
    }

    const onBottom = (e: any) => {
        if (
            e.target.scrollHeight - e.target.scrollTop ===
                e.target.clientHeight &&
            projectsRaw.nextCursor
        )
            fetch()
    }

    const projectsMemo = useMemo(
        () => (!projectsRaw.error ? projectsRaw.data : []),
        [projectsRaw]
    )

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
        <div
            id="projects-repos"
            className="flex flex-row h-3/4 w-full mt-5"
        >
            <form
                ref={formRef}
                action={dispatch}
                className="min-w-[300px]"
            >
                <div hidden>
                    <input
                        hidden
                        id="nextCursor"
                        readOnly
                        name="nextCursor"
                        value={
                            projectsRaw?.nextCursor ??
                            initialCursor ??
                            undefined
                        }
                    />
                </div>
                <div className="flex flex-col justify-center items-center rounded-lg h-full w-full font-medium bg-gray-100 mr-5">
                    {projectsMemo.length ? (
                        <ProjectGrid
                            pending={pending}
                            onBottom={onBottom}
                            projects={projectsMemo}
                            cols={2}
                        />
                    ) : (
                        <>
                            <h1>No Projects</h1>
                            <h2>Add a new project</h2>
                        </>
                    )}
                </div>
            </form>
            <div className="flex flex-col rounded-lg h-full w-3/4 font-medium ml-5 bg-white mr-5">
                {repos.length ? (
                    <RepoContainer repos={repos} />
                ) : (
                    <h1>No Github repos</h1>
                )}
            </div>
        </div>
    )
}
