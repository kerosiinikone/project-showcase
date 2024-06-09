import { useAsyncAuth } from '@/services/auth/util/useAsyncAuth'
import { ProjectWithUser, SupportCount } from '@/models/Project/types'
import {
    getProjectServer,
    getReadmeFile,
    isFollowProject,
} from '@/services/trpc/server'
import ProjectWrapper from './_components/ProjectWrapper'
import sanitize from 'sanitize-html'
import { b64DecodeUnicode, kFormatter } from './_utils'

interface ProjectComponentProps {
    params: { pid: string }
}

export default async function ProjectPage({
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

    const isFollowed = await isFollowProject(project.id)

    if (project.github_url) {
        const splitUrl = project.github_url.split('/')
        try {
            const contents = await getReadmeFile({
                repo: splitUrl[splitUrl.length - 1],
                user: project.author.name!,
            })

            if (contents.trim() !== '') {
                readme = b64DecodeUnicode(contents)
            }
        } catch (error) {
            readme = null
        }
    }

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
