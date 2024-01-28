import { redirect } from 'next/navigation'
import UserSectionComponent from './_components/UserSection'
import { useAsyncAuth } from '@/hooks/useAsyncAuth'
import ProjectDashboard from './_components/ProjectDashboard'
import {
    getProjectsByIdServer,
    getRepos,
    getUserById,
} from '@/services/trpc/server'
import { Session } from 'next-auth/types'
import { GithubAccountDBAdapter } from '@/services/auth'
import GithubApp from '@/services/octokit'
import { UserType } from '@/models/User/types'

// Move this elsewhere
async function getUserBio(session: Session | null) {
    try {
        const access_token =
            await GithubAccountDBAdapter.getGithubAccessToken(
                session?.user.id!
            )

        const githubInstance = new GithubApp(access_token)
        const bio = await githubInstance.getUserBio()

        return bio as string
    } catch (error) {
        return ''
    }
}

export default async function DashboardComponent() {
    const session = await useAsyncAuth()

    // Change to a Middleware
    if (!session) {
        redirect('/auth/github')
    }

    // Put into respective components
    const bio = await getUserBio(session)
    const repos = await getRepos()
    const userProjects = await getProjectsByIdServer({
        id: session?.user.id!,
    })
    const user = (await getUserById(session?.user.id!)) as UserType

    return (
        <div className="container h-full w-full flex justify-center items-center p-10">
            <div className="flex flex-col justify-center h-full w-full">
                <UserSectionComponent
                    user={user}
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
