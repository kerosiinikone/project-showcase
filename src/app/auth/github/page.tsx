import LoginWithGithubButton from '@/app/_components/ui/LoginButton'
import { useAsyncAuth } from '@/services/auth/util/useAsyncAuth'
import { redirect } from 'next/navigation'

export default async function GithubAuthRedirect() {
    const session = await useAsyncAuth()

    if (session) {
        redirect('/dashboard')
    }

    return (
        <div className="container h-full w-full flex flex-col justify-center items-center p-10">
            <div className="flex flex-col justify-center items-center">
                <h1 className="text-2xl">Login</h1>
                <div className="border-t-2 py-4 border-slate-200 w-32"></div>
            </div>
            <LoginWithGithubButton />
        </div>
    )
}
