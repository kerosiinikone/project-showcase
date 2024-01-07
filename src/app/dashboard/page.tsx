import { redirect } from 'next/navigation'
import UserSectionComponent from './_components/UserSection'
import { useAsyncAuth } from '@/hooks/useAsyncAuth'
import ProjectDashboard from './_components/ProjectDashboard'
import { getProjectsServer, getRepos } from '@/services/trpc/server'
import { Session } from 'next-auth/types'
import { GithubAccountDBAdapter } from '@/services/auth'
import GithubApp from '@/services/octokit'

// Move this elsewhere
async function getUserBio(session: Session | null) {
    try {
        const access_token = await GithubAccountDBAdapter.getGithubAccessToken(
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
    // Put into respective components
    const session = await useAsyncAuth()
    const bio = await getUserBio(session)
    const repos = await getRepos()
    const userProjects = await getProjectsServer(session?.user.id!)

    // Change to a Middleware
    if (!session) {
        redirect('/auth/github')
    }

    return (
        <div className="container h-full w-full flex justify-center items-center p-10">
            <div className="flex flex-col justify-center h-full w-full">
                <UserSectionComponent
                    userBio={bio}
                    name={session.user?.name}
                    id={session.user?.id ?? 'No ID found'}
                    image={session.user?.image}
                />
                <ProjectDashboard projects={userProjects} repos={repos} />
            </div>
        </div>
    )
}
