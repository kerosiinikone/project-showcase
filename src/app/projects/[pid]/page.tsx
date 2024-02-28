import { useAsyncAuth } from '@/services/auth/util/useAsyncAuth'
import { ProjectWithUser } from '@/models/Project/types'
import {
    getProjectServer,
    isFollowProject,
} from '@/services/trpc/server'
import ProjectWrapper from './_components/ProjectWrapper'

interface ProjectComponentProps {
    params: { pid: string }
}

export default async function ProjectPage({
    params,
}: ProjectComponentProps) {
    const session = await useAsyncAuth()

    const project = (await getProjectServer({
        id: parseInt(params.pid),
        joinUser: true,
    })) as ProjectWithUser

    if (!project) {
        return <div>Not found</div>
    }

    const isFollowed = await isFollowProject(project.id)

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
