import { useAsyncAuth } from '@/hooks/useAsyncAuth'
import { ProjectWithUser } from '@/models/Project/types'
import { getProjectServer, getUserById } from '@/services/trpc/server'
import ProjectWrapper from './_components/ProjectWrapper'
import { Session } from 'next-auth/types'

interface ProjectComponentProps {
    params: { pid: string }
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

const isFollowedInitial = async (
    pid: string,
    session: Session | null
) => {
    const user = await getUserById(session?.user.id!)
    if (
        !user ||
        !user.supported_projects.some(
            ({ project }) => project.id == pid
        )
    ) {
        return false
    }
    return true
}
