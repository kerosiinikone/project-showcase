import { useAsyncAuth } from '@/services/auth/util/useAsyncAuth'
import { ProjectWithUser } from '@/models/Project/types'
import {
    getProjectServer,
    getReadmeFile,
    isFollowProject,
} from '@/services/trpc/server'
import ProjectWrapper from './_components/ProjectWrapper'
import sanitize from 'sanitize-html'

interface ProjectComponentProps {
    params: { pid: string }
}

// Promise.all() the two API calls

const b64DecodeUnicode = (str: string) => {
    return decodeURIComponent(
        Array.prototype.map
            .call(atob(str), function (c) {
                return (
                    '%' +
                    ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                )
            })
            .join('')
    )
}

export default async function ProjectPage({
    params,
}: ProjectComponentProps) {
    let readme

    const session = await useAsyncAuth()

    const project = (await getProjectServer({
        id: parseInt(params.pid),
        joinUser: true,
    })) as ProjectWithUser
    const isFollowed = await isFollowProject(project.id)

    if (project.github_url) {
        const splitUrl = project.github_url.split('/')
        try {
            const contents = await getReadmeFile({
                repo: splitUrl[splitUrl.length - 1],
                user: project.author.name!,
            })

            if (contents !== '') {
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
