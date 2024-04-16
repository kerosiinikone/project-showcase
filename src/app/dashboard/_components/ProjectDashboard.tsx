'use client'

import { ProjectTypeWithId } from '@/models/Project/types'
import { UserRepo } from '@/services/github'
import RepoContainer from './RepositoryContainer'
import ProjectGrid from '@/components/ProjectGrid'
import { useEffect, useMemo, useRef } from 'react'
import { useFormState } from 'react-dom'
import getProjectsById from '../_actions/get-projects-by-id-action'
import { Session } from 'next-auth'
import { toast } from 'react-toastify'

interface ProjectDashboardProps {
    repos: UserRepo[]
    projects: ProjectTypeWithId[]
    initialCursor: string | null
    session: Session
}

// Instead of making hidden inputs, it is also possible to
// keep the values in úseState and append them to the FormData object

export default function ProjectDashboard({
    repos,
    projects,
    initialCursor,
}: ProjectDashboardProps) {
    const formRef = useRef<HTMLFormElement | null>(null)

    const [projectsRaw, dispatch] = useFormState(getProjectsById, {
        data: projects,
        nextCursor: initialCursor,
    })

    const fetch = () => {
        formRef.current?.requestSubmit()
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

    return (
        <div
            id="projects-repos"
            className="flex flex-row h-3/4 w-full mt-5"
        >
            <form ref={formRef} action={dispatch} hidden>
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
            </form>
            <div className="flex flex-col justify-center items-center rounded-lg h-full w-full font-medium bg-gray-100 mr-5">
                {projectsMemo.length ? (
                    <ProjectGrid
                        onBottom={onBottom}
                        projects={projectsMemo}
                    />
                ) : (
                    <h1>No Projects yet!</h1>
                )}
            </div>
            <div className="flex flex-col justify-center items-center rounded-lg h-full w-full font-medium ml-5 bg-gray-100 mr-5">
                {repos.length ? (
                    <RepoContainer repos={repos} />
                ) : (
                    <h1>No Github repos!</h1>
                )}
            </div>
        </div>
    )
}
