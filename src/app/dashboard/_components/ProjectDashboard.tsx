'use client'

import { ProjectType } from '@/models/Project/types'
import { UserRepo } from '@/services/octokit/types'
import RepoContainer from './RepositoryContainer'
import ProjectGrid from '@/components/ProjectGrid'
import { useMemo, useRef } from 'react'
import { Session } from 'next-auth/types'
import { useFormState } from 'react-dom'
import getProjectsById from '../_actions/get-projects-by-id-action'

interface ProjectDashboardProps {
    repos: UserRepo[]
    projects: ProjectType[]
    session: Session
}

// Instead of making hidden inputs, it is also possible to
// keep the values in úseState and append them to the FormData object

export default function ProjectDashboard({
    repos,
    projects,
    session,
}: ProjectDashboardProps) {
    const formRef = useRef<HTMLFormElement | null>(null)
    const initialNextCursor = projects.length
        ? projects[projects.length - 1].created_at!.toISOString()
        : null

    const [projectsRaw, dispatch] = useFormState(getProjectsById, {
        data: projects,
        nextCursor: initialNextCursor,
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
                        initialNextCursor ??
                        undefined
                    }
                />
                <input
                    hidden
                    id="uid"
                    readOnly
                    name="uid"
                    value={session.user?.id}
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
