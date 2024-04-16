import { useAsyncAuth } from '@/services/auth/util/useAsyncAuth'
import { ProjectWithUser, SupportCount } from '@/models/Project/types'
import {
    getProjectServer,
    getReadmeFile,
    isFollowProject,
} from '@/services/trpc/server'
import sanitize from 'sanitize-html'
import ProjectWrapper from '../_components/ProjectWrapper'
import EditProjectWrapper from '../_components/EditProjectWrapper'

interface ProjectComponentProps {
    params: { pid: string }
}

export default async function ProjectEditPage({
    params,
}: ProjectComponentProps) {
    let readme

    const session = await useAsyncAuth()

    const opts = {
        id: parseInt(params.pid),
        joinUser: true,
    }

    const project = (await getProjectServer(
        opts
    )) as ProjectWithUser & SupportCount

    if (!project) {
        return <div>Not found</div>
    }

    return (
        <div className="container h-full w-full flex justify-center items-center p-10">
            <EditProjectWrapper session={session} project={project} />
        </div>
    )
}
