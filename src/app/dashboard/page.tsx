import { UserType } from '@/models/User/types'
import { useAsyncAuth } from '@/services/auth/util/useAsyncAuth'
import {
    getAggregatedSupportCount,
    getBio,
    getProjectsByIdServer,
    getRepos,
    getUserById,
} from '@/services/trpc/server'
import { redirect } from 'next/navigation'
import ProjectDashboard from './_components/ProjectDashboard'
import UserSectionComponent from './_components/UserSection'
import { cursor } from '@/operations/cursor'

export default async function DashboardComponent() {
    const session = await useAsyncAuth()

    if (!session) {
        redirect('/auth/github')
    }

    const [bio, repos, user, userProjects, aggregatedSupports] =
        await Promise.all([
            getBio(),
            getRepos(),
            getUserById() as Promise<UserType>,
            getProjectsByIdServer(),
            getAggregatedSupportCount(),
        ])

    return (
        <div className="container h-full w-full flex justify-center items-center p-10">
            <div className="flex flex-col justify-center h-full w-full">
                <UserSectionComponent
                    user={user}
                    aggregatedSupports={aggregatedSupports.value}
                    userBio={bio}
                    name={session.user?.name}
                    id={session.user?.id ?? 'No ID found'}
                    image={session.user?.image}
                />
                <ProjectDashboard
                    projects={userProjects.data}
                    session={session}
                    initialCursor={cursor.serialize(
                        userProjects.data.at(-1)
                    )}
                    repos={repos}
                />
            </div>
        </div>
    )
}
