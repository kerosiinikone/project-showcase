import { ProjectWithUser, SupportCount } from '@/models/Project/types'
import { useAsyncAuth } from '@/services/auth/util/useAsyncAuth'
import {
    getProjectServer,
    isFollowProject,
} from '@/services/trpc/server'
import { unstable_noStore as noStore } from 'next/cache'
import sanitize from 'sanitize-html'
import ProjectWrapper from './_components/ProjectWrapper'
import { getReadmeContents, kFormatter } from './_utils'

interface ProjectComponentProps {
    params: { pid: string }
}

export default async function ProjectPage({
    params,
}: ProjectComponentProps) {
    noStore()

    const opts = {
        id: parseInt(params.pid),
        joinUser: true,
    }
    const session = await useAsyncAuth()
    const project = (await getProjectServer(
        opts
    )) as ProjectWithUser & SupportCount

    const [isFollowed, readme] = await Promise.all([
        isFollowProject(project.id),
        getReadmeContents(project),
    ])

    if (!project) {
        return <div>Not found</div>
    }

    return (
        <div className="container h-full w-full flex justify-center items-center p-10">
            <ProjectWrapper
                session={session}
                project={project}
                supportCountFormatted={
                    project.supportCount
                        ? kFormatter(project.supportCount) // 1100 -> 1.1k & 600 -> 600
                        : null
                }
                readme={
                    readme
                        ? sanitize(readme, {
                              allowedTags: ['blockquote'],
                          })
                        : ''
                }
                isFollowed={isFollowed}
            />
        </div>
    )
}
