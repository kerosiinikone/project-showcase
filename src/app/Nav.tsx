'use client'

import { Dialog } from '@/components/ui/dialog'
import { LayoutDashboard, Target } from 'lucide-react'
import { Session } from 'next-auth'
import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'react-toastify'
import createProjectAction from './_actions/create-project-action'
import fetchUserRepos from './_actions/fetch-user-repos-action'
import NavItemLayout from './_components/NavItemLayout'
import CreateProjectButton from './_components/ui/CreateProjectButton'
import LoginWithGithubButton from './_components/ui/LoginButton'
import LogoutButton from './_components/ui/LogoutButton'
import CreateModalLayout from '@/components/CreateModal'
import { useRouter } from 'next/navigation'

export default function SideNavLayout({
    session,
}: {
    session: Session | null
}) {
    const router = useRouter()
    const [actionLoading, setActionLoading] = useState<boolean>(false)

    const [createState, dispatch] = useFormState(
        createProjectAction,
        {
            error: '',
            success: false,
        }
    )
    const [repoState, fetchReposAction] = useFormState(
        fetchUserRepos,
        null
    )

    useEffect(() => {
        setActionLoading(false)

        if (createState?.success) {
            router.refresh()
        } else if (createState?.error) {
            toast('Error: ' + createState.error, {
                position: 'bottom-center',
                autoClose: 5000,
                type: 'error',
                hideProgressBar: true,
                closeOnClick: true,
                progress: undefined,
                theme: 'colored',
            })
        }
    }, [createState])

    return (
        <>
            {process.env.NEXT_PUBLIC_ENVIRONMENT == 'test' && (
                <pre className="error">{createState?.error}</pre>
            )}
            <div
                id="default-sidebar"
                className="top-0 left-0 z-40 h-screen bg-slate-50 font-medium border-r-2 
            border-slate-100 w-0 xl:w-96"
                aria-label="Sidebar"
            >
                <div className="h-full overflow-y-auto">
                    <div className="grid grid-rows-8 w-full h-full">
                        <div className="flex flex-col justify-center items-center row-span-2 w-full h-full bg-slate-100">
                            <div>Project Showcase</div>
                        </div>
                        <div className="flex justify-center items-center row-span-5 h-full">
                            <ul className="space-y-4 h-full mt-10">
                                <NavItemLayout
                                    title="Projects"
                                    site=""
                                >
                                    <Target
                                        size={18}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 
                                    group-hover:text-gray-900"
                                    />
                                </NavItemLayout>
                                <NavItemLayout
                                    site="dashboard"
                                    title="Dashboard"
                                >
                                    <LayoutDashboard
                                        size={18}
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 
                                    group-hover:text-gray-900"
                                    />
                                </NavItemLayout>
                                <Dialog>
                                    <CreateModalLayout
                                        action="Create"
                                        title="Create A Project"
                                        subTitle="A new project"
                                        dispatch={dispatch}
                                        repos={repoState?.data ?? []}
                                        actionLoading={actionLoading}
                                        setActionLoading={
                                            setActionLoading
                                        }
                                    />
                                    {session && (
                                        <CreateProjectButton
                                            fetch={fetchReposAction}
                                        />
                                    )}
                                </Dialog>
                            </ul>
                        </div>

                        <div className="flex flex-col justify-center items-center row-span-1">
                            <div className="border-t-2 py-4 border-slate-200 w-32"></div>
                            <div className="flex flex-col justify-center items-center h-full w-full mb-10">
                                {!session ? (
                                    <LoginWithGithubButton />
                                ) : (
                                    <LogoutButton />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
