import { getProjects } from '@/services/trpc/server'
import ProjectContainer from './_components/ProjectContainer'
import { ProjectTypeWithId } from '@/models/Project/types'
import { unstable_noStore as noStore } from 'next/cache'

export default async function MainPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    noStore()

    const tagsFromParams =
        'tag' in searchParams ? [searchParams['tag'] as string] : []

    const {
        data: initial,
        nextCursor,
        initialError,
    } = await getProjects({
        tags: tagsFromParams,
        stage: [],
    })

    return (
        <div className="container h-full w-full flex justify-center items-center p-10 pt-10">
            <div className="flex flex-col gap-4 h-full w-full pt-20 2xl:p-0">
                <div
                    id="info"
                    className="rounded-lg font-medium md:h-32 h-20"
                >
                    <div className="flex flex-col justify-center items-center">
                        <div className="flex flex-col justify-center items-center h-full w-full">
                            <h1 className="text-2xl">
                                Community Projects
                            </h1>
                            <div className="border-t-2 md:py-4 border-slate-200 w-64"></div>
                        </div>
                    </div>
                </div>
                <ProjectContainer
                    initialProjects={initial as ProjectTypeWithId[]}
                    initialNextCursor={
                        !tagsFromParams.length && nextCursor
                            ? nextCursor
                            : null
                    }
                    initialError={initialError ?? false}
                    tagsFromParam={tagsFromParams}
                />
            </div>
        </div>
    )
}
