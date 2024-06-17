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
        <div className="md:container w-full h-3/4">
            <div className="h-full flex flex-col items-center">
                <div className="flex flex-col rounded-lg font-medium bg-white p-5 mt-5 shadow-lg xl:w-full w-3/4 border-2">
                    <div className="flex flex-col justify-center items-start w-full mb-5">
                        <h1 className="ml-5 text-xl">
                            My Github Repos
                        </h1>
                    </div>
                    {repos.length ? (
                        <RepoContainer repos={repos} />
                    ) : (
                        <h1>No Github repos</h1>
                    )}
                </div>
                <div className="h-[400px] xl:w-full w-3/4 mb-10">
                    <form
                        ref={formRef}
                        action={dispatch}
                        className="h-[400px] max-h-[400px]"
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
                        <div className="flex flex-col flex-grow overflow-y-auto justify-center items-center rounded-lg w-full h-full font-medium bg-white p-5 mt-8 shadow-lg border-2">
                            <div className="flex flex-col justify-center items-start w-full mb-5">
                                <h1 className="ml-5 text-xl">
                                    Own Projects
                                </h1>
                            </div>
                            {projectsMemo.length ? (
                                <ProjectGrid
                                    pending={pending}
                                    onBottom={onBottom}
                                    projects={projectsMemo}
                                />
                            ) : (
                                <div>
                                    <h1>No Projects</h1>
                                    <h2>Add a new project</h2>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
