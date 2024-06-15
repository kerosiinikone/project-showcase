import { projectsCursor } from '@/operations/cursor'
import { useAsyncAuth } from '@/services/auth/util/useAsyncAuth'
import {
    getAggregatedSupportCount,
    getBio,
    getProjectsByIdServer,
    getRepos,
    getUserById,
} from '@/services/trpc/server'
import ProjectDashboard from './_components/ProjectDashboard'
import UserSectionComponent from './_components/user/UserContainer'
import { unstable_noStore as noStore } from 'next/cache'

export default async function DashboardComponent() {
    noStore()

    const session = await useAsyncAuth()

    const [bio, repos, user, userProjects, aggregatedSupports] =
        await Promise.all([
            getBio(),
            getRepos(),
            getUserById(),
            getProjectsByIdServer(),
            getAggregatedSupportCount(),
        ])

    return (
        <div className="container h-full w-full flex justify-center items-center p-10 py-20">
            <div className="flex flex-col justify-center h-full w-full">
                <UserSectionComponent
                    user={user}
                    aggregatedSupports={aggregatedSupports.value}
                    userBio={bio}
                    name={session!.user?.name}
                    id={session!.user?.id ?? 'No ID found'}
                    image={session!.user?.image}
                />
                <ProjectDashboard
                    projects={userProjects.data}
                    initialError={userProjects.initialError ?? false}
                    session={session!}
                    initialCursor={projectsCursor.serialize(
                        userProjects.data.at(-1)
                    )}
                    repos={repos}
                />
            </div>
        </div>
    )
}
