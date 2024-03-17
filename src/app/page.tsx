import { getProjects, getReadmeFile } from '@/services/trpc/server'
import ProjectContainer from './_components/ProjectContainer'
import { ProjectType } from '@/models/Project/types'
import { useAsyncAuth } from '@/services/auth/util/useAsyncAuth'
import { ReadmeResponse } from '@/services/octokit/types'

// Tags from URL params or search bar

export default async function MainPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const { data: initial, nextCursor } = await getProjects()

    return (
        <div className="container h-full w-full flex justify-center items-center p-10">
            <div className="flex flex-col gap-4 h-full w-full">
                <div
                    id="info"
                    className="rounded-lg font-medium h-32"
                >
                    <div className="flex flex-col justify-center items-center">
                        <div className="flex flex-col justify-center items-center h-full w-full">
                            <h1 className="text-2xl">
                                Community Projects
                            </h1>
                            <div className="border-t-2 py-4 border-slate-200 w-64"></div>
                        </div>
                    </div>
                </div>
                <ProjectContainer
                    initialProjects={initial as ProjectType[]}
                    initialNextCursor={nextCursor}
                />
            </div>
        </div>
    )
}
