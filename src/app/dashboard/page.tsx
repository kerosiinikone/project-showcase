import { redirect } from 'next/navigation'
import UserSectionComponent from './_components/UserSection'
import { useAsyncAuth } from '@/hooks/useAsyncAuth'
import ProjectDashboard from './_components/ProjectDashboard'

export default async function DashboardComponent() {
    const session = await useAsyncAuth()

    // Change to a Middleware
    if (!session) {
        redirect('/auth/github')
    }

    return (
        <div className="container h-full w-full flex justify-center items-center p-10">
            <div className="flex flex-col justify-center h-full w-full">
                <UserSectionComponent
                    name={session.user?.name}
                    id={session.user?.id ?? 'No ID found'}
                    image={session.user?.image}
                />
                <ProjectDashboard />
            </div>
        </div>
    )
}
