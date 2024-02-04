import { UserType } from '@/models/User/types'
import { useAsyncAuth } from '@/services/auth/util/useAsyncAuth'
import {
    getAggregatedSupports,
    getBio,
    getProjectsByIdServer,
    getRepos,
    getUserById,
} from '@/services/trpc/server'
import { redirect } from 'next/navigation'
import ProjectDashboard from './_components/ProjectDashboard'
import UserSectionComponent from './_components/UserSection'

// Change later
async function fetchUserData(uid: string) {
    let results, e
    try {
        results = await Promise.all([
            getBio(),
            getRepos(),
            getUserById() as Promise<UserType>,
            getProjectsByIdServer({
                id: uid,
            }),
            getAggregatedSupports(),
        ])
        e = null
    } catch (error) {
        results = [...Array(5).fill(undefined)]
        e = error
    }

    return [...results, e] as const // Error last
}

export default async function DashboardComponent() {
    const session = await useAsyncAuth()

    if (!session) {
        redirect('/auth/github')
    }

    const [
        bio,
        repos,
        user,
        userProjects,
        aggregatedSupports,
        error,
    ] = await fetchUserData(session.user?.id!)

    if (error) {
        // Handle
    }

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
                    repos={repos}
                />
            </div>
        </div>
    )
}
