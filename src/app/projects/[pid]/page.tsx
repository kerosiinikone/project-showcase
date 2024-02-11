import { useAsyncAuth } from '@/services/auth/util/useAsyncAuth'
import { ProjectWithUser } from '@/models/Project/types'
import {
    getProjectServer,
    isFollowProject,
} from '@/services/trpc/server'
import ProjectWrapper from './_components/ProjectWrapper'
import { Session } from 'next-auth/types'

interface ProjectComponentProps {
    params: { pid: string }
}

const isFollowedInitial = async (
    pid: string,
    session: Session | null
) => {
    if (!session || !session.user) return false
    return await isFollowProject({ pid, uid: session.user.id })
}

// Abstract into Components

export default async function ProjectPage({
    params,
}: ProjectComponentProps) {
    const project = (await getProjectServer({
        id: params.pid,
        joinUser: true,
    })) as ProjectWithUser

    if (!project.id) {
        return <div>Not found</div>
    }

    const session = await useAsyncAuth()
    const isFollowed = await isFollowedInitial(project.id, session)

    return (
        <div className="container h-full w-full flex justify-center items-center p-10">
            <ProjectWrapper
                session={session}
                project={project}
                isFollowed={isFollowed}
            />
        </div>
    )
}
